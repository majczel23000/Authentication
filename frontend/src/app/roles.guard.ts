import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class RolesGuard implements CanActivate {

  constructor(private _apiService: ApiService, private _router: Router){}

  canActivate(): boolean{

    if(this._apiService.loggedIn()){
      let roles = this._apiService.getRoles();
      if(roles === 'USERS'){
        console.log("[rolesGuard] There are roles");
        return true;
      } else{
        console.log("[rolesGuard] There aren't roles");
        this._router.navigate(['/dashboard']);
        return false;
      }
    } else{
      console.log("[authGuard] no token");
      this._router.navigate(['/login']);
      return false;
    }

  };
}
