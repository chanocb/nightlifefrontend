import { ChangeDetectionStrategy, Component } from '@angular/core';
import { User } from '../../core/models/user.model';
import { Role } from '../../core/models/role.model';
import { NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {AuthService} from "@core/services/auth.service";

@Component({
  selector: 'app-register',
  standalone:true,
  imports: [NgIf, NgFor, FormsModule],
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
  
  //constructor(private authService: AuthService) {}

}
