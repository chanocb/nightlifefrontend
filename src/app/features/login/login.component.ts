import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@core/services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { User } from '@core/models/user.model';
import { tap } from 'rxjs/operators';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  email = '';
  password = '';
  showPassword: boolean = false;
  user$!: Observable<User | null>; // Observable para manejar la autenticación

  constructor(private authService: AuthService, private router: Router) {}

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  get isFormValid(): boolean {
    return this.email.trim() !== '' && this.password.trim() !== '';
  }

  login() {
    this.user$ = this.authService.login(this.email, this.password).pipe(
      tap(user => {
        if (user) {
          this.router.navigate(['/home']);
        }
      })
    );
  }
}