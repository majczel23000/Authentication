import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private apiService: ApiService) { }

  ngOnInit() {
  }

  loginUser(user){
    // user - dane wpisane w formularzu (email, password)
    this.apiService.loginUser(user);
  }

}
