#[starknet::contract]
mod GoldVoting {
    use starknet::ContractAddress;

    #[storage]
    struct Storage {
        _proposals: Map<(u256, u256), Proposal>,
        _votes: Map<(u256, u256, ContractAddress), bool>,
        _proposal_count: Map<u256, u256>,
        _gold_nft_address: ContractAddress,
    }

    #[derive(Drop, Serde)]
    struct Proposal {
        description: felt252,
        vote_count: u256,
        executed: bool,
        deadline: u64,
    }

    #[abi(per_item)]
    #[generate_trait]
    impl GoldVoting of GoldVotingTrait {

        #[constructor]
     fn constructor(
        ref self: ContractState,){
            // declare _gold_nft_address
        }

        #[external(v0)]
        fn create_proposal(
            ref self: ContractState,
            token_id: u256,
            description: felt252,
            deadline: u64
        ) -> u256 {
            let proposal_id = self._proposal_count.read(token_id) + 1;
            self._proposal_count.write(token_id, proposal_id);
            
            self._proposals.write(
                (token_id, proposal_id),
                Proposal {
                    description,
                    vote_count: 0,
                    executed: false,
                    deadline,
                }
            );
            
            proposal_id
        }

        #[external(v0)]
        fn vote(
            ref self: ContractState,
            token_id: u256,
            proposal_id: u256
        ) {
            let proposal = self._proposals.read((token_id, proposal_id));
            assert(get_block_timestamp() <= proposal.deadline, 'VOTING_ENDED');
            assert(!proposal.executed, 'ALREADY_EXECUTED');
            
            let voter = get_caller_address();
            assert(!self._votes.read((token_id, proposal_id, voter)), 'ALREADY_VOTED');
            
            // Check if voter owns fractions
            let balance = IERC1155::balance_of(self._gold_nft_address.read(), voter, token_id);
            assert(balance > 0, 'NO_VOTING_POWER');
            
            self._votes.write((token_id, proposal_id, voter), true);
            self._proposals.write(
                (token_id, proposal_id),
                Proposal {
                    ...proposal,
                    vote_count: proposal.vote_count + balance
                }
            );
        }

        // only owner
        #[external(v0)]
        fn executed_proposal(
            ref self: ContractState,
            token_id: u256,
        ){

        }


        // Upgrade the contract
        #[external(v0)]
        fn upgrade(ref self: ContractState, new_class_hash: ClassHash) {
            self.ownable.assert_only_owner();
            self.upgradeable.upgrade(new_class_hash);
        }
    }

    
}