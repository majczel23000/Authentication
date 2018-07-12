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
  }
}
