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

  // pobieram z localStorage dane uzytkownika
  firstname = localStorage.getItem('firstname');
  lastname = localStorage.getItem('lastname');
  email = localStorage.getItem('email');

  constructor(private apiService: ApiService,
              private router: Router) { }

  ngOnInit() {
    // sprawdzam możliwosć dostępu do tego komponentu
    this.apiService.loggedUserAccess()
    .subscribe(
      res => console.log("Access to panel"),  // mam dostęp
      err =>{
        if(err instanceof HttpErrorResponse){
          if(err.status === 200){
            this.router.navigate(['/login']); //przekierowanie do login
          }
          if(err.status === 500){
            // brak dostępu, kasowanie localStorage, przekierowanie do login
            this.apiService.deleteToken500Error();
            this.router.navigate(['/login']);
          }
        }
      }
    )
  }


  ngAfterViewInit(){
    // po odpaleniu widoku pobieram dane z localStorage
    this.firstname = localStorage.getItem('firstname');
    this.lastname = localStorage.getItem('lastname');
    this.email = localStorage.getItem('email');
  }

  // zmienna okreslająca widocznosć formularza edycji danych użytkownika
  private formDisplay = false;

  // pokazanie/ukrycie formularza
  showHideForm(){
    if(!this.formDisplay){
      document.getElementById("editForm").style.display="block";
      this.formDisplay = true;
    } else{
      document.getElementById("editForm").style.display="none";
      this.formDisplay = false;
    }
  }

  // edytowanie danych użytkownika, user - dane wpisane w formularzu
  editUserData(user){
    if(user.firstname === '') // firstname puste - pobieramy aktualną wartosć z localStorage
      user.firstname = localStorage.getItem('firstname');
    if(user.lastname === '')  // lastname puste - pobieramy aktualną wartosć z localStorage
      user.lastname = localStorage.getItem('lastname');
    user.email = this.email = localStorage.getItem('email');
    this.firstname = user.firstname;
    this.lastname = user.lastname;
    // użycie serwisu
    this.apiService.editUser(user);
  }
}
