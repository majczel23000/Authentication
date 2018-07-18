import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { RegisterComponent } from './register/register.component';
import { ApiService } from './api.service';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AuthGuard } from './auth.guard';
import { RolesGuard } from './roles.guard';
import { TokenInterceptorService } from './token-interceptor.service';
import { InformationComponent } from './information/information.component';
import { AuthLoginGuard } from './auth-login.guard';
import { UserPanelComponent } from './user-panel/user-panel.component';
import { MessagesComponent } from './messages/messages.component';
import { UsersComponent } from './users/users.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    RegisterComponent,
    LoginComponent,
    DashboardComponent,
    InformationComponent,
    UserPanelComponent,
    MessagesComponent,
    UsersComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    RouterModule.forRoot([
      {
        path: 'register',
        component: RegisterComponent,
        canActivate: [AuthLoginGuard]
      },
      {
        path: 'login',
        component: LoginComponent,
        canActivate: [AuthLoginGuard]
      },
      {
        path: '',
        redirectTo: '/login',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        component: DashboardComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'information',
        component: InformationComponent
      },
      {
        path: 'userpanel',
        component: UserPanelComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'users',
        component: UsersComponent,
        canActivate: [RolesGuard]
      }
    ])
  ],
  providers: [
    ApiService,
    AuthGuard,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptorService,
      multi: true
    }

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
