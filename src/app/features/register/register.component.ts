import { ChangeDetectionStrategy, Component } from '@angular/core';
import { User } from '../../core/models/user.model';
import { Role } from '../../core/models/role.model';
import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { FormBuilder, FormsModule  } from '@angular/forms';
import { AuthService } from "@core/services/auth.service";
import { Observable } from 'rxjs';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [NgIf, NgFor, FormsModule, AsyncPipe],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterComponent {
  user: User = {
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    phone: '',
    birthDate: '',
    role: Role.CLIENT
  };
  confirmPassword!: String;
  roles: Role[] = [Role.OWNER, Role.CLIENT];
  
  registeredUser$!: Observable<User>;
  
  constructor(private authService: AuthService, private fb: FormBuilder) {
    
  }

  // Validación del email con expresión regular
  emailValid(): boolean {
    const emailPattern = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/;
    return emailPattern.test(this.user.email);
  }

  register(): void {
    
    this.registeredUser$ = this.authService.registerUser(this.user);
  }
}
