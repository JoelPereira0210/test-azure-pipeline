// Country type
interface Country {
    id: number;
    name: string;
    iso3: string;
    iso2: string;
    numeric_code: string;
    phone_code: number;
    capital: string;
    currency: string;
    currency_name: string;
    currency_symbol: string;
    tld: string;
    native: string;
    region: string;
    subregion: string;
    latitude: string;
    longitude: string;
    emoji: string;
    value: string;
}

// State type
interface State {
    id: number;
    name: string;
    state_code: string;
    value: string;
}

// BankDetails type
interface BankDetails {
    bank: string;
    accountNumber: string;
    IFSCCode: string;
    accountHolder: string;
    address: string;
}

// MembershipFees type
interface MembershipFees {
    amount: string;
    bankDetails: BankDetails;
}

// Society type
interface Society {
    societyName: string;
    societyDescription: string;
    buildingName: string;
    buildingDoorNumber: string;
    address: string;
    streetName: string;
    state: State;
    country: Country;
    pincode: string;
    logo: string; // Base64-encoded image
    membershipFees: MembershipFees;
}

// Main  type
export interface SocietyRegisterType {
    phoneNumber: string;
    firstName: string;
    lastName: string;
    flatNumber: string;
    buildingDoorNumber: string;
    address: string;
    streetName: string;
    country: Country;
    state: State;
    pincode: string;
    password: string;
    isAdmin: boolean;
    isMember: boolean;
    createSociety: Society[];
}


