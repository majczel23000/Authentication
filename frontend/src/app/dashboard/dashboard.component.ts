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
      res => console.log("Access to dashboard"),  //uzyskano dostęp do dashboard
      err =>{
        if(err instanceof HttpErrorResponse){
          if(err.status === 200){
            this.router.navigate(['/login']);   //nie ma dostępu, przekierowanie do logowania
          }
          if(err.status === 500){
            // nieautoryzowany dostęp, zamockowanie danych, usunięcie localStorage i przekierowanie
            console.log('Unauthorized access!!!');
            this.apiService.deleteToken500Error();
            this.router.navigate(['/login']);
          }
        }
      }
    )
  }
}
