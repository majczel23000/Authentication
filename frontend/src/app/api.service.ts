import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { Subject } from '../../node_modules/rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private firstname = new Subject<string>();
  firstnameString$ = this.firstname.asObservable();

  private lastname = new Subject<string>();
  lastnameString$ = this.lastname.asObservable();

  constructor(private http: HttpClient, private _router: Router) { }

  insertFirstname(data: string) {
    this.firstname.next(data);
  }
  insertLastname(data: string) {
    this.lastname.next(data);
  }

  registerUser(user){
    console.log("[registerUser]");
    this.http.post('http://localhost:3000/register', user)
    .subscribe(
      res => {
        console.log(res);
        localStorage.setItem('token', res['token']);
        localStorage.setItem('firstname', res['firstname']);
        localStorage.setItem('lastname', res['lastname']);
        console.log("Uzytkownik: ", res['firstname'], res['lastname']);
        //this.firstname = res['firstname'];
        this.insertFirstname(res['firstname']);
        this.insertLastname(res['lastname']);
        this._router.navigate(['/dashboard']);
      },
      err => {
        if(err instanceof HttpErrorResponse){
          if(err.status === 500){
            alert("Podany mail już istnieje, proszę wpisać inny");
          }
        }
    })
  };

  loginUser(user){
    console.log("[loginUser]");
    this.http.post('http://localhost:3000/login', user)
    .subscribe(
      res => {
        console.log(res);
        localStorage.setItem('token', res['token']);
        localStorage.setItem('firstname', res['firstname']);
        localStorage.setItem('lastname', res['lastname']);
        console.log("Uzytkownik: ", res['firstname'], res['lastname']);
        //this.firstname = res['firstname'];
        this.insertFirstname(res['firstname']);
        this.insertLastname(res['lastname']);
        this._router.navigate(['/dashboard']);
      },
      err=>{
        if(err instanceof HttpErrorResponse){
          if(err.status === 401){
            alert("Nieprawidłowy email");
          } else if(err.status === 402){
            alert("Nieprawidłowe hasło");
          }
        }
    })
  }

  dashboardAccess(){
    console.log("[dashboardAccess] returning http get method")
    return this.http.get<any>('http://localhost:3000/dashboard');
  }

  loggedIn(){
    // !! - zwraca typ boolean (jest lub nie), a nie wartosc itemu token
    // if(localStorage.getItem('token') == null){
    //   console.log("nei ma tokenu");
    //   return false;
    // }
    // else{
    //   console.log("jest token");
    //   return true;
    // }
    console.log("[loggedIn] Checking if there is token");
    return !!localStorage.getItem('token');
  }
  loggeddIn(){
    console.log("[LI loggedIn] Checking if there is token");
    return !!localStorage.getItem('token');
  }

  deleteToken500Error(){
    localStorage.removeItem('token');
    localStorage.removeItem('firstname');
    localStorage.removeItem('lastname');
    console.log("[deleteToken500Error] Token was successfully removed");
  }

  getToken(){
    console.log("[getToken] Getting token from local Storage");
    return localStorage.getItem('token');
  }

  logoutUser(){
    localStorage.removeItem('token');
    localStorage.removeItem('firstname');
    localStorage.removeItem('lastname');
    this._router.navigate[('/login')];
  }

  getFirstname(){
    return this.firstname;
  }

}
