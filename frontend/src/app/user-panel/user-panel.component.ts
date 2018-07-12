import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { USER } from '../User';
@Component({
  selector: 'app-user-panel',
  templateUrl: './user-panel.component.html',
  styleUrls: ['./user-panel.component.css']
})
export class UserPanelComponent implements OnInit {

  firstname = localStorage.getItem('firstname');
  lastname = localStorage.getItem('lastname');
  email = localStorage.getItem('email');

  constructor(private apiService: ApiService,
              private router: Router) { }

  ngOnInit() {
    this.apiService.userPanelAccess()
    .subscribe(
      res => console.log("Access to panel"),
      err =>{
        if(err instanceof HttpErrorResponse){
          if(err.status === 200){
            console.log("userPanel okej");
            this.router.navigate(['/login']);
          }
          if(err.status === 500){
            this.apiService.deleteToken500Error();
            this.router.navigate(['/login']);
          }
        }
      }
    )
  }

  ngAfterViewInit(){
    this.firstname = localStorage.getItem('firstname');
    this.lastname = localStorage.getItem('lastname');
    this.email = localStorage.getItem('email');
  }
  private formDisplay = false;
  showHideForm(){
    if(!this.formDisplay){
      document.getElementById("editForm").style.display="block";
      this.formDisplay = true;
    } else{
      document.getElementById("editForm").style.display="none";
      this.formDisplay = false;
    }
  }

  editUserData(user){
    let validationResult = this.validateEditForm();
    if(validationResult){
      user.email = this.email = localStorage.getItem('email');
      this.apiService.editUser(user);
    } else{
      let info ='';
      for(let i = 0; i < this.validationElements.length; i++)
        if(this.validationElements[i].val == false)
          info += this.validationElements[i].message + "\n";
      alert(info);
    }

  }

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
    }
  ]

  validateEditForm(){

    let firstname = (<HTMLInputElement>document.getElementsByName('firstname')[0]).value;
    let lastname = (<HTMLInputElement>document.getElementsByName('lastname')[0]).value;
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
    if(password === '' || password === 'null' || password === null || password === undefined){
      this.validationElements[2].val=false;
      this.validationElements[2].message="Password nie może być puste";
    }else{
      this.validationElements[2].val=true;
      this.validationElements[2].message="Poprawne";
    }
    for(let i = 0; i < this.validationElements.length; i++)
      if(this.validationElements[i].val==false)
        return false;
    return true;
  }
}
