// Authorization errors
pub mod Errors {

    pub const INVALID_TOKEN_ID: felt252 = 'Invalid token ID';
    pub const UNAUTHORIZED: felt252 = 'Unauthorized caller';
    pub const ONLY_OWNER: felt252 = 'Only owner can execute';
    pub const NOT_APPROVED_DEALER: felt252 = 'Not approved dealer';
    
    pub const NO_FEES: felt252 = 'No fees';
     // Proposal & Voting errors
    pub const PROPOSAL_NOT_FOUND: felt252 = 'Proposal not found';
    pub const PROPOSAL_ALREADY_EXECUTED: felt252 = 'Proposal already executed';
    pub const VOTING_STILL_ACTIVE: felt252 = 'Voting still active';
    pub const PROPOSAL_FAILED: felt252 = 'Proposal did not pass';
    pub const ALREADY_VOTED: felt252 = 'Already voted';
    pub const INVALID_VOTE_AMOUNT: felt252 = 'Invalid vote amount';
    pub const VOTING_ENDED: felt252 = 'Voting period ended';
    
     // Contract state errors
    pub const CONTRACT_PAUSED: felt252 = 'Contract is paused';
    pub const INVALID_STATE: felt252 = 'Invalid state';
    pub const TOKEN_LOCKED: felt252 = 'Token is locked';
    pub const POOL_IS_LOCKED: felt252 = 'Pool is locked';
    pub const NO_BALANCE: felt252 = 'No balance';
    pub const NOT_VAULT: felt252 = 'Not vault';
    pub const ALREADY_LOCKED: felt252 = 'Already locked';
    pub const NOT_LOCKED: felt252 = 'Not locked';
    
     // Address validation errors
    pub const INVALID_ESCROW_ADDRESS: felt252 = 'Invalid escrow address';
    pub const INVALID_DEALER_ADDRESS: felt252 = 'Invalid dealer address';
    pub const INVALID_ADDRESS: felt252 = 'Invalid address';
    
     // Gold vault errors
    pub const GOLD_NOT_FOUND: felt252 = 'Gold not found';
    pub const INVALID_GOLD_STATUS: felt252 = 'Invalid gold status';
    pub const INVALID_LOCATION_HASH: felt252 = 'Invalid location hash';
    
     // Transaction errors
    pub const INSUFFICIENT_BALANCE: felt252 = 'Insufficient balance';
    pub const INSUFFICIENT_FRACTIONS: felt252 = 'Insufficient fractions';
    pub const BELOW_MIN_PURCHASE: felt252 = 'Below minimum purchase';
    pub const ABOVE_MAX_PURCHASE: felt252 = 'Above maximum purchase';
    pub const INVALID_AMOUNT: felt252 = 'Invalid amount';
    pub const INVALID_PRICE: felt252 = 'Invalid price';
    
     // KYC errors
    pub const KYC_NOT_COMPLETE: felt252 = 'KYC not complete';
    pub const KYC_ALREADY_APPROVED: felt252 = 'KYC already approved';
    pub const KYC_NOT_VERIFIED: felt252 = 'KYC not verified';
     // Fee errors
    pub const FEE_TOO_HIGH: felt252 = 'Fee too high';
    pub const INVALID_FEE: felt252 = 'Invalid fee amount';

     // Metadata errors
    pub const INVALID_METADATA: felt252 = 'Invalid metadata';
    pub const INVALID_URI: felt252 = 'Invalid URI';
}
