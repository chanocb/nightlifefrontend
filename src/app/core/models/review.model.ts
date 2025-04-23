import { User } from "./user.model";
import { Venue } from "./venue.model";

export interface Review {
  reference?: string;
    title: string;
    opinion: string;
    rating: number;
    user: User;
    venue: Venue;
  }