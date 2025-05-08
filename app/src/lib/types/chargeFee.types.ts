export interface ChargeFeeFormType {
    name: string;                      // Charge/Fee name
    description: string;               // Fee description
    dueDate: string;                   // Due date as a string (consider using Date type if possible)
    amount: string;                   // Amount for the charge/fee
    feeType: string;                   // Type of fee, could be 'fixed', 'variable', etc.
    isDraft?: boolean;                 // Optional, to indicate if the form is saved as draft
    shouldPublish?: boolean;             // Optional, to indicate if the form is published
    encryptedSocietyId:string
  }
  