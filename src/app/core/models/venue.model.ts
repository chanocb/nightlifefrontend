import { User } from "@core/models/user.model";
import { Music } from "./music.model";
import { Product } from "./product.model";
import { Coordinate } from "./coordinate.model";

export interface Venue {
  reference: string;
  name: string;
  phone: string;
  LGTBFriendly: boolean;
  instagram: string;
  user: User;
  imageUrl: string;
  musicGenres: Music[];
  products: Product[];
  coordinate: Coordinate;
}