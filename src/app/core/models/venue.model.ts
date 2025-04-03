import { User } from "@core/models/user.model";
import { Music } from "./music.model";

export interface Venue {
  reference: string; 
    name: string;
    phone: string;
    LGTBFriendly: boolean;
    instagram: string;
    user: User;
    imageUrl:string;
    musicGenres: Music[];
  }