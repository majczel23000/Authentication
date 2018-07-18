import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  // tablica zawiera wiadomosci, tak naprawde jedną wiadomosć
  messages: string[] = [];
  // success - służy do okreslenia klasy nadanej wyswietlonej wiadomosci
  success: boolean = false;

  // Dodanie wiadomosci
  add(message: string, change: boolean) {
    this.setSuccess(change);  //zmiana success
    let msg = document.getElementById("message"); // pobranie div'a w którym będzie wiadomosć
    if(msg !== null)
      msg.style.display="block";  // wyswitlamy go, gdy jest w DOM'ie strony
    this.messages[0] = message;   // wstawiamy wiadomosć
    // timeout, po którym wiadomosć zniknie
    setTimeout(function(){
      let msg = document.getElementById("message");
      msg.style.display="none"; // ukrycie div'a wiadomosci
      this.messages = []; // wyczysczenie wiadomosci
    },3000);
  }

  // ustawienie success
  setSuccess(change: boolean){
    this.success = change;
  }

  // pobranie success (wykorzystywane w message.component.html do okreslenia klasy)
  getSuccess(){
    return this.success;
  }
}
