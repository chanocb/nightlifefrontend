import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EMPTY, Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { AppError } from '@core/models/app-error.model';

@Injectable({ providedIn: 'root' })
export class HttpService {
  static readonly CONNECTION_REFUSE = 0;
  static readonly UNAUTHORIZED = 401;
  static readonly BAD_REQUEST = 400;
  static readonly NOT_FOUND = 404;

  private headers: HttpHeaders = new HttpHeaders();
  private params: HttpParams = new HttpParams();
  private responseType: string = 'json';
  private successfulNotification: string | undefined = undefined;
  private errorNotification: string | undefined = undefined;

  constructor(
    private readonly http: HttpClient,
    private readonly snackBar: MatSnackBar,
    private readonly router: Router
  ) {
    this.resetOptions();
  }

  param(key: string, value: string): this {
    if (value != null) {
      this.params = this.params.append(key, value);
    }
    return this;
  }

  paramsFrom(dto: any): this {
    Object.getOwnPropertyNames(dto).forEach(item => this.param(item, dto[item]));
    return this;
  }

  successful(notification = 'Successful'): this {
    this.successfulNotification = notification;
    return this;
  }

  error(notification: string): this {
    this.errorNotification = notification;
    return this;
  }

  pdf(): this {
    this.responseType = 'blob';
    this.header('Accept', 'application/pdf , application/json');
    return this;
  }

  post(endpoint: string, body?: object): Observable<any> {
    return this.http
      .post(endpoint, body, this.createOptions())
      .pipe(
        map(response => this.extractData(response)),
        catchError(error => this.handleError(error))
      );
  }

  get(endpoint: string): Observable<any> {
    return this.http
      .get(endpoint, this.createOptions())
      .pipe(
        map(response => this.extractData(response)),
        catchError(error => this.handleError(error))
      );
  }

  put(endpoint: string, body?: object): Observable<any> {
    return this.http
      .put(endpoint, body, this.createOptions())
      .pipe(
        map(response => this.extractData(response)),
        catchError(error => this.handleError(error))
      );
  }

  patch(endpoint: string, body?: object): Observable<any> {
    return this.http
      .patch(endpoint, body, this.createOptions())
      .pipe(
        map(response => this.extractData(response)),
        catchError(error => this.handleError(error))
      );
  }

  delete(endpoint: string): Observable<any> {
    return this.http
      .delete(endpoint, this.createOptions())
      .pipe(
        map(response => this.extractData(response)),
        catchError(error => this.handleError(error))
      );
  }

  authBasic(email: string, password: string): HttpService {
    return this.header('Authorization', 'Basic ' + btoa(email + ':' + password));
  }

  header(key: string, value: string): HttpService {
    if (value != null) {
      this.headers = this.headers.append(key, value);
    }
    return this;
  }

  private resetOptions(): void {
    this.headers = new HttpHeaders();
    this.params = new HttpParams();
    this.responseType = 'json';
  }

  private createOptions(): any {
    const options: any = {
      headers: this.headers,
      params: this.params,
      responseType: this.responseType,
      observe: 'response'
    };
    this.resetOptions();
    return options;
  }

  private extractData(response: any): any {
    if (this.successfulNotification) {
      this.snackBar.open(this.successfulNotification, '', { duration: 2000 });
      this.successfulNotification = undefined;
    }
    const contentType = response.headers.get('content-type');
    if (contentType) {
      if (contentType.indexOf('application/pdf') !== -1) {
        const blob = new Blob([response.body], { type: 'application/pdf' });
        window.open(window.URL.createObjectURL(blob));
      } else if (contentType.indexOf('application/json') !== -1) {
        return response.body;
      }
    } else {
      return response;
    }
  }

  private showError(notification: string): void {
    if (this.errorNotification) {
      this.snackBar.open(this.errorNotification, '', { duration: 5000 });
      this.errorNotification = undefined;
    } else {
      this.snackBar.open(notification, '', { duration: 5000 });
    }
  }

  private handleError(response: any): any {
    let error: AppError;

    if (response.status === HttpService.UNAUTHORIZED) {
        this.showError('Unauthorized');
        return EMPTY;
    } else if (response.status === HttpService.CONNECTION_REFUSE) {
        this.showError('Connection Refuse');
        return EMPTY;
    } else if (response.status === HttpService.NOT_FOUND) {
        return throwError(() => ({ status: 404, message: 'Not found' }));
    } else if (response.status === HttpService.BAD_REQUEST) {
        try {
            error = response.error;
            let errorMessage = error.message || response.message || 'Unknown error';
            if (error && typeof error === 'object' && !Array.isArray(error)) {
                errorMessage = Object.values(error).join('\n');
            }
            const duplicateKeyMatch = errorMessage.match(/Key \((.*?)\)=\((.*?)\) already exists/);
            if (duplicateKeyMatch) {
                const duplicatedField = duplicateKeyMatch[1]; 
                if (duplicatedField === 'email') {
                    errorMessage = 'Email already registered';
                } else {
                    errorMessage = `${duplicatedField} already registered`;
                }
            }

            this.showError(errorMessage);
            return throwError(() => error);
        } catch (e) {
            this.showError('Not response');
            return throwError(() => response.error);
        }
    } else {
        this.showError('Unexpected error');
        return throwError(() => response.error);
    }
  }
}