import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  messages: string[] = [];
  success: boolean = false;
  add(message: string, change: boolean) {
    this.setSuccess(change);
    let msg = document.getElementById("message");
    if(msg !== null)
      msg.style.display="block";
    this.messages[0] = message;
    setTimeout(function(){
      let msg = document.getElementById("message");
      msg.style.display="none";
      this.messages = [];
    },3000);
  }

  setSuccess(change: boolean){
    this.success = change;
  }

  getSuccess(){
    return this.success;
  }
}
