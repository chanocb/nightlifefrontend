import { Venue } from "./venue.model";

export interface Event {
    reference: string;
    name: string;
    description: string;
    dateTime: string;
    venue: Venue;
  }