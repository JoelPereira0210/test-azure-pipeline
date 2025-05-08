// import { JsonValue } from '@prisma/client/runtime/library';
// import { JsonValue } from '@prisma/client';
import { MembershipStatus, Society } from './society';

// export type JsonValue =
//   | string
//   | number
//   | boolean
//   | null
//   | JsonValue[]
//   | { [key: string]: JsonValue };

export interface ProfileImage {
  id: string;
  data: Buffer;
  userId: string;
  user: User;

}

export interface User {
  userId: string ;
  phoneNumber: String;
  firstName: string;
  lastName: string;
  password: string | null;
  gender: string | null ;
  flatNumber: string | null;
  buildingDoorNumber: string | null;
  address: string | null;
  state: any | null;
  country: any | null;
  pincode: string | null;
  profilePicture?: ProfileImage[] | null;
  isMember?: MembershipStatus | null;
  createdSociety?: Society[] | null;
}


