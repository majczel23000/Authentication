import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
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
      localStorage.setItem('token', res.token);
      this._router.navigate(['/dashboard']);
    })
  };

  loginUser(user){
    this.http.post('http://localhost:3000/login', user)
    .subscribe(res => {
      console.log(res);
      localStorage.setItem('token', res.token);
      this._router.navigate(['/dashboard']);
    })
  }
}
