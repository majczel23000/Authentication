var express = require('express');
var mongoose = require('mongoose');
var bodyparser = require('body-parser');
var User = require('./models/User');
var cors = require('cors');
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');

var app = express();

var db = mongoose.connect('mongodb://localhost:27017/meanAuthAngular', function(err, response){
    if(err)
        console.log("There is error in connecting with mongodb.");
    console.log("Connection has been added");
});

// okreslenie autoryzacji tokenu
function verifyToken(req, res, next) {
    if(!req.headers.authorization) {
      return res.status(401).send('Unauthorized request')
    }
    let token = req.headers.authorization.split(' ')[1]
    if(token === 'null') {
      return res.status(401).send('Unauthorized request')    
    }
    let payload = jwt.verify(token, 'secretKey')
    if(!payload) {
      return res.status(401).send('Unauthorized request')    
    }
    req.userId = payload.subject
    next()
  }

app.use(cors());

app.set('port', process.env.port || 3000);
app.use(bodyparser.json());
app.get('/', (req, res) => {
    res.send('hello');
})

// zmienna sluzy do kodowania hasla
var BRYPT_SALT_ROUNDS = 12;

// rejestracja uzytkownikow
app.post('/register', (req, res) => {
    var firstname = req.body.firstname;
    var lastname = req.body.lastname;
    var emaill = req.body.email;
    var password = req.body.password;

    //szukamy uzytkownika po emailu (ktory jest unikalny w kolekcji)
    User.findOne({email: emaill}, (error, user) =>{
        if(error){
            console.log("Problem with registering user. ", error);
        } else{
            if(!user){  // Można założyć użytkownika
                bcrypt.hash(password, BRYPT_SALT_ROUNDS)    // kodujemy hasło
                .then(function(hashedPassword){
                    // tworzymy nowy dokument (Usera)
                    var user = new User();
                    user.firstname = firstname;
                    user.lastname = lastname;
                    user.email = emaill;
                    user.password = hashedPassword;
                    // zapisujemy go w kolekcji
                    user.save((err, result) => {
                        if(err){
                            console.log("There is an error in adding user into collection");
                            res.send({success: "Failed to add user", status: 500});
                        }
                        // Nie ma błędu, tworzymy payload i token
                        let payload = { subject: result._id};
                        let token = jwt.sign(payload, 'secretKey');
                        // odpowiedź przesyła te dane do frontend'u
                        res.send({token, firstname, lastname, emaill});
                    });
                })
            } else{ // Emial podany w rejestracji już istnieje 
                res.status(500).send("Podany email już jest w bazie");
            }
        }
    })    
});

// Logowanie użytkowników
app.post('/login', (req, res) => {
    let userData = req.body;
    // szukamy użytkownika po emailu
    User.findOne({email: userData.email}, (error, user) => {
        if(error){
            console.log("There is an error with email.", error);
        } else{
           if(!user){ // gdy nie ma użytkownika o podanym emailu
               res.status(401).send("Invalid email");
           } else if(bcrypt.compareSync(userData.password, user.password) == false){
               res.status(402).send("Invalid password");    // wpisano błędne hasło
           } else {
               // tworzymy payload i token
               let payload = { subject: user._id};
               let token = jwt.sign(payload, 'secretKey');
               // przygotowujemy dane do wysłania do frontend'u
               var firstname = user.firstname;
               var lastname = user.lastname;
               var _email = user.email;
               var roles = user.roles;
               // w odpowiedzi wysyłamy dane frontend'owi
               res.status(200).send({token, firstname, lastname, _email, roles});
           }
        }
    });
});

// Usuwanie użytkownika po emailu
app.delete('/removeuser/:email', (req, res) => {
    // szukamy użytkownika o emailu podanych w params'ach
    User.findOneAndRemove({email: req.params.email}, function(err, user){
        if(err){
            res.send("Error deleting user.", err);
        } else {
            //w odpowiedzi wysyłamy dane usuwanego użytkownika
            res.json(user);
        }
    })
});

// Edytowanie użytkownika
app.put('/edit', (req, res) =>{
    let userData = req.body;
    let pass = userData.password;
    // gdy podano hasło w polu edycji na frontend'zie
    if(pass !== ''){
        // kodujemy hasło by porównać czy będzie takie samo jak w bazie
        bcrypt.hash(userData.password, BRYPT_SALT_ROUNDS)
        .then(function(hashedPassword){
            User.findOneAndUpdate({email: userData.email},{
                //edytujemy dane użytkownika
                $set: {firstname: userData.firstname, lastname: userData.lastname, password: hashedPassword}
            },
            {
                new: true
            }, function(err, updatedUser){
                if(err){
                    res.send("Error updating user.", err);
                } else {
                    // przygotowujemy dane do wysłania na frontend
                    var firstname = updatedUser.firstname;
                    var lastname = updatedUser.lastname;
                    // wysyłamy dane na frontend
                    res.status(200).send({firstname, lastname});
                }
            })       
        })  
    } else {    //jesli nie podano hasła, czyli ma zostać stare
        User.findOneAndUpdate({email: userData.email}, {
            // edytujemy dane użytkownika
            $set: {firstname: userData.firstname, lastname: userData.lastname}
        },
        {
            new: true
        }, function(err, updatedUser){
            if(err){
                res.send("Error updating user.", err);
            } else {
                // przygotowujemy dane do wysłania na frontend
                let firstname = updatedUser.firstname;
                let lastname = updatedUser.lastname;
                // wysyłamy dane na frontend
                res.status(200).send({firstname, lastname});
            }
        })
    }
        
});

// weryfikujemy czy użytkownik ma prawidłowy token
app.get('/verify', verifyToken, (req, res) =>{
    res.status(200);
})

// dostęp do userpanel
app.get('/userpanel', verifyToken, (req, res) =>{
    res.status(200);
})

// dostęp do panelu users
app.get('/users', verifyToken, (req, res) =>{
    // szukamy wszystkich userów
    User.find({}, function(err, users){
        if(err){
            res.send('something went wrong.', err);
            next();
        }
        // wysyłamy json'a w postaci wszystkich userów na frontend
        res.json(users);
    });
});

app.listen(app.get('port'), function(err, response){
    console.log("Server is running on port:", app.get('port'));
});

