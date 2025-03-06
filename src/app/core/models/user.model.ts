export interface User {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone: string;
    birthDate: string;
    role: 'OWNER' | 'CLIENT';
  }