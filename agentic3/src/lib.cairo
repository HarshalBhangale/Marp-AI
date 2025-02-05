pub mod erc20;

use starknet::{ContractAddress, ClassHash, syscalls};
use starknet::storage::Map;


#[starknet::interface]
trait IERC20<TContractState> {
    fn get_name(self: @TContractState) -> felt252;
    fn get_symbol(self: @TContractState) -> felt252;
    fn get_decimals(self: @TContractState) -> u8;
    fn get_total_supply(self: @TContractState) -> felt252;
    fn balance_of(self: @TContractState, account: ContractAddress) -> felt252;
    fn transfer(ref self: TContractState, recipient: ContractAddress, amount: felt252);
    fn transfer_from(ref self: TContractState, sender: ContractAddress, recipient: ContractAddress, amount: felt252);
    fn approve(ref self: TContractState, spender: ContractAddress, amount: felt252);
}

#[starknet::interface]
trait ISTRKConverter<TContractState> {
    fn convert_to_erc20(ref self: TContractState, erc20_address: ContractAddress, amount: felt252);
    fn withdraw(ref self: TContractState, amount: felt252);
    fn get_conversion_rate(self: @TContractState) -> felt252;
    fn upgrade(ref self: TContractState, new_implementation: ClassHash);
}

#[starknet::contract]
mod STRKConverter {
    use super::{IERC20Dispatcher, IERC20DispatcherTrait};
    use starknet::{ContractAddress, ClassHash, get_caller_address, get_contract_address};
    use core::num::traits::Zero;
    use core::traits::{Into, TryInto};
    use starknet::storage::Map;

    #[storage]
    struct Storage {
        owner: ContractAddress,
        conversion_rate: u256,
        strk_balance: u256,
        erc20_tokens: Map::<ContractAddress, u256>
    }

    #[event]
    #[derive(Drop, starknet::Event)]
    enum Event {
        Conversion: Conversion,
        Upgraded: Upgraded
    }

    #[derive(Drop, starknet::Event)]
    struct Conversion {
        user: ContractAddress,
        amount: felt252,
        erc20_token: ContractAddress
    }

    #[derive(Drop, starknet::Event)]
    struct Upgraded {
        implementation: ClassHash
    }

    #[constructor]
    fn constructor(ref self: ContractState, owner: ContractAddress) {
        self.owner.write(owner);
        self.conversion_rate.write(1000000000000000000_u256);
    }

    #[abi(embed_v0)]
    impl STRKConverterImpl of super::ISTRKConverter<ContractState> {
        fn convert_to_erc20(
            ref self: ContractState, 
            erc20_address: ContractAddress,
            amount: felt252
        ) {
            let caller = get_caller_address();
            let this = get_contract_address();
            let erc20 = IERC20Dispatcher { contract_address: erc20_address };
            
            erc20.transfer_from(caller, this, amount);

            let amount_u256: u256 = amount.into();
            let rate: u256 = self.conversion_rate.read();
            let converted_amount = (amount_u256 * rate) / 1000000000000000000_u256;
            
            let converted_felt: felt252 = converted_amount.try_into().unwrap();
            erc20.transfer(caller, converted_felt);

            self.strk_balance.write(self.strk_balance.read() + amount_u256);
            
            self.emit(Event::Conversion(
                Conversion { 
                    user: caller, 
                    amount: converted_felt,
                    erc20_token: erc20_address
                }
            ));
        }

        fn withdraw(ref self: ContractState, amount: felt252) {
            let caller = get_caller_address();
            assert(caller == self.owner.read(), 'Only owner');
            
            let amount_u256: u256 = amount.into();
            let balance = self.strk_balance.read();
            assert(balance >= amount_u256, 'Insufficient balance');

            self.strk_balance.write(balance - amount_u256);
        }

        fn get_conversion_rate(self: @ContractState) -> felt252 {
            let rate: u256 = self.conversion_rate.read();
            rate.try_into().unwrap()
        }

        fn upgrade(ref self: ContractState, new_implementation: ClassHash) {
            let caller = get_caller_address();
            assert(caller == self.owner.read(), 'Only owner can upgrade');
            assert(!new_implementation.is_zero(), 'Invalid implementation');

            starknet::syscalls::replace_class_syscall(new_implementation).unwrap();
            
            self.emit(Event::Upgraded(Upgraded { implementation: new_implementation }));
        }
    }
}