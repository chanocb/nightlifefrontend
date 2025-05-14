
import { Event } from "./event.model";

export interface AccessType {
    reference: string;
    title: string;
    capacityMax: number;
    price: number;
    limitHourMax: string;
    numDrinks: number;
    event: Event;
  }