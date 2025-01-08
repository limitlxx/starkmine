#[starknet::contract]
mod GoldVault {
    use starknet::storage::{
        StoragePointerReadAccess, StoragePointerWriteAccess, StoragePathEntry, Map,
    }; 
    use openzeppelin::access::ownable::OwnableComponent;
    use openzeppelin::upgrades::interface::IUpgradeable;
    use openzeppelin::upgrades::UpgradeableComponent;
    use starknet::{ClassHash, ContractAddress};
 
    // External
    component!(path: OwnableComponent, storage: ownable, event: OwnableEvent); 
    component!(path: UpgradeableComponent, storage: upgradeable, event: UpgradeableEvent);

    // Internal
    #[abi(embed_v0)]
    impl OwnableInternalImpl = OwnableComponent::InternalImpl<ContractState>;
    impl UpgradeableInternalImpl = UpgradeableComponent::InternalImpl<ContractState>;


    #[storage]
    struct Storage {
        _balances: Map<(u256, ContractAddress), u256>,
        _gold_nft_contract: ContractAddress,
         gold_locations: Map<u256, felt252>,
        _gold_statuses: Map<u256, GoldStatus>,
        _authorized_auditors: Map<ContractAddress, bool>,
        _escrow_address: ContractAddress,
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

    #[event]
    #[derive(Drop, starknet::Event)]
    enum Event {
        GoldReceived: GoldReceived,
        GoldVerified: GoldVerified,
        AuditInitiated: AuditInitiated,
        GoldWithdrawn: GoldWithdrawn,
    }

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
        fn constructor(ref self: ContractState, gold_nft_contract: ContractAddress, owner: ContractAddress) {
            self._gold_nft_contract.write(gold_nft_contract);
            self.ownable.initializer(owner);
        }
    
        #[external(v0)]
        fn receive_gold(
            ref self: ContractState,
            token_id: u256,
            location_hash: felt252
        ) {
            self.ownable.assert_only_owner();
            self._gold_locations.write(token_id, location_hash);
            self._gold_statuses.write(token_id, GoldStatus::Pending);
            self.emit(GoldReceived { token_id, location_hash });
        }
    
        #[external(v0)]
        fn verify_gold(ref self: ContractState, token_id: u256) {
            self.ownable.assert_only_owner();
            self._gold_statuses.write(token_id, GoldStatus::InVault);
            
            // Notify escrow
            IEscrow::verify_gold_in_vault(self._escrow_address.read(), token_id);
            self.emit(GoldVerified { token_id });
        }

        // Upgrade the contract
        #[external(v0)]
        fn upgrade(ref self: ContractState, new_class_hash: ClassHash) {
            self.ownable.assert_only_owner();
            self.upgradeable.upgrade(new_class_hash);
        }
    }

   
}