import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { MessageService } from '../message.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {


  users = [];   //tablica użytkowników
  editingUserEmail;
  editingUserFirstname;
  editingUserLastname;

  constructor(private apiService: ApiService, private messageService: MessageService,
              private router: Router) { }

  ngAfterViewInit(){
    // po odpaleniu widoku pobierz z backend'u wszystkich użytkowników
    this.apiService.getUsers().subscribe(
      res => {
        for(let i = 0; i < res.length; i++){
          // wstaw każdego użytkownika do tablicy obiektów users
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

  // dane pojedynczego usera
  user = {
    firstname: '',
    lastname: '',
    email: ''
  };

  // Usunięcie usera z listy userów
  removeUser(e){
    // ukrycie formularze edycji (jesli byłby widoczny), w celu uniknięcie problemów
    document.getElementById('editForm').style.display="none";
    // confirm
    let decision = confirm("Na pewno?");
    if(decision){ // jesli tak
      // pobieramy element html który chcemy usunąć
      let help = e.target.parentNode.parentNode.children;
      let rowToDelete = e.target.parentNode.parentNode;
      // poieramy email z html'a
      let email = help[3].innerHTML;
      // odpalamy serwis
      this.apiService.removeUser(email).subscribe(
        res => {
          rowToDelete.remove(); //usuwamy wiersz z widoku
          console.log(res);     // w odpowiedzi powinny być dane użytkownika usuniętego
          this.messageService.add("Usunięto użytkownika " + res['firstname'] + " " + res['lastname'], true);
        },
        err => {
          this.messageService.add("Błąd podczas usuwania użytkownika", false);
        }
      );
    }
  }

  // zwraca email zalogowanego użytkownika
  // wykorzystywane podczas wyswietlania danych zalogowanego użytkownika
  // tzn. braku możliwosci edycji swoich danych z panelu users i braku możliwosci usunięcia samego siebie
  getLoggedUserEmail(){
    return this.apiService.getLoggedUserEmail();
  }

  // zapisywanie inputów, które potem można wykorzystać w editUserData
  editUser(e){
    // pokazanie formularza
    let form = document.getElementById('editForm');
    form.style.display="block";
    let help = e.target.parentNode.parentNode.children;
    let firstname = help[1].innerHTML;
    let lastname = help[2].innerHTML;
    // zapisanie inputów
    this.editingUserEmail = help[3];
    this.editingUserFirstname = help[1];
    this.editingUserLastname = help[2];
    // wpisanie value do inputów
    (<HTMLInputElement>form.children[0].children[1].children[0]).value = firstname;
    (<HTMLInputElement>form.children[1].children[1].children[0]).value = lastname;
  }

  // edytowanie użytkownika
  editUserData(user){
    if(user.firstname === '' || user.lastname === '' || user.password === ''){
      this.messageService.add("Prosze wypelnic wszystkie pola", false);
      return false;
    }
    // pobranie emaila
    user.email = this.editingUserEmail.innerHTML;
    // odpalenie serwisu do edycji
    this.apiService.editUserFromUsers(user).subscribe(
      res => {
        console.log(res); // odpowiedź od backend'u
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

  // przejscie do rejestracji użytkownika
  goToRegisterComponent(){
    this.router.navigate(['/register']);
  }

}
