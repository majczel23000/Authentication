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
    this.apiService.loggedUserAccess()
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
    if(user.firstname === '')
      user.firstname = localStorage.getItem('firstname');
    if(user.lastname === '')
      user.lastname = localStorage.getItem('lastname');
    user.email = this.email = localStorage.getItem('email');
    this.firstname = user.firstname;
    this.lastname = user.lastname;
    //console.log(user);
    this.apiService.editUser(user);
  }
}
