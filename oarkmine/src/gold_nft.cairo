#[starknet::interface]
trait IGoldNFT {
    fn get_gold_data(self: @ContractState, token_id: u256) -> GoldData;
} 

#[starknet::contract]
mod GoldNFT {
    use core::starknet::{ClassHash, get_caller_address, ContractAddress};
    use core::starknet::storage::{
        Map, StoragePathEntry, StoragePointerReadAccess, StoragePointerWriteAccess,
    };
    use openzeppelin::token::erc1155::ERC1155;
    use array::ArrayTrait;
    use openzeppelin::access::ownable::OwnableComponent;
    use openzeppelin::upgrades::interface::IUpgradeable;
    use openzeppelin::upgrades::UpgradeableComponent;

    // External
    component!(path: OwnableComponent, storage: _contract_owner, event: OwnableEvent); 
    component!(path: UpgradeableComponent, storage: upgradeable, event: UpgradeableEvent);

    // Internal
    #[abi(embed_v0)]
    impl OwnableInternalImpl = OwnableComponent::InternalImpl<ContractState>;
    impl UpgradeableInternalImpl = UpgradeableComponent::InternalImpl<ContractState>;


    // Add struct for tracking ownership
    #[derive(Copy, Drop, Serde, starknet::Store)]
    struct OwnershipData {
        fraction_amount: u256,
        purchase_date: u64,
        last_updated: u64
    }

    #[derive(Copy, Drop, Serde, starknet::Store)]
    struct TokenURIData {
        base_uri: felt252,
        dynamic_data: felt252
    }

    // Add royalty configuration
    #[derive(Copy, Drop, Serde, starknet::Store)]
    struct RoyaltyConfig {
        contract_owner_fee: u256,  // basis points (e.g., 250 = 2.5%) 
    }

    #[derive(Copy, Drop, Serde, starknet::Store)]
    struct FeeConfig {
        contract_owner_fee: u256,    // basis points for transactions
        mint_fee: u256,             // flat fee in wei for minting
        transfer_fee: u256,         // basis points for transfers
    }
    
    #[derive(Copy, Drop, Serde, starknet::Store)]
    struct PoolRoyalty {
        pool_fee: u256,            // basis points going to pool
        total_collected: u256      // total fees collected for pool
    }
    
    #[storage]
    struct Storage {
        _gold_data: Map<u256, GoldData>,
        _vault_address: ContractAddress,
        _dealer_contract: ContractAddress,
        _escrow_address: ContractAddress,
        _token_kyc_status: Map<u256, bool>,
        _token_counter: u256,
        _ipfs_metadata: Map<u256, IPFSData>,
        _fractions_data: Map<u256, FractionsData>,
        _token_status: Map<u256, TokenStatus>,
        _paused: bool,
        _ownership_data: LegacyMap<(u256, ContractAddress), OwnershipData>,
        _token_uri_data: LegacyMap<u256, TokenURIData>,
        _total_holders: LegacyMap<u256, u256>
        _fee_config: FeeConfig,
        _pool_royalties: Map<u256, PoolRoyalty>,
        _collected_fees: Map<ContractAddress, u256>   
        #[substorage(v0)]
        _contract_owner: OwnableComponent::Storage,
        #[substorage(v0)]
        upgradeable: UpgradeableComponent::Storage,
    }

    #[derive(Drop, Serde)]
    struct GoldData {
        weight: u256,
        purity: u8,
        dealer: ContractAddress,
        certification_id: felt252,
        vault_location: felt252,
        mint_date: u64, 
        total_fractions: u256,
        available_fractions: u256,
        price_per_fraction: u256, 
        location_hash: felt252,
        last_audit_date: u64,
        is_locked: bool,
    }

    #[derive(Drop, Serde)]
    struct IPFSData {
        metadata_hash: felt252, 
        creation_date: u64,
        last_update: u64,
        version: u8,
    }

    #[derive(Drop, Serde)]
    struct FractionsData {
        total_fractions: u256,
        available_fractions: u256,
        price_per_fraction: u256,
        min_purchase: u256,
        max_purchase: u256
    }

    #[derive(Drop, Serde)]
    enum TokenStatus {
        Pending,
        Active,
        Locked,
        Redeemed,
    }

    #[event]
    #[derive(Drop, starknet::Event)]
    enum Event { 
        #[flat]
        OwnableEvent: OwnableComponent::Event, 
        #[flat]
        UpgradeableEvent: UpgradeableComponent::Event,
    }


    // Add necessary events struct as required
    #[event]
    #[derive(Drop, starknet::Event)]
    enum Event {
        TokenMinted: TokenMinted,
        FractionsPurchased: FractionsPurchased,
        MetadataUpdated: MetadataUpdated,
        TokenStatusChanged: TokenStatusChanged,
        FractionPriceUpdated: FractionPriceUpdated,
        TokenLocked: TokenLocked,
        TokenUnlocked: TokenUnlocked,
        DealerApproved: DealerApproved,
        EmergencyPaused: EmergencyPaused,
    }

    #[derive(Drop, starknet::Event)]
    struct TokenMinted {
        token_id: u256,
        dealer: ContractAddress,
        metadata_hash: felt252,
        svg_hash: felt252,
        ipfs_hash: felt252,
    }

    #[derive(Drop, starknet::Event)]
    struct MetadataUpdated {
        token_id: u256,
        new_metadata_hash: felt252,
        new_svg_hash: felt252,
        update_time: u64,
    }

    #[abi(per_item)]
    #[generate_trait]
    impl GoldNFT of GoldNFTTrait {

    #[constructor]
    fn constructor(
        ref self: ContractState,
        vault_address: ContractAddress,
        dealer_contract: ContractAddress,
        escrow_address: ContractAddress,
        owner: ContractAddress,
        mint_fee: u256,
        transfer_fee: u256
    ) {
        self._vault_address.write(vault_address);
        self._dealer_contract.write(dealer_contract);
        self._escrow_address.write(escrow_address);
        self._contract_owner.initializer(owner);
        self._paused.write(false);
 
        self._fee_config.write(FeeConfig {
            contract_owner_fee,
            mint_fee,
            transfer_fee
        });
    }

    // Dealer mint gold function
    #[external(v0)]
    fn mint_gold_nft(
        ref self: ContractState,
        weight: u256,
        purity: u8,
        certification_id: felt252,
        vault_location: felt252,
        total_fractions: u256,
        price_per_fraction: u256,
        pool_fee: u256,  // Added dealer fee parameter
        metadata_hash: felt252,
        svg_hash: felt252,
        location_hash: felt252
    ) -> u256 {
        assert(!self._paused.read(), 'CONTRACT_PAUSED');
        let dealer = get_caller_address();

        // Verify caller is an approved dealer
        let dealer_contract = IDealerContract::from_address(self._dealer_contract.read());
        assert(dealer_contract.is_approved_dealer(get_caller_address()), 'NOT_APPROVED_DEALER');

        // Collect mint fee from dealer
        let fee_config = self._fee_config.read();
        let vault = IEscrow::from_address(self._escrow_address.read());
        vault.collect_mint_fee(dealer, fee_config.mint_fee);

        // Update contract owner's collected fees
        self._collected_fees.write(
            self._contract_owner.read(),
            self._collected_fees.read(self._contract_owner.read()) + fee_config.mint_fee
        );

        // Generate new token ID
        let token_id = self._token_counter.read() + 1;
        self._token_counter.write(token_id);

        // Store pool-specific royalty configuration
        self._pool_royalties.write(
            token_id,
            PoolRoyalty {
                dealer_fee,
                dealer
            }
        );

        // Store gold data
        self._gold_data.write(
            token_id,
            GoldData {
                weight,
                purity,
                dealer: get_caller_address(),
                certification_id,
                vault_location,
                mint_date: get_block_timestamp(),
                last_audit_date: get_block_timestamp(),
                is_locked: false
                total_fractions,
                available_fractions: total_fractions,
                price_per_fraction,
            }
        );

        // Store IPFS data
        self._ipfs_metadata.write(
            token_id,
            IPFSData {
                metadata_hash,
                svg_hash,
                creation_date: get_block_timestamp(),
                last_update: get_block_timestamp(),
                version: 1,
            }
        ); 

        // Store fractions data
        self._fractions_data.write(
            token_id,
            FractionsData {
                total_fractions,
                available_fractions: total_fractions,
                price_per_fraction,
                min_purchase: 1,
                max_purchase: total_fractions
            }
        );

        // Set initial token status
        self._token_status.write(token_id, TokenStatus::Pending);

        // Lock gold in escrow
        IEscrow::from_address(self._escrow_address.read()).lock_gold(token_id);   

        // Mint initial NFT supply
        self._mint(get_caller_address(), token_id, total_fractions, "");

        // Emit event
        self.emit(TokenMinted {
            token_id,
            dealer: get_caller_address(),
            metadata_hash,
            svg_hash,
            mint_fee: fee_config.mint_fee
        });

        token_id
    }

    // set KYC to true/false for a token
    // KYC will be submitted off-chain on the kyc application table
    #[external(v0)]
    fn complete_kyc(ref self: ContractState, token_id: u256, kyc_status: bool) {
        self.ownable.assert_only_owner();
        self._token_kyc_status.entry(token_id).write(kyc_status);
    }

    // Change token status to active fractional purchase
    // only owner
    #[external(v0)]
    fn activate_token(ref self: ContractState, token_id: u256) {
        let gold_data = self._gold_data.read(token_id); 
        assert(self._token_status.read(token_id) == TokenStatus::Pending, 'INVALID_STATUS');
        assert(_token_kyc_status.read(token_id), 'KYC_NOT_COMPLETE');

        self._token_status.write(token_id, TokenStatus::Active);
        self.emit(TokenStatusChanged { token_id, new_status: TokenStatus::Active });
    }

    // force update metadata 
    // only owner
    #[external(v0)]
    fn update_metadata(
        ref self: ContractState,
        token_id: u256,
        new_metadata_hash: felt252,
        new_svg_hash: felt252
    ) {
        self.ownable.assert_only_owner();
        let gold_data = self._gold_data.read(token_id);
        assert(!gold_data.is_locked, 'TOKEN_LOCKED');

        let mut metadata = self._token_metadata.read(token_id);
        metadata.ipfs_hash = new_ipfs_hash;
        metadata.last_update = get_block_timestamp();
        metadata.version += 1;

        self._ipfs_metadata.write(
            token_id,
            IPFSData {
                metadata_hash: new_metadata_hash,
                svg_hash: new_svg_hash,
                last_update: get_block_timestamp(),
            }
        );

        self.emit(MetadataUpdated {
            token_id,
            new_metadata_hash,
            update_time: get_block_timestamp(),
        });
    }

    // Allow fractions to be purchased while gold is in escrow
    #[external(v0)]
    fn buy_fractions(
        ref self: ContractState,
        token_id: u256,
        fraction_amount: u256
    ) {
        let fractions_data = self._fractions_data.read(token_id);
        assert(self._token_status.read(token_id) == TokenStatus::Active, 'TOKEN_NOT_ACTIVE');
        assert(fractions_data.available_fractions >= fraction_amount, 'INSUFFICIENT_FRACTIONS');
        assert(fraction_amount >= fractions_data.min_purchase, 'BELOW_MIN_PURCHASE');
        assert(fraction_amount <= fractions_data.max_purchase, 'ABOVE_MAX_PURCHASE');

        let caller = get_caller_address();
        let total_price = fractions_data.price_per_fraction * fraction_amount;

        // Calculate fees
        let fee_config = self._fee_config.read();
        let pool_royalty = self._pool_royalties.read(token_id);

        let contract_owner_fee = (total_price * fee_config.contract_owner_fee) / 10000;
        let pool_fee = (total_price * pool_royalty.pool_fee) / 10000;
        let net_amount = total_price - contract_owner_fee - pool_fee;
        
        // Handle payment and fee distribution
        let vault = IEscrow::from_address(self._escrow_address.read());
        
        // Pay main amount to pool
        vault.deposit_to_pool(token_id, net_amount, caller);
        
        // Pay contract owner fee
        vault.transfer_fee(self._contract_owner.read(), contract_owner_fee);
        
        // Add pool fee to the escrow pool
        vault.add_fee_to_pool(token_id, pool_fee);
        
        // Update collected fees
        self._collected_fees.write(
            self._contract_owner.read(),
            self._collected_fees.read(self._contract_owner.read()) + contract_owner_fee
        );
        
        // Update pool's collected fees
        let current_pool_royalty = self._pool_royalties.read(token_id);
        self._pool_royalties.write(
            token_id,
            PoolRoyalty {
                pool_fee: current_pool_royalty.pool_fee,
                total_collected: current_pool_royalty.total_collected + pool_fee
            }
        );

        // Update ownership data
        let existing_ownership = self._ownership_data.read((token_id, caller));
        let new_ownership = OwnershipData {
            fraction_amount: existing_ownership.fraction_amount + fraction_amount,
            purchase_date: if existing_ownership.fraction_amount == 0 { 
                get_block_timestamp() 
            } else { 
                existing_ownership.purchase_date 
            },
            last_updated: get_block_timestamp()
        };
        self._ownership_data.write((token_id, caller), new_ownership);

        // Update total holders if this is a new holder
        if existing_ownership.fraction_amount == 0 {
            self._total_holders.write(
                token_id, 
                self._total_holders.read(token_id) + 1
            );
        }

        // Transfer fractions
        let gold_data = self._gold_data.read(token_id);
        self._safeTransferFrom(
            gold_data.dealer,
            get_caller_address(),
            token_id,
            fraction_amount,
            ""
        ); 

        // Update available fractions
        self._fractions_data.write(
            token_id,
            FractionsData {
                ...fractions_data,
                available_fractions: fractions_data.available_fractions - fraction_amount
            }
        );

        // Update dynamic URI data
        self._update_token_uri(token_id);

        self.emit(FractionsPurchased {
            token_id,
            buyer: get_caller_address(),
            amount: fraction_amount,
            price: total_price
        });
    }

    #[external(v0)]
    fn transfer_fractions(
        ref self: ContractState,
        to: ContractAddress,
        token_id: u256,
        fraction_amount: u256,
        price: u256  // Optional: only used if this is a sale
    ) {
        let caller = get_caller_address();
        let caller_ownership = self._ownership_data.read((token_id, caller));
        assert(caller_ownership.fraction_amount >= fraction_amount, 'INSUFFICIENT_BALANCE');

        let fee_config = self._fee_config.read();
        let vault = IEscrow::from_address(self._escrow_address.read());
    
        // Collect transfer fee from sender
        let transfer_fee_amount = (price * fee_config.transfer_fee) / 10000;
        if transfer_fee_amount > 0 {
            vault.collect_transfer_fee(caller, transfer_fee_amount);
            self._collected_fees.write(
                self._contract_owner.read(),
                self._collected_fees.read(self._contract_owner.read()) + transfer_fee_amount
            );
        }
    
        // If price is non-zero (sale), handle pool royalties
        if price > 0 {
            let pool_royalty = self._pool_royalties.read(token_id);
            let pool_fee = (price * pool_royalty.pool_fee) / 10000;
            
            // Add pool fee to the escrow pool
            vault.add_fee_to_pool(token_id, pool_fee);
            
            // Update pool's collected fees
            self._pool_royalties.write(
                token_id,
                PoolRoyalty {
                    pool_fee: pool_royalty.pool_fee,
                    total_collected: pool_royalty.total_collected + pool_fee
                }
            );
        }

        // Update sender ownership
        self._ownership_data.write(
            (token_id, caller),
            OwnershipData {
                fraction_amount: caller_ownership.fraction_amount - fraction_amount,
                purchase_date: caller_ownership.purchase_date,
                last_updated: get_block_timestamp()
            }
        );

        // Update receiver ownership
        let receiver_ownership = self._ownership_data.read((token_id, to));
        let new_receiver_ownership = OwnershipData {
            fraction_amount: receiver_ownership.fraction_amount + fraction_amount,
            purchase_date: if receiver_ownership.fraction_amount == 0 { 
                get_block_timestamp() 
            } else { 
                receiver_ownership.purchase_date 
            },
            last_updated: get_block_timestamp()
        };
        self._ownership_data.write((token_id, to), new_receiver_ownership);

        // Update total holders
        if receiver_ownership.fraction_amount == 0 {
            self._total_holders.write(
                token_id,
                self._total_holders.read(token_id) + 1
            );
        }
        if caller_ownership.fraction_amount == fraction_amount {
            self._total_holders.write(
                token_id,
                self._total_holders.read(token_id) - 1
            );
        }

        // Transfer the fractions
        self._safeTransferFrom(caller, to, token_id, fraction_amount, "");

        // Update dynamic URI data
        self._update_token_uri(token_id);

        self.emit(FractionsTransferred {
            token_id,
            from: caller,
            to,
            amount: fraction_amount
        });
    }

    // function to view pool royalty information
    #[external(v0)]
    fn get_pool_royalty(self: @ContractState, token_id: u256) -> (u256, ContractAddress) {
        let pool_royalty = self._pool_royalties.read(token_id);
        (pool_royalty.dealer_fee, pool_royalty.dealer)
    }

    // function to update pool royalty (only by dealer)
    #[external(v0)]
    fn update_pool_royalty(
        ref self: ContractState,
        token_id: u256,
        new_fee: u256
    ) {
        let pool_royalty = self._pool_royalties.read(token_id);
        assert(get_caller_address() == pool_royalty.dealer, 'ONLY_POOL_DEALER');
        assert(new_fee <= 1000, 'FEE_TOO_HIGH'); // Max 10%
        
        self._pool_royalties.write(
            token_id,
            PoolRoyalty {
                dealer_fee: new_fee,
                dealer: pool_royalty.dealer
            }
        );
        
        self.emit(PoolRoyaltyUpdated {
            token_id,
            new_fee
        });
    }

    // View function for pool stats
    #[external(v0)]
    fn get_pool_stats(self: @ContractState, token_id: u256) -> (u256, u256) {
        let pool_royalty = self._pool_royalties.read(token_id);
        (pool_royalty.pool_fee, pool_royalty.total_collected)
    }

    #[external(v0)]
    fn tokenURI(self: @ContractState, token_id: u256) -> felt252 {
        let uri_data = self._token_uri_data.read(token_id);
        uri_data.dynamic_data
    }

    #[internal]
    fn _update_token_uri(ref self: ContractState, token_id: u256) {
        let gold_data = self._gold_data.read(token_id);
        let total_supply = self._total_supply.read(token_id);
        
        // Generate new dynamic URI data based on current state
        let new_dynamic_data = self._generate_dynamic_uri(
            token_id,
            gold_data,
            total_supply
        );
        
        // Update token URI data
        let uri_data = self._token_uri_data.read(token_id);
        self._token_uri_data.write(
            token_id,
            TokenURIData {
                base_uri: uri_data.base_uri,
                dynamic_data: new_dynamic_data
            }
        );
    }

    #[internal]
    fn _generate_dynamic_uri(
        ref self: ContractState,
        token_id: u256,
        gold_data: GoldData,
        total_supply: u256
    ) -> felt252 {
        // Implementation for generating dynamic URI based on ownership data
        // This would typically return a base64 encoded JSON or IPFS hash
        // pointing to metadata that includes current ownership information
        ...
    }


    #[external(v0)]
    fn emergency_pause(ref self: ContractState) {
        assert(get_caller_address() == self._owner.read(), 'NOT_OWNER');
        self._paused.write(true);
        self.emit(EmergencyPaused {});
    }

    #[external(v0)]
    fn emergency_unpause(ref self: ContractState) {
        assert(get_caller_address() == self._owner.read(), 'NOT_OWNER');
        self._paused.write(false);
    }

    // View functions
    #[view]
    fn get_gold_data(self: @ContractState, token_id: u256) -> GoldData {
        self._gold_data.read(token_id)
    }

    #[view]
    fn is_locked(self: @ContractState, token_id: u256) -> bool {
        self._gold_data.read(token_id).is_locked
    }

    // View functions
    #[view]
    fn get_token_data(self: @ContractState, token_id: u256) -> (GoldData, IPFSData, FractionsData, TokenStatus) {
        (
            self._gold_data.read(token_id),
            self._ipfs_metadata.read(token_id),
            self._fractions_data.read(token_id),
            self._token_status.read(token_id)
        )
    }

    // Upgrade the contract
    #[external(v0)]
    fn upgrade(ref self: ContractState, new_class_hash: ClassHash) {
        self.ownable.assert_only_owner();
        self.upgradeable.upgrade(new_class_hash);
    }
    }

    
}
