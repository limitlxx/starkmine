// Authorization errors
const INVALID_TOKEN_ID: felt252 = 'Invalid token ID';
const UNAUTHORIZED: felt252 = 'Unauthorized caller';
const ONLY_OWNER: felt252 = 'Only owner can execute';
const NOT_APPROVED_DEALER: felt252 = 'Not approved dealer';

// Proposal & Voting errors
const PROPOSAL_NOT_FOUND: felt252 = 'Proposal not found';
const PROPOSAL_ALREADY_EXECUTED: felt252 = 'Proposal already executed';
const VOTING_STILL_ACTIVE: felt252 = 'Voting still active';
const PROPOSAL_FAILED: felt252 = 'Proposal did not pass';
const ALREADY_VOTED: felt252 = 'Already voted';
const INVALID_VOTE_AMOUNT: felt252 = 'Invalid vote amount';
const VOTING_ENDED: felt252 = 'Voting period ended';

// Contract state errors
const CONTRACT_PAUSED: felt252 = 'Contract is paused';
const INVALID_STATE: felt252 = 'Invalid state';
const TOKEN_LOCKED: felt252 = 'Token is locked';

// Address validation errors
const INVALID_ESCROW_ADDRESS: felt252 = 'Invalid escrow address';
const INVALID_DEALER_ADDRESS: felt252 = 'Invalid dealer address';
const INVALID_ADDRESS: felt252 = 'Invalid address';

// Gold vault errors
const GOLD_NOT_FOUND: felt252 = 'Gold not found';
const INVALID_GOLD_STATUS: felt252 = 'Invalid gold status';
const INVALID_LOCATION_HASH: felt252 = 'Invalid location hash';

// Transaction errors
const INSUFFICIENT_BALANCE: felt252 = 'Insufficient balance';
const INSUFFICIENT_FRACTIONS: felt252 = 'Insufficient fractions';
const BELOW_MIN_PURCHASE: felt252 = 'Below minimum purchase';
const ABOVE_MAX_PURCHASE: felt252 = 'Above maximum purchase';
const INVALID_AMOUNT: felt252 = 'Invalid amount';
const INVALID_PRICE: felt252 = 'Invalid price';

// KYC errors
const KYC_NOT_COMPLETE: felt252 = 'KYC not complete';
const KYC_ALREADY_APPROVED: felt252 = 'KYC already approved';

// Fee errors
const FEE_TOO_HIGH: felt252 = 'Fee too high';
const INVALID_FEE: felt252 = 'Invalid fee amount';

// Metadata errors
const INVALID_METADATA: felt252 = 'Invalid metadata';
const INVALID_URI: felt252 = 'Invalid URI';
