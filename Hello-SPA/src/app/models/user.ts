import { Photo } from "./photo";

export interface User {
  id: number;
  userName: string;
  knownAs: string;
  age: number;
  gender: string;
  created: Date;
  lastActive: Date;
  photoUrl: string;
  alpha2Code: string;
  interests?: string;
  introduction?: string;
  lookingFor?: string;
  photos?: Photo[];
  country: string;
}
