#[starknet::contract]
mod GoldEscrow {
    use starknet::storage::{
        StoragePointerReadAccess, StoragePointerWriteAccess, StoragePathEntry, Map,
    }; 
    use openzeppelin::token::erc20::interface::{IERC20Dispatcher, IERC20DispatcherTrait};
    use openzeppelin::token::erc20::interface::{ERC20ABIDispatcher, ERC20ABIDispatcherTrait};
    use openzeppelin::access::ownable::OwnableComponent;
    use openzeppelin::upgrades::interface::IUpgradeable;
    use openzeppelin::upgrades::UpgradeableComponent;
    use starknet::{ ClassHash, get_caller_address, ContractAddress };
    
    // External
    component!(path: OwnableComponent, storage: ownable, event: OwnableEvent); 
    component!(path: UpgradeableComponent, storage: upgradeable, event: UpgradeableEvent);
 
    // Internal
    #[abi(embed_v0)]
    impl OwnableInternalImpl = OwnableComponent::InternalImpl<ContractState>;
    impl UpgradeableInternalImpl = UpgradeableComponent::InternalImpl<ContractState>;
 

    #[storage]
    struct Storage {
        _vault_address: ContractAddress,
        _gold_nft_address: ContractAddress,  
        _locked_pools: Map<u256, bool>,
        _pool_balances: Map<u256, u256>,
        _kyc_status: Map<u256, bool>,
        _fee_balances: Map<(u256, ContractAddress), u256>,
        _total_pool_fees: Map<u256, u256>
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

    #[event]
    #[derive(Drop, starknet::Event)]
    enum Event {
        PoolLocked: PoolLocked,
        PoolUnlocked: PoolUnlocked,
        FundsDeposited: FundsDeposited,
        FundsReleased: FundsReleased,
    }

    #[derive(Drop, starknet::Event)]
    struct PoolLocked {
        token_id: u256,
    }
    
    #[derive(Drop, starknet::Event)]
    struct PoolUnlocked {
        token_id: u256,
    }   

    #[derive(Drop, starknet::Event)]
    struct FundsDeposited {
        #[key]
        token_id: u256,
        amount: u256,
        address: ContractAddress,
    }

    #[derive(Drop, starknet::Event)]
    struct FundsReleased {
        #[key]
        token_id: u256,
        amount: u256,
        address: ContractAddress,
    }

    #[abi(per_item)]
    #[generate_trait]
    impl GoldEscrow of GoldEscrowTrait {

        #[constructor]
        fn constructor(
            ref self: ContractState,
            _owner: ContractAddress
        ) {
            self.ownable.initializer(_owner);
        }

        // Create function to set gold nft contract address
        // only owner
        #[external(v0)]
        fn set_gold_nft_contract(ref self: ContractState, dealer_contract: ContractAddress){
            self._gold_nft_address.write(vault_address); 
        }

        // Create function to set vault contract address
        // only owner
        #[external(v0)]
        fn set_vault_contract(ref self: ContractState, vault_address: ContractAddress){            
            self._vault_address.write(vault_address); 
        }

        // Retailers deposite to a minted gold pool
        #[external(v0)]
        fn deposit_to_pool(
            ref self: ContractState, 
            token_id: u256, 
            amount: u256, 
            address: ContractAddress
        ) {            
            // Transfer STRK from sender to escrow
            let strk = IERC20Dispatcher::from_address(self._strk_token.read());
            strk.transfer_from(address, get_contract_address(), amount);
            
            // Update pool balance
            let current_balance = self._pool_balances.read(token_id);
            self._pool_balances.write(token_id, current_balance + amount);
            
            self.emit(FundsDeposited { token_id, amount, address });
        }

        // Dealers can claim strk from gold pool
        // pool must be unlocked
        // Call Gold NFT ontract
        #[external(v0)]
        fn claim_payment(ref self: ContractState, token_id: u256) {
            let gold_nft = IGoldNFT::from_address(self._gold_nft_contract.read());
            let gold_data = gold_nft.get_gold_data(token_id);
            assert(get_caller_address() == gold_data.dealer, 'NOT_DEALER');
            assert(!self._locked_pools.read(token_id), 'POOL_IS_LOCKED');
            
            let balance = self._pool_balances.read(token_id);
            assert(balance > 0, 'NO_BALANCE');
            
            // Transfer STRK to dealer
            let strk = IERC20Dispatcher::from_address(self._strk_token.read());
            strk.transfer(gold_data.dealer, balance);
            
            // Reset pool balance
            self._pool_balances.write(token_id, 0);
            
            self.emit(FundsReleased { 
                token_id, 
                amount: balance, 
                address: gold_data.dealer 
            });
        }

        // withdraw fee from _mint_fee_balances
        // Collect fee when minting gold in the gold nft contract
        // only owner
        #[external(v0)]
        fn collect_mint_fee(
            ref self: ContractState, 
            payer: ContractAddress, 
            amount: u256
        ) {
            let strk = IERC20Dispatcher::from_address(self._strk_token.read());
            strk.transfer_from(payer, get_contract_address(), amount);
            
            self.emit(FeeCollected {
                fee_type: 'MINT',
                token_id: 0, // Not pool specific
                amount,
                payer
            });
        }

        // withdraw fee from _transfer_fee_balances
        // Collect fee when transfer or selling in the gold nft contract
        // only owner
        #[external(v0)]
        fn collect_transfer_fee(
            ref self: ContractState,
            token_id: u256,
            payer: ContractAddress,
            amount: u256
        ) {
            let strk = IERC20Dispatcher::from_address(self._strk_token.read());
            strk.transfer_from(payer, get_contract_address(), amount);
            
            self.emit(FeeCollected {
                fee_type: 'TRANSFER',
                token_id,
                amount,
                payer
            });
        }

        #[external(v0)]
        fn add_fee_to_pool(
            ref self: ContractState,
            token_id: u256,
            amount: u256
        ) {
            let current_fees = self._total_pool_fees.read(token_id);
            self._total_pool_fees.write(token_id, current_fees + amount);
        }

        // Only owner
        #[external(v0)]
        fn withdraw_pool_fees(
            ref self: ContractState,
            token_id: u256,
            recipient: ContractAddress
        ) {
            assert(get_caller_address() == self._owner.read(), 'NOT_OWNER');
            let fees = self._total_pool_fees.read(token_id);
            assert(fees > 0, 'NO_FEES');
            
            // Reset fees before transfer
            self._total_pool_fees.write(token_id, 0);
            
            // Transfer STRK
            let strk = IERC20Dispatcher::from_address(self._strk_token.read());
            strk.transfer(recipient, fees);
            
            self.emit(FeesWithdrawn {
                token_id,
                amount: fees,
                recipient
            });
        }

        #[external(v0)]
        fn verify_gold_in_vault(ref self: ContractState, token_id: u256) {
            assert(get_caller_address() == self._vault_address.read(), 'NOT_VAULT');
            self._kyc_status.write(token_id, true);
            self.unlock_pool(token_id);
        }

        // Refund users funds
        #[external(v0)]
        fn refund_retailers_pool(ref self: ContractState, retailer_address: ContractAddress, token_id: u256) {
            
        }

        #[external(v0)]
        fn lock_pool(ref self: ContractState, token_id: u256) {
            assert(!self._locked_pools.read(token_id), 'ALREADY_LOCKED');
            self._locked_pools.write(token_id, true);
            self.emit(PoolLocked { token_id });
        }

        #[external(v0)]
        fn unlock_pool(ref self: ContractState, token_id: u256) {
            assert(self._locked_pools.read(token_id), 'NOT_LOCKED');
            assert(self._kyc_status.read(token_id), 'KYC_NOT_VERIFIED');
            self._locked_pools.write(token_id, false);
            self.emit(PoolUnlocked { token_id });
        }

        // View functions
        #[view]
        fn get_pool_balance(self: @ContractState, token_id: u256) -> u256 {
            self._pool_balances.read(token_id)
        }

        #[view]
        fn get_pool_fees(self: @ContractState, token_id: u256) -> u256 {
            self._total_pool_fees.read(token_id)
        }

        #[view]
        fn is_pool_locked(self: @ContractState, token_id: u256) -> bool {
            self._locked_pools.read(token_id)
        }

        #[view]
        fn is_kyc_verified(self: @ContractState, token_id: u256) -> bool {
            self._kyc_status.read(token_id)
        }

        // Upgrade the contract
        #[external(v0)]
        fn upgrade(ref self: ContractState, new_class_hash: ClassHash) {
            self.ownable.assert_only_owner();
            self.upgradeable.upgrade(new_class_hash);
        }
    }

    


}