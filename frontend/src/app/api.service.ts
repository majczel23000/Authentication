import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient, private _router: Router) { }

  registerUser(user){
    this.http.post('http://localhost:3000/register', user)
    .subscribe(res => {
      console.log(res);
      localStorage.setItem('token', res['token']);
      this._router.navigate(['/dashboard']);
    })
  };

  loginUser(user){
    this.http.post('http://localhost:3000/login', user)
    .subscribe(res => {
      console.log(res);
      localStorage.setItem('token', res['token']);
      this._router.navigate(['/dashboard']);
    })
  }

  dashboardAccess(){
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
    return !!localStorage.getItem('token');
  }

  deleteToken500Error(){
    localStorage.removeItem('token');
  }

  getToken(){
    return localStorage.getItem('token');
  }
}
