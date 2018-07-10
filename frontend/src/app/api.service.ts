import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) { }

  registerUser(user){
    this.http.post('http://localhost:3000/register', user)
    .subscribe(res => {
      console.log(res);
      localStorage.setItem('token', res.token);
    })
  };

  loginUser(user){
    this.http.post('http://localhost:3000/login', user)
    .subscribe(res => {
      console.log(res);
      localStorage.setItem('token', res.token);
    })
  }
}
