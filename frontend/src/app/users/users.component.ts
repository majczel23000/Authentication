import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { MessageService } from '../message.service';
@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {

  users = [];

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

  getLoggedUserEmail(){
    return this.apiService.getLoggedUserEmail();
  }

}
