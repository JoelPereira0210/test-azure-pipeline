// //alister
// export interface CreateEventType {
//     eventName: string;                     // Name of the event
//     eventDescription: string;              // Description of the event
//     registrationDueDate: string;           // Registration due date in string format
//     eventStartDate: string;                // Start date of the event in string format
//     eventEndDate: string;                  // End date of the event in string format
//     eventStartTime: string;                // Start time of the event in string format
//     eventEndTime: string;                  // End time of the event in string format
//     uploadedFiles?: File[];                // Optional array of uploaded files (max 3 images)
//     eventType: 'paid' | 'free';            // Enum for event type, either 'paid' or 'free'
//     maxAttendees?: number;                 // Optional number of attendees (required for paid events)
//     amountPerPerson?: number;              // Optional amount per person (required for paid events)
//     allowFamilyAndFriends: boolean;        // Boolean to toggle allowing family and friends
// }
// src/lib/types/createEvent.types.ts


  

export interface CreateEventType {
    eventName: string;
    eventDescription: string;
    registrationDueDate: string; // Date as a string, consider using Date type if possible
    eventStartDate: string;      // Date as a string, consider using Date type if possible
    eventEndDate: string;        // Date as a string, consider using Date type if possible
    eventStartTime: string;      // Time as a string (consider using a more structured type)
    eventEndTime: string;        // Time as a string (consider using a more structured type)
    eventType: string;           // Could be 'paid', 'free', etc.
    allowFamilyAndFriends: boolean;
    uploadedFiles: string[];     // Assuming these are base64 strings
    isDeleted: string;
    maxAttendees?: number | null; // Optional, can be null
    shouldPublish?: boolean | null; // Optional, can be null
    encryptedSocietyId: string;
    amountPerPerson?: number;      // Optional for paid events
    ChargePerPerson?: boolean;      // Optional, related to payment handling
    acceptDonation?: boolean;       // Optional, for free events
}
