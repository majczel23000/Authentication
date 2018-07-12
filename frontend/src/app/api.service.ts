import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { Subject } from '../../node_modules/rxjs';
import { USER } from './User';

@Injectable({
  providedIn: 'root'
})
export class ApiService {


  constructor(private http: HttpClient, private _router: Router) { }

  registerUser(user){
    console.log("[registerUser]");
    this.http.post('http://localhost:3000/register', user)
    .subscribe(
      res => {
        console.log(res);
        localStorage.setItem('token', res['token']);
        localStorage.setItem('firstname', res['firstname']);
        localStorage.setItem('lastname', res['lastname']);
        localStorage.setItem('email', res['emaill']);
        console.log("Uzytkownik: ", res['firstname'], res['lastname']);
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
        localStorage.setItem('email', res['_email']);
        USER['firstname'] = res['firstname'];
        USER['lastname'] = res['lastname'];
        USER['emial'] = res['_email'];
        console.log("Uzytkownik: ", res['firstname'], res['lastname'], res['_email']);
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

  editUser(user){
    console.log("[EditUser]");
    this.http.put('http://localhost:3000/edit', user)
    .subscribe(
      res => {
        console.log(res);
        localStorage.setItem('firstname', res['firstname']);
        localStorage.setItem('lastname', res['lastname']);
      },
      err => {
        console.log(err);
      }
    );
  }

  dashboardAccess(){
    console.log("[dashboardAccess] returning http get method")
    return this.http.get<any>('http://localhost:3000/dashboard');
  }

  userPanelAccess(){
    console.log("[userPanelAccess] returning http get method")
    return this.http.get<any>('http://localhost:3000/userpanel');
  }

  loggedIn(){
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

}
