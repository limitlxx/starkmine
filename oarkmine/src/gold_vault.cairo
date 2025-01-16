#[starknet::contract]
mod GoldVault {
    use starknet::storage::{
        StoragePointerReadAccess, StoragePointerWriteAccess, StoragePathEntry, Map,
    }; 
    use openzeppelin::access::ownable::OwnableComponent;
    use openzeppelin::upgrades::interface::IUpgradeable;
    use openzeppelin::upgrades::UpgradeableComponent;
    use starknet::{ClassHash, ContractAddress};
    use oarkmine::errors;
 
    // External
    component!(path: OwnableComponent, storage: ownable, event: OwnableEvent); 
    component!(path: UpgradeableComponent, storage: upgradeable, event: UpgradeableEvent);

    // Internal
    #[abi(embed_v0)]
    impl OwnableInternalImpl = OwnableComponent::InternalImpl<ContractState>;
    impl UpgradeableInternalImpl = UpgradeableComponent::InternalImpl<ContractState>;


    #[storage]
    struct Storage { 
        _gold_statuses: Map<u256, GoldStatus>, 
        _escrow_address: ContractAddress,
        _dealers_address: ContractAddress,
        #[substorage(v0)]
        ownable: OwnableComponent::Storage,
        #[substorage(v0)]
        upgradeable: UpgradeableComponent::Storage,
    }

    #[derive(Drop, Serde)]
    enum GoldStatus {
        Pending,
        InVault,
        UnderAudit,
        Withdrawn
    }

    #[event]
    #[derive(Drop, starknet::Event)]
    enum Event { 
        #[flat]
        OwnableEvent: OwnableComponent::Event, 
        #[flat]
        UpgradeableEvent: UpgradeableComponent::Event,
    }

    #[derive(Drop, starknet::Event)]
    struct GoldReceived {
        token_id: u256,
        location_hash: felt252,
    }

    #[derive(Drop, starknet::Event)]
    struct GoldVerified {
        token_id: u256,
    }

    // Create event struct for GoldReceived & GoldVerified
    // Add necessary events

    #[event]
    #[derive(Drop, starknet::Event)]
    enum Event {
        #[flat]
        OwnableEvent: OwnableComponent::Event
    }
    
    #[abi(per_item)]
    #[generate_trait] 
    impl GoldVault of GoldVaultTrait {
        #[constructor]
        fn constructor(ref self: ContractState, escrow_contract: ContractAddress, dealer_contract: ContractAddress, owner: ContractAddress) {
            self._escrow_address.write(escrow_contract);
            self._dealers_address.write(dealer_contract)
            self.ownable.initializer(owner);
        }
    
        // Dealer submit gold for verification
        // call dealers contract; To be called by approved dealers
        #[external(v0)]
        fn receive_gold(
            ref self: ContractState,
            token_id: u256,
            location_hash: felt252
        ) {
            assert(location_hash != 0, errors::INVALID_LOCATION_HASH);
            self._gold_locations.write(token_id, location_hash);
            self._gold_statuses.write(token_id, GoldStatus::Pending);
            self.emit(GoldReceived { token_id, location_hash });
        }
    
        // Notify contract that the gold is in vault
        // Update gold vault kyc to true
        // Unlock pool
        #[external(v0)]
        fn verify_gold(ref self: ContractState, token_id: u256) {
            self.ownable.assert_only_owner();
            let current_status = self._gold_statuses.read(token_id);
            assert(current_status == GoldStatus::Pending, errors::INVALID_GOLD_STATUS);
            self._gold_statuses.write(token_id, GoldStatus::InVault);
            
            // Notify escrow
            IEscrow::verify_gold_in_vault(self._escrow_address.read(), token_id);
            self.emit(GoldVerified { token_id });
        }

        // Create function to set escrow contract address
        // only owner
        #[external(v0)]
        fn set_escrow_contract(ref self: ContractState, escrow_contract: ContractAddress) {
            self.ownable.assert_only_owner();
            assert(!escrow_contract.is_zero(), errors::INVALID_ESCROW_ADDRESS);
            self._escrow_address.write(escrow_contract);
        }

        // Create function to set dealers contract address
        // only owner
        #[external(v0)]
        fn set_dealer_contract(ref self: ContractState, dealer_contract: ContractAddress) {
            self.ownable.assert_only_owner();
            assert(!dealer_contract.is_zero(), errors::INVALID_DEALER_ADDRESS);
            self._dealers_address.write(dealer_contract);
        }

        // Upgrade the contract
        // only owner
        #[external(v0)]
        fn upgrade(ref self: ContractState, new_class_hash: ClassHash) {
            self.ownable.assert_only_owner();
            self.upgradeable.upgrade(new_class_hash);
        }
    }

   
}