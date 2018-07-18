import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { MessageService } from '../message.service';
import { last } from '../../../node_modules/@angular/router/src/utils/collection';
@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {

  users = [];

  editingUserEmail;
  editingUserFirstname;
  editingUserLastname;

  constructor(private apiService: ApiService, private messageService: MessageService) { }

  ngAfterViewInit(){
    this.apiService.getUsers().subscribe(
      res => {
        for(let i = 0; i < res.length; i++){
          this.users.push({firstname: res[i].firstname, lastname: res[i].lastname, email: res[i].email});
        }
        console.log(this.users);
        this.messageService.add("Pomyslnie wyswietlono liste użytkowników", true);
      },
      err => {
        this.messageService.add("Błąd w trakcie pobieranie użytkowników.", false);
      }
    );
  }

  ngOnInit() {
  }
  user = {
    firstname: '',
    lastname: '',
    email: ''
  };
  removeUser(e){
    let decision = confirm("Na pewno?");
    if(decision){
      let help = e.target.parentNode.parentNode.children;
      let rowToDelete = e.target.parentNode.parentNode;
      let email = help[3].innerHTML;
      this.apiService.removeUser(email).subscribe(
        res => {
          rowToDelete.remove();
          console.log(res);
          this.messageService.add("Pomylnie usuniete uzytkownika", true);
        },
        err => {
          this.messageService.add("Blad podczas usuwania", false);
        }
      );
    }
  }

  getLoggedUserEmail(){
    return this.apiService.getLoggedUserEmail();
  }

  editUser(e){
    let form = document.getElementById('editForm');
    form.style.display="block";
    let help = e.target.parentNode.parentNode.children;
    let firstname = help[1].innerHTML;
    let lastname = help[2].innerHTML;
    this.editingUserEmail = help[3];
    this.editingUserFirstname = help[1];
    this.editingUserLastname = help[2];
    console.log(firstname, lastname);
    form.children[0].children[1].children[0].value = firstname;
    form.children[1].children[1].children[0].value = lastname;
  }

  editUserData(user){
    if(user.firstname === '' || user.lastname === '' || user.password === ''){
      this.messageService.add("Prosze wypelnic wszystkie pola", false);
      return false;
    }
    user.email = this.editingUserEmail.innerHTML;
    this.apiService.editUserFromUsers(user).subscribe(
      res => {
        console.log(res);
        this.messageService.add('Zedytowano dane', true);
        document.getElementById('editForm').style.display="none";
        this.editingUserFirstname.innerHTML = user.firstname;
        this.editingUserLastname.innerHTML = user.lastname;
      },
      err => {
        console.log(err);
        this.messageService.add('Napotkano błąd w trakcie edycji', false);
      }
    );

  }

}
