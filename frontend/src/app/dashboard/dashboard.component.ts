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
    this.apiService.dashboardAccess()
    .subscribe(
      res => console.log("Access granted to dashboard"),
      err =>{
        if(err instanceof HttpErrorResponse){
          if(err.status === 401){
            this.router.navigate(['/login']);
          }
          if(err.status === 500){
            this.apiService.deleteToken500Error();
            this.router.navigate(['/login']);
          }
        }
      }
    )
  }
}
