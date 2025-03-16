import { Injectable } from '@angular/core';
import { User } from '@core/models/user.model';
import {environment} from '@env';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { HttpService } from './http.service';
import {JwtHelperService} from '@auth0/angular-jwt';
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  static readonly END_POINT = environment.REST + '/users';
  private user: any;
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  isAuthenticated$ = this.isAuthenticatedSubject.asObservable();
  constructor(private readonly httpService: HttpService, private readonly router: Router) { }
  registerUser(user: User): Observable<User> {
    return this.httpService.post(AuthService.END_POINT, user);
  }

  login(email: string, password: string): Observable<User> {
    return this.httpService.authBasic(email,password)
    .post(AuthService.END_POINT + "/token")
    .pipe(
      map(jsonToken => {
          const jwtHelper = new JwtHelperService();
          this.user = jsonToken; 
          this.user.email = jwtHelper.decodeToken(jsonToken.token).user;  
          this.user.name = jwtHelper.decodeToken(jsonToken.token).name;
          this.user.role = jwtHelper.decodeToken(jsonToken.token).role;
          this.isAuthenticatedSubject.next(true); // Notificar a los observadores
          return this.user;
      })
  );
}

logout(): void {
  this.user = undefined;
  this.isAuthenticatedSubject.next(false); // Notificar que el usuario cerró sesión
  this.router.navigate(['']).then();
}

isAuthenticated(): boolean {
  return this.user != null && !(new JwtHelperService().isTokenExpired(this.user.token));
}

  

  
}
