export interface RegistrationForm {
    // Beneficial Owner Information
    legalName: string
    dateOfBirth: string
    address: string
    
    // Business Information
    governmentId: File | null
    proofOfAddress: File | null
    certificateOfIncorporation: File | null
    memorandumArticles: File | null
    taxId: string
    businessLicense: File | null
    
    // Additional Documents
    sourceOfFunds: File | null
    bankStatements: File | null
    proofOfGoldSource: File | null
  }
  
  