import { Injectable } from '@angular/core';
import { User } from '@core/models/user.model';
import {environment} from '@env';
import { map, Observable } from 'rxjs';
import { HttpService } from './http.service';
import {JwtHelperService} from '@auth0/angular-jwt';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  static readonly END_POINT = environment.REST + '/users';
  user: any;
  constructor(private readonly httpService: HttpService) { }
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
          this.user.email = jwtHelper.decodeToken(jsonToken.token).user;  // secret key is not necessary
          this.user.name = jwtHelper.decodeToken(jsonToken.token).name;
          this.user.role = jwtHelper.decodeToken(jsonToken.token).role;
          return this.user;
      })
  );
}

  

  
}
