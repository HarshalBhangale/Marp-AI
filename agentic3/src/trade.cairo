use starknet::ContractAddress;

#[starknet::interface]
trait IMockTrading<TContractState> {
    fn get_contract_balance(self: @TContractState) -> u256;
    fn get_user_deposit(self: @TContractState, user: ContractAddress) -> u256;
    fn deposit(ref self: TContractState, amount: u256);
    fn withdraw_with_profit(ref self: TContractState, profit_amount: u256);
}

#[starknet::contract]
mod mock_trading {
    use starknet::{ContractAddress, get_caller_address};
    use super::IMockTrading;
    
    #[storage]
    struct Storage {
        contract_balance: u256,
        admin: ContractAddress,
        user_deposits: LegacyMap::<ContractAddress, u256>,
    }

    #[event]
    #[derive(Drop, starknet::Event)]
    enum Event {
        Deposit: Deposit,
        Withdrawal: Withdrawal,
    }

    #[derive(Drop, starknet::Event)]
    struct Deposit {
        #[key]
        user: ContractAddress,
        amount: u256,
    }

    #[derive(Drop, starknet::Event)]
    struct Withdrawal {
        #[key]
        user: ContractAddress,
        initial_amount: u256,
        profit_amount: u256,
    }

    #[constructor]
    fn constructor(ref self: ContractState, admin: ContractAddress, initial_fund: u256) {
        assert(admin != ContractAddress::default(), 'Admin cannot be zero');
        self.admin.write(admin);
        self.contract_balance.write(initial_fund);
    }

    #[abi(embed_v0)]
    impl MockTradingImpl of super::IMockTrading<ContractState> {
        fn get_contract_balance(self: @ContractState) -> u256 {
            self.contract_balance.read()
        }

        fn get_user_deposit(self: @ContractState, user: ContractAddress) -> u256 {
            self.user_deposits.read(user)
        }

        fn deposit(ref self: ContractState, amount: u256) {
            let caller = get_caller_address();
            assert(amount > 0, 'Amount must be positive');
            assert(self.user_deposits.read(caller) == 0, 'Previous deposit exists');
            
            self.user_deposits.write(caller, amount);
            
            self.emit(Event::Deposit(
                Deposit { 
                    user: caller, 
                    amount 
                }
            ));
        }

        fn withdraw_with_profit(ref self: ContractState, profit_amount: u256) {
            let caller = get_caller_address();
            assert(caller == self.admin.read(), 'Only admin can set profit');
            
            let deposit_amount = self.user_deposits.read(caller);
            assert(deposit_amount > 0, 'No deposit found');

            let total_withdrawal = deposit_amount + profit_amount;
            assert(self.contract_balance.read() >= total_withdrawal, 'Insufficient contract balance');

            self.contract_balance.write(self.contract_balance.read() - total_withdrawal);
            self.user_deposits.write(caller, 0);

            self.emit(Event::Withdrawal(
                Withdrawal { 
                    user: caller,
                    initial_amount: deposit_amount,
                    profit_amount
                }
            ));
        }
    }
}