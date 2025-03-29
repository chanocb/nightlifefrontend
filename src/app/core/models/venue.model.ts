import { User } from "@core/models/user.model";

export interface Venue {
  reference: string; 
    name: string;
    phone: string;
    LGTBFriendly: boolean;
    instagram: string;
    user: User;
    imageUrl:string;
  }