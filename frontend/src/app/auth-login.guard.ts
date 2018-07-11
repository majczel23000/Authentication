import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class AuthLoginGuard implements CanActivate {

  private previous: string;

  constructor(private _apiService: ApiService, private _router: Router){
    this.previous = this._router.url;
  }

  canActivate(next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean{
    if(this._apiService.loggedIn()){
      console.log("[authLogin] There is token, you can't go to login page when you are logged, please log out");
      this._router.navigate(['/dashboard']);
      console.log(this.previous);
      return false;
    } else{
      console.log("[authLogin] There is no token, you can do this");
      //this._router.navigate(['/login']);
      return true;
    }
  };
}
