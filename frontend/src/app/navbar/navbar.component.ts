import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  constructor(public apiService: ApiService, private _router: Router) { }

  ngOnInit() {
  }

  navbarBrandClick(){
    if(this.apiService.loggeddIn())
      this._router.navigate(['/dashboard']);
    else
      this._router.navigate(['/login']);
  }

}
