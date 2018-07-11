import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private _apiService: ApiService, private _router: Router){}

  canActivate(): boolean{
    if(this._apiService.loggedIn()){
      console.log("[authGuard] There is token");
      return true;
    } else{
      console.log("[authGuard] no token");
      this._router.navigate(['/login']);
      return false;
    }
  };
}
