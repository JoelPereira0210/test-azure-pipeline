import { ProfileImage, User } from './user';

export enum MembershipStatus {
  Invited = "invited",
  InviteAccepted = "inviteAccepted",
  Enrolled = "enrolled",
}

export interface SocietyLogo {
  id: string;
  data: Buffer;
  societyId: string;
  society: Society;
}

export interface Society {
  societyId: string;
  societySubscriptionId: string;
  societyName: string;
  description: string;
  subscriptionStartDate: Date;
  subscriptionEndDate: Date;
  buildingDoorNumber: string;
  address: string;
  streetName: string;
  state: JSON;
  country: JSON;
  pincode: string;
  logo: SocietyLogo[];
  createdById: string;
  createdBy: User;
  isMember: MembershipStatus;
  users: User[];
}

export type SocietyRegisterRequest = {
  phoneNumber: string;
  firstName: string;
  lastName: string;
  gender: string;
  password: string;
  flatNumber: string;
  buildingDoorNumber: string;
  address: string;
  streetName: string;
  state: JSON;
  country: JSON;
  pincode: string;
  createSociety: {
    societyName: string;
    societyDescription: string;
    buildingName: string;
    buildingDoorNumber: string;
    address: string;
    streetName: string;
    state: JSON;
    country: JSON;
    pincode: string;
    membershipFees?: {
      amount: number;
      bankDetails: {
        bank: string;
        accountNumber: string;
        IFSCCode: string;
        accountHolder: string;
        address: string;
        accountName: string;
        branchName: string;

      }
    }
    logo?: string | undefined;
  }[]; // Optional field
}
