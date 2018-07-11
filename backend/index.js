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


var BRYPT_SALT_ROUNDS = 12;
app.post('/register', (req, res) => {
    var firstname = req.body.firstname;
    var lastname = req.body.lastname;
    var emaill = req.body.email;
    var password = req.body.password;

    User.findOne({email: emaill}, (error, user) =>{
        if(error){
            console.log("Problem upsss");
        } else{
            if(!user){  //to znaczy ze mozna zalozyc
                bcrypt.hash(password, BRYPT_SALT_ROUNDS)
                .then(function(hashedPassword){
                    var user = new User();
                    user.firstname = firstname;
                    user.lastname = lastname;
                    user.email = emaill;
                    user.password = hashedPassword;
                    user.save((err, result) => {
                        if(err){
                            console.log("There is an error in adding user in database");
                            res.send({success: "Failed to add user", status: 500});
                        }
                        let payload = { subject: result._id};
                        let token = jwt.sign(payload, 'secretKey');
                        res.send({token, firstname, lastname});
                    });
                })
            } else{ //to znaczy ze jest juz takie email
                res.status(500).send("Istnieje juz taki email");
            }
        }
    })

    
});

app.post('/login', (req, res) => {
    let userData = req.body;
    
    User.findOne({email: userData.email}, (error, user) => {
        if(error){
            console.log("There is an error with email.", error);
        } else{
           if(!user){
               res.status(401).send("Invalid email");
           } else if(bcrypt.compareSync(userData.password, user.password) == false){
               res.status(401).send("Invalid password");
           } else {
               let payload = { subject: user._id};
               let token = jwt.sign(payload, 'secretKey');
               var firstname = user.firstname;
               var lastname = user.lastname;
               res.status(200).send({token, firstname, lastname});
           }
        }
    });
});

app.get('/dashboard', verifyToken, (req, res) =>{
    res.status(200);
})

app.listen(app.get('port'), function(err, response){
    console.log("Server is running on port:", app.get('port'));
});