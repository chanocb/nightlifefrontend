import { Injectable } from '@angular/core';
import { User } from '@core/models/user.model';
import {environment} from '@env';
import { Observable } from 'rxjs';
import { HttpService } from './http.service';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  static readonly END_POINT = environment.REST + '/users';
  constructor(private readonly httpService: HttpService) { }
  registerUser(user: User): Observable<User> {
    return this.httpService.post(AuthService.END_POINT, user);
  }

  login(email: string, password: string): Observable<User> {
    return this.httpService.post(AuthService.END_POINT + "/login", { email, password });
  }

  

  
}
