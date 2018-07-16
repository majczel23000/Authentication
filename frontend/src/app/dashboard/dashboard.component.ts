import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  constructor(private apiService: ApiService,
              private router: Router) { }

  ngOnInit() {
    this.apiService.loggedUserAccess()
    .subscribe(
      res => console.log("Access to dashboard"),
      err =>{
        if(err instanceof HttpErrorResponse){
          if(err.status === 200){
            console.log("Dashboard okej");
            this.router.navigate(['/login']);
          }
          if(err.status === 500){
            console.log('Unauthorized access!!!');
            this.apiService.deleteToken500Error();
            this.router.navigate(['/login']);
          }
        }
      }
    )
  }
}
