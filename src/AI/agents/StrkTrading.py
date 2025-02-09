import pandas as pd
import pandas_ta as ta
import numpy as np
import time
import warnings
warnings.filterwarnings('ignore')

class STRKTradingAgent:
    def __init__(self, initial_balance=20):
        self.initial_balance = initial_balance  # Store initial balance
        self.balance = initial_balance         # Current balance
        self.holdings = 0
        self.trades = []
        self.current_position = None
        self.entry_price = None
        self.sl = 0
        self.sl_short = 0

    # ... [rest of the methods remain the same until run method]

    def run(self, df):
        """Run the trading simulation"""
        try:
            print("Starting STRK trading simulation...")
            print(f"Initial Balance: ${self.initial_balance:.2f}")
            
            df = self.prepare_data(df)
            df = self.generate_signals(df)
            
            position = None
            for idx, row in df.iterrows():
                if row['signal'] != 0:
                    if row['signal'] in [1, 2]:  # Entry signals
                        trade = {
                            'type': 'long' if row['signal'] == 1 else 'short',
                            'entry_time': idx,
                            'entry_price': row['close'],
                            'quantity': self.balance / row['close']
                        }
                        self.trades.append(trade)
                        position = trade
                        self.balance = 0
                        self.holdings = trade['quantity']
                        print(f"\nOpening {trade['type']} position:")
                        print(f"Time: {idx}")
                        print(f"Price: ${row['close']:.2f}")
                        print(f"Quantity: {trade['quantity']:.4f}")
                        
                    elif row['signal'] in [-1, -2] and position:  # Exit signals
                        position['exit_time'] = idx
                        position['exit_price'] = row['close']
                        position['pnl'] = self.calculate_trade_metrics(position) * position['quantity']
                        self.balance = self.holdings * row['close']
                        self.holdings = 0
                        position = None
                        print(f"\nClosing position:")
                        print(f"Time: {idx}")
                        print(f"Price: ${row['close']:.2f}")
                        print(f"PnL: ${position['pnl']:.2f}")
                        print(f"Current Balance: ${self.balance:.2f}")

            # Calculate final results
            final_balance = self.balance + (self.holdings * df['close'].iloc[-1])
            total_pnl = sum([t['pnl'] for t in self.trades if 'pnl' in t])
            win_trades = len([t for t in self.trades if 'pnl' in t and t['pnl'] > 0])
            total_trades = len([t for t in self.trades if 'pnl' in t])

            print("\nTrading Simulation Complete!")
            print("========= Results =========")
            print(f"Initial Balance: ${self.initial_balance:.2f}")
            print(f"Final Balance: ${final_balance:.2f}")
            print(f"Total PnL: ${total_pnl:.2f}")
            print(f"Total Trades: {total_trades}")
            print(f"Winning Trades: {win_trades}")
            if total_trades > 0:
                print(f"Win Rate: {(win_trades/total_trades*100):.2f}%")

            return df, self.trades
            
        except Exception as e:
            print(f"Error running simulation: {str(e)}")
            raise

def run_trading_agent(csv_file):
    """Main function to run the STRK trading agent"""
    try:
        print("Loading STRK/USDT data...")
        df = pd.read_csv(csv_file)
        agent = STRKTradingAgent(initial_balance=20)
        results, trades = agent.run(df)
        return results, trades
    except Exception as e:
        print(f"Error running trading agent: {str(e)}")
        return None, None

if __name__ == "__main__":
    csv_file = "ohlcv_strkusdt_15m(1).csv"
    results, trades = run_trading_agent(csv_file)