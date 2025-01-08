#[starknet::contract]
mod DealerContract { 
    use starknet::storage::{
        StoragePointerReadAccess, StoragePointerWriteAccess, StoragePathEntry, Map,
    }; 
    use openzeppelin::access::ownable::OwnableComponent; 
    use openzeppelin::upgrades::UpgradeableComponent;
    use starknet::{ClassHash, ContractAddress};
 
    // External
    component!(path: OwnableComponent, storage: ownable, event: OwnableEvent); 
    component!(path: UpgradeableComponent, storage: upgradeable, event: UpgradeableEvent);

    // Internal
    impl OwnableInternalImpl = OwnableComponent::InternalImpl<ContractState>;
    impl UpgradeableInternalImpl = UpgradeableComponent::InternalImpl<ContractState>;

    
    #[storage]
    struct Storage {
        _approved_dealers: Map<ContractAddress, bool>,
        _kyc_status: Map<ContractAddress, bool>,
        #[substorage(v0)]
        ownable: OwnableComponent::Storage,
        #[substorage(v0)]
        upgradeable: UpgradeableComponent::Storage,
    }

    #[event]
    #[derive(Drop, starknet::Event)]
    enum Event { 
        #[flat]
        OwnableEvent: OwnableComponent::Event, 
        #[flat]
        UpgradeableEvent: UpgradeableComponent::Event,
    }

    #[abi(per_item)]
    #[generate_trait]
    impl DealerContract of DealerContractTrait {
        #[constructor]
        fn constructor(ref self: ContractState, initial_owner: ContractAddress) {
            self.ownable.initializer(initial_owner);
        }
    
        // set KYC to true/false for an address
        // KYC will be submitted off-chain on the kyc application table
        #[external(v0)]
        fn complete_kyc(ref self: ContractState, dealer: ContractAddress) {
            self.ownable.assert_only_owner();
            self._kyc_status.entry(dealer).write(true);
        }
    
        // Approve/Disapprove an address to list gold
        #[external(v0)]
        fn approve_dealer(ref self: ContractState, dealer: ContractAddress) { 
            self.ownable.assert_only_owner();
            assert(self._kyc_status.entry(dealer).read(), 'KYC_NOT_COMPLETED');
            self._approved_dealers.entry(dealer).write(true);
        }
     
        // Check a dealer is approved
        #[external(v0)]
        fn is_approved_dealer(self: @ContractState, dealer: ContractAddress) -> bool {
            // check address exist in dealers mapping
            self._approved_dealers.entry(dealer).read()
        }

        // Upgrade the contract
        #[external(v0)]
        fn upgrade(ref self: ContractState, new_class_hash: ClassHash) {
            self.ownable.assert_only_owner();
            self.upgradeable.upgrade(new_class_hash);
        }
    } 

    
}