import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '@core/models/user.model';
import {environment} from '@env';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  static readonly END_POINT = environment.REST + '/users'
  constructor(private http: HttpClient) { }
  registerUser(user: User): Observable<User> {
    return this.http.post<User>(AuthService.END_POINT, user);
  }
}
