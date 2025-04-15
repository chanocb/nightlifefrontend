import { User } from "./user.model";
import { Venue } from "./venue.model";

export interface Review {
    title: string;
    opinion: string;
    rating: number;
    user: User;
    venue: Venue;
  }