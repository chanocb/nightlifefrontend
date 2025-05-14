import { AccessType } from "./access-type.model";
import { ReservationStatus } from "./reservationstatus.model";
import { User } from "./user.model";

export interface Reservation {
    reference: string;
    accessType: AccessType;
    user: User;
    finalPrice: number;
    status: ReservationStatus;
    purchasedDate: string;
    qrCode?: string;
  }