import { ChangeDetectionStrategy, Component } from '@angular/core';
import { User } from '../../core/models/user.model';
import { Role } from '../../core/models/role.model';
import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {AuthService} from "@core/services/auth.service";
import { Observable } from 'rxjs';

@Component({
  selector: 'app-register',
  standalone:true,
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
  roles: Role[] = [Role.OWNER, Role.CLIENT];
  
  registeredUser$!: Observable<User>;
  
  constructor(private authService: AuthService) {}

  register(): void {
    this.registeredUser$ = this.authService.registerUser(this.user);
  }

}
