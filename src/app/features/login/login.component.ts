import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@core/services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { User } from '@core/models/user.model';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  email = '';
  password = '';
  showPassword: boolean = false;
  user$!: Observable<User>; // Observable para manejar la autenticación

  constructor(private authService: AuthService, private router: Router) {}

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  get isFormValid(): boolean {
    return this.email.trim() !== '' && this.password.trim() !== '';
  }

  login() {
    this.authService.login(this.email, this.password).subscribe(
      (user) => {
        if(user){
          this.router.navigate(['/home'])
          console.log('Usuario autenticado: ', this.user$);
        }});
  }
}