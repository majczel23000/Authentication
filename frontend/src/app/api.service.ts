import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient, private _router: Router) { }

  registerUser(user){
    console.log("[registerUser]");
    this.http.post('http://localhost:3000/register', user)
    .subscribe(res => {
      console.log(res);
      localStorage.setItem('token', res['token']);
      this._router.navigate(['/dashboard']);
    })
  };

  loginUser(user){
    console.log("[loginUser]");
    this.http.post('http://localhost:3000/login', user)
    .subscribe(res => {
      console.log(res);
      localStorage.setItem('token', res['token']);
      this._router.navigate(['/dashboard']);
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
    console.log("[deleteToken500Error] Token was successfully removed");
  }

  getToken(){
    console.log("[getToken] Getting token from local Storage");
    return localStorage.getItem('token');
  }

  logoutUser(){
    localStorage.removeItem('token');
    this._router.navigate[('/login')];
  }
}
