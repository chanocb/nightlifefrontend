import { Injectable } from '@angular/core';
import { User } from '@core/models/user.model';
import { environment } from '@env';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { HttpService } from './http.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  static readonly END_POINT = environment.REST + '/users';
  private user: any;
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor(private readonly httpService: HttpService, private readonly router: Router) {
    this.loadUserFromStorage();
  }

  private loadUserFromStorage(): void {
    const userFromStorage = sessionStorage.getItem('user');
    if (userFromStorage) {
      this.user = JSON.parse(userFromStorage);
      this.isAuthenticatedSubject.next(true);
    }
  }

  registerUser(user: User): Observable<User> {
    return this.httpService.post(AuthService.END_POINT, user);
  }

  login(email: string, password: string): Observable<User> {
    return this.httpService
      .authBasic(email, password)
      .post(AuthService.END_POINT + '/token')
      .pipe(
        map((jsonToken) => {
          const jwtHelper = new JwtHelperService();
          this.user = jsonToken;
          this.user.email = jwtHelper.decodeToken(jsonToken.token).user;
          this.user.name = jwtHelper.decodeToken(jsonToken.token).name;
          this.user.role = jwtHelper.decodeToken(jsonToken.token).role;
          sessionStorage.setItem('user', JSON.stringify(this.user));
          this.isAuthenticatedSubject.next(true);
          return this.user;
        })
      );
  }

  logout(): void {
    this.user = undefined;
    this.isAuthenticatedSubject.next(false);
    sessionStorage.removeItem('user');
    this.router.navigate(['']).then();
  }

  isAuthenticated(): boolean {
    const userFromStorage = sessionStorage.getItem('user');
    if (userFromStorage) {
      this.user = JSON.parse(userFromStorage);
      const jwtHelper = new JwtHelperService();
      return !jwtHelper.isTokenExpired(this.user.token);
    }
    return false;
  }

  getProfile(): Observable<User> {
    const email = this.user?.email;
    if (!email) {
      console.error('Error: Usuario no autenticado');
      throw new Error('Usuario no autenticado');
    }
    return this.httpService.get(`${AuthService.END_POINT}/${email}`);
  }

  updateProfile(user: User): Observable<User> {
    const email = this.user?.email;
    if (!email) {
      console.error('Error: Usuario no autenticado');
      throw new Error('Usuario no autenticado');
    }
    return this.httpService.put(`${AuthService.END_POINT}/${email}`, user);
  }

  getToken(): string {
    return this.user ? this.user.token : undefined;
  }
}