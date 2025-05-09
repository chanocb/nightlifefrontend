import { AccessType } from "./access-type.model";
import { Venue } from "./venue.model";

export interface Event {
    reference: string;
    name: string;
    description: string;
    dateTime: string;
    venue: Venue;
    accessTypes?: AccessType[];
  }