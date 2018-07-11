import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  constructor(private apiService: ApiService, private _router: Router) { }

  validationElements = [
    {
      "val": false,
      "message": ''
    },
    {
      "val": false,
      "message": ''
    },
    {
      "val": false,
      "message": ''
    },
    {
      "val": false,
      "message": ''
    }
  ]

  ngOnInit() {
  }

  registerUser(user){
    let validationResult = this.validateRegisterForm();
    console.log(this.validationElements);
    if(validationResult)
      this.apiService.registerUser(user);
    else{
      let info ='';
      for(let i = 0; i < this.validationElements.length; i++)
        if(this.validationElements[i].val == false)
          info += this.validationElements[i].message + "\n";
      alert(info);
    }
  }

  validateRegisterForm(){

    let firstname = (<HTMLInputElement>document.getElementsByName('firstname')[0]).value;
    let lastname = (<HTMLInputElement>document.getElementsByName('lastname')[0]).value;
    let email = (<HTMLInputElement>document.getElementsByName('email')[0]).value;
    let password = (<HTMLInputElement>document.getElementsByName('password')[0]).value;
    if(firstname === '' || firstname === 'null' || firstname === null || firstname === undefined){
      this.validationElements[0].val=false;
      this.validationElements[0].message="Firstname nie może być puste";
    } else{
      this.validationElements[0].val=true;
      this.validationElements[0].message="Poprawne";
    }
    if(lastname === '' || lastname === 'null' || lastname === null || lastname === undefined){
      this.validationElements[1].val=false;
      this.validationElements[1].message="Lastname nie może być puste";
    }else{
      this.validationElements[1].val=true;
      this.validationElements[1].message="Poprawne";
    }
    if(email === '' || email === 'null' || email === null || email === undefined){
      this.validationElements[2].val=false;
      this.validationElements[2].message="Email nie może być puste";
    }else{
      const reg = /^[a-z\d]+[\w\d.-]*@(?:[a-z\d]+[a-z\d-]+\.){1,5}[a-z]{2,6}$/i;
      this.validationElements[2].val=reg.test(email);
      if(this.validationElements[2].val)
        this.validationElements[2].message="Poprawne";
      else
        this.validationElements[2].message="Proszę wpisać poprawny adres email";
    }
    if(password === '' || password === 'null' || password === null || password === undefined){
      this.validationElements[3].val=false;
      this.validationElements[3].message="Password nie może być puste";
    }else{
      this.validationElements[3].val=true;
      this.validationElements[3].message="Poprawne";
    }
    for(let i = 0; i < this.validationElements.length; i++)
      if(this.validationElements[i].val==false)
        return false;
    return true;
  }

}
