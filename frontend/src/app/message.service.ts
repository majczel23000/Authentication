import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  messages: string[] = [];

  add(message: string) {
    this.messages[0] = message;
    console.log(this.messages[0]);
    setTimeout(function(){
      let msg = document.getElementById("message");
      msg.style.display="none";
      this.messages = [];
    },3000);
  }
  clear() {
    this.messages = [];
  }
}
