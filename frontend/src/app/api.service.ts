import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { Subject } from '../../node_modules/rxjs';
import { USER } from './User';
import { MessageService } from './message.service';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient, private _router: Router, private messageService: MessageService) { }

  // Rejestracja użytkownika
  registerUser(user){
    console.log("[registerUser]");
    this.http.post('http://localhost:3000/register', user)
    .subscribe(
      res => {
        console.log(res); // res - odpowiedź z backend'u w przypadku powodzenia
        console.log("Zarejestrowano użytkownika: ", res['firstname'], res['lastname']);
        // przekierowanie do users, komunikat o powodzeniu
        this._router.navigate(['/users']);
        this.messageService.add("Zarejestrowano użytkownika: " + res['firstname'] +" " +res['lastname'], true);
      },
      err => {
        if(err instanceof HttpErrorResponse){
          if(err.status === 500){
            this.messageService.add('Podany mail już istnieje, proszę wpisać inny', false);
          }
        }
    })
  };

  // Logowanie użytkownika
  loginUser(user){
    console.log("[loginUser]");
    this.http.post('http://localhost:3000/login', user)
    .subscribe(
      res => {
        console.log(res); //odpowiedź od backendu w przypadku powodzenia
        // wpisuje do localStorage wszystkie dane użytkownika
        localStorage.setItem('token', res['token']);
        localStorage.setItem('firstname', res['firstname']);
        localStorage.setItem('lastname', res['lastname']);
        localStorage.setItem('email', res['_email']);
        localStorage.setItem('roles', JSON.stringify(res['roles']));
        //te trzy linijki chyba niepotrzebne :)
        USER['firstname'] = res['firstname'];
        USER['lastname'] = res['lastname'];
        USER['email'] = res['_email'];
        // ====
        console.log("Zalogowano użytkownika: ", res['firstname'], res['lastname'], res['_email']);
        this._router.navigate(['/dashboard']);
        // komunikat o powodzeniu na stronie
        this.messageService.add('Zalogowano pomyslnie', true);
      },
      err => {
        if(err instanceof HttpErrorResponse){
          if(err.status === 401){
            // komunikat : zły email
            this.messageService.add('Nieprawidłowy email', false);
          } else if(err.status === 402){
            // komunikat : złe hasło
            this.messageService.add('Nieprawidłowe hasło', false);
          }
        }
    })
  }

  // Edytowanie danych użytkownika
  editUser(user){
    console.log("[EditUser]");
    this.http.put('http://localhost:3000/edit', user)
    .subscribe(
      res => {
        console.log(res); // odpowiedź od backend'u w przypadku powodzenia
        // ustawienie nowych wartosci w localStorage, pokazanie wiadomosci
        localStorage.setItem('firstname', res['firstname']);
        localStorage.setItem('lastname', res['lastname']);
        this.messageService.add('Zedytowano dane', true);
      },
      err => {
        console.log(err);
        this.messageService.add('Napotkano błąd w trakcie edycji', false);
      }
    );
  }

  // Pobranie wszystkich użytkowników z kolekcji
  getUsers(){
    console.log("[getUsers()]");
    //<any> rozwiązuje problem "property length does not exist in type object" :)
    return this.http.get<any>('http://localhost:3000/users');
  }

  // Usuwanie użytkownika
  removeUser(email){
    console.log("[removeUser()]");
    return this.http.delete("http://localhost:3000/removeuser/"+email);
  }

  // Edytowanie użytkownika z panelu users ( a nie user )
  editUserFromUsers(user){
    console.log("[EditUser]");
    return this.http.put('http://localhost:3000/edit', user);
  }

  // Weryfikacja dostępu do dashboard
  loggedUserAccess(){
    console.log("[dashboardAcc+ess] returning http get method")
    return this.http.get<any>('http://localhost:3000/verify');
  }

  // Wylogowanie użytkownika = usunięcie danych z localStorage
  logoutUser(){
    localStorage.removeItem('token');
    localStorage.removeItem('firstname');
    localStorage.removeItem('lastname');
    localStorage.removeItem('roles');
    localStorage.removeItem('email');
    this._router.navigate[('/login')];  // przekierowanie do login
    this.messageService.add('Pomyslnie wylogowano', true);
  }

  // Sprawdzenie czy jest się zalogowanym (czy istnieje token)
  loggedIn(){
    return !!localStorage.getItem('token');
  }

  // Pobranie rul zalogowane użytkownika
  getRoles(){
    return JSON.parse(localStorage.getItem('roles'));
  }

  // Usunięcie danych z localStorage
  deleteToken500Error(){
    localStorage.removeItem('token');
    localStorage.removeItem('firstname');
    localStorage.removeItem('lastname');
    console.log("[deleteToken500Error] Token was successfully removed");
  }

  // Pobranie tokenu
  getToken(){
    console.log("[getToken] Getting token from local Storage");
    return localStorage.getItem('token');
  }

  // Pobranie adresu email zalogowanego użytkownika
  getLoggedUserEmail(){
    return localStorage.getItem('email');
  }

  // Dostęp do panelu userpanel
  userPanelAccess(){
    console.log("[userPanelAccess] returning http get method")
    return this.http.get<any>('http://localhost:3000/userpanel');
  }

  // Dostęp do panelu users
  usersAccess(){
    // pobieramy i parsujemy role
    let roles = JSON.parse(localStorage.getItem('roles'));
    if(roles !== null){   //jak jakies są
      for(let i = 0; i < roles.length; i++){
        if(roles[i] === 'USERS')  // jesli spotkamy tą USERS to true
          return true;
      }
      return false; // mamy role, ale nie USERS, czyli false
    }
    return false; // nie mamy żadnych rul, czyli false
  }













}
