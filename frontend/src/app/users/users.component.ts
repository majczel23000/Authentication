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
      },
      err => {
        this.messageService.add("Błąd w trakcie pobieranie użytkowników.", false);
      }
    );
  }

  ngOnInit() {
  }

}
