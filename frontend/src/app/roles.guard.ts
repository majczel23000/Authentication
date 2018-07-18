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
      for(let i = 0; i < roles.length; i++){
        if(roles[i] === 'USERS'){
          console.log("[rolesGuard] There are roles");
          return true;
        }
      }
      this._router.navigate(['/dashboard']);
      return false;
    } else{
      console.log("[rolesGuard] no token");
      this._router.navigate(['/login']);
      return false;
    }

  };
}
