import { Component, OnInit} from '@angular/core';
import { ApiService } from '../api.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  firstname: string;
  lastname: string;
  constructor(public apiService: ApiService, private _router: Router) {

   }

  title = "Content Management Application";
  ngOnInit() {
    this.firstname = localStorage.getItem('firstname');
    this.lastname = localStorage.getItem('lastname');
    this.apiService.firstnameString$.subscribe(
      data =>{
        this.firstname = data;
        if(this.firstname == '')
          this.firstname = localStorage.getItem('firstname');
      }
    );
    this.apiService.lastnameString$.subscribe(
      data => {
        this.lastname = data;
        if(this.lastname == '')
          this.lastname = localStorage.getItem('lastname');
      }
    )
  }

  navbarBrandClick(){
    if(this.apiService.loggeddIn())
      this._router.navigate(['/dashboard']);
    else
      this._router.navigate(['/login']);
  }

}
