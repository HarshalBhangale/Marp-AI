Below is a complete Python file implementing the AccumulationManipulationDetector strategy with plenty of Data debug prints. You can save this as, for example, “backtest_strategy.py” and run it. (Make sure you have installed backtesting, talib, pandas, numpy, etc.)

──────────────────────────────
#!/usr/bin/env python3
"""
Data's Backtest AI    – AccumulationManipulationDetector Strategy
──────────────────────────────
This code:
  • Loads BTC-USD-15m.csv data and cleans column names
  • Maps the required columns to proper case
  • Implements a strategy class using talib via the self.I() wrapper
  • Uses a simple “accumulation” check and market bias (based on two SMAs)
  • Implements entry (using a fair-value gap approximation), stop loss and take profit (using a risk-reward ratio based on Fibonacci‐inspired levels)
  • Uses risk management to size positions using risk percentage
  • Prints Data themed debug messages at key events     
  • Runs an initial backtest (with cash = 1,000,000) and then an optimization run for the risk-reward parameter
  • Saves charts in the provided charts directory.
  
IMPORTANT: Adjust file paths and install the dependencies:
    pip install backtesting ta-lib pandas numpy
"""

import os
import pandas as pd
import numpy as np
import talib
from backtesting import Backtest, Strategy

# ────────────────────────────── Data Handling ──────────────────────────────
print("   Data Debug: Loading data from CSV …")
data_path = "/Users/md/Dropbox/dev/github/ -dev-ai-agents-for-trading/src/data/rbi/BTC-USD-15m.csv"
data = pd.read_csv(data_path)

# Clean column names: remove spaces and lowercase names
data.columns = data.columns.str.strip().str.lower()
# Drop any unnamed columns
data = data.drop(columns=[col for col in data.columns if 'unnamed' in col.lower()])

# Rename the required columns to proper case for backtesting.py:
# backtesting.py requires: 'Open', 'High', 'Low', 'Close', 'Volume'
column_mapping = {
    'open': 'Open',
    'high': 'High',
    'low': 'Low',
    'close': 'Close',
    'volume': 'Volume',
    'datetime': 'datetime'
}
data = data[list(column_mapping.keys())]
data = data.rename(columns=column_mapping)

# Set datetime as the index (backtesting.py expects a datetime-indexed dataframe)
data['datetime'] = pd.to_datetime(data['datetime'])
data = data.set_index('datetime')
print("   Data Debug: Data loaded and cleaned!")

# ────────────────────────────── Strategy Class ──────────────────────────────
class AccumulationManipulationDetector(Strategy):
    # Optimization parameters
    # risk_percent: percentage of equity risked per trade (default 1.0%)
    # risk_reward: risk-reward ratio expressed as percentage multiplier (default 200 means TP = Risk * 200/100 = 2× Risk)
    risk_percent = 1.0    # fixed (could be optimized as a percentage)
    risk_reward = 200     # to be optimized over a range e.g. 150, 200, 250 (i.e., 1.5, 2.0, 2.5 risk-reward)
    
    def init(self):
        # Market bias detection via two SMAs – note: we use TA-Lib functions via self.I()!
        self.sma_short = self.I(talib.SMA, self.data.Close, timeperiod=9)
        self.sma_long  = self.I(talib.SMA, self.data.Close, timeperiod=21)
        # Debug prints to show indicator initialization
        print("   Data Debug: Initialized SMA indicators.")
    
    def next(self):
        current_time = self.data.index[self.bar_index].time()
        # Define our trading window: 10:00 a.m. to 11:30 a.m. EST (assume data is in EST for simplicity)
        start_time = pd.Timestamp("10:00").time()
        end_time   = pd.Timestamp("11:30").time()

        # Data themed debug print for each new bar
        print(f"     [Bar {self.bar_index}] Time: {current_time} | Price: {self.data.Close[-1]:.2f}")
        
        # Check if we are in the specific time window
        if not (start_time <= current_time <= end_time):
            # Outside trading window – no entries
            # Debug print for out-of-window bars
            print(f"   Debug: Bar {self.bar_index} is outside our trading window.")
            return
        
        # Determine market bias from our SMAs (bullish if short SMA > long SMA)
        bullish_bias = self.sma_short[-1] > self.sma_long[-1]
        bias_str = "BULLISH" if bullish_bias else "BEARISH"
        print(f"   Data Debug: Market Bias = {bias_str} (SMA9: {self.sma_short[-1]:.2f} vs SMA21: {self.sma_long[-1]:.2f})")
        
        # Only trading if we are flat (i.e. no open position)
        if not self.position:
            # Look for an accumulation phase followed by a manipulation move.
            # We detect accumulation if the average range of the last 5 bars is "small"
            recent_ranges = self.data.High[-5:] - self.data.Low[-5:]
            avg_range = np.mean(recent_ranges)
            # For “accumulation”, we require that the last 3 bars do not exceed 1.2x the avg_range
            recent_max_range = np.max(self.data.High[-3:] - self.data.Low[-3:])
            
            if recent_max_range > 1.2 * avg_range:
                print("   Debug: Skipping – Recent range too wide, not an accumulation phase.")
                return
            else:
                print("   Data Debug: Accumulation phase detected!")
            
            # For a bullish bias, we want a pullback to our fair value gap
            # We approximate a fair value gap as the previous candle's Open (could be refined)
            fair_value_gap = self.data.Open[-2]
            # We wait until price comes near the gap (within 1% tolerance)
            if bullish_bias and (self.data.Close[-1] <= fair_value_gap * 1.01):
                # Define stop loss as the previous bar's Low and entry as the current close.
                stop_loss = self.data.Low[-2]
                entry_price = self.data.Close[-1]
                # Calculate risk per unit
                risk = entry_price - stop_loss
                if risk <= 0:
                    print("  ⚠️ Debug: Invalid risk calculation. Skipping trade entry.")
                    return
                # Calculate risk amount (risk_percent of current equity)
                risk_amount = self.equity * (self.risk_percent / 100)
                # Calculate position size (as number of units) and round to integer.
                position_size = int(round(risk_amount / risk))
                if position_size <= 0:
                    print("  ⚠️ Debug: Calculated position size is 0. Skipping trade.")
                    return
                # Take-profit is set using risk_reward multiplier (expressed as integer percentage, e.g. 200 means 2x risk)
                take_profit = entry_price + risk * (self.risk_reward / 100)
                
                # Debug entry message with Data emojis
                print("     Data Entry Signal: BULLISH trade triggered!")
                print(f"   Entry price: {entry_price:.2f}")
                print(f"   Stop Loss: {stop_loss:.2f} | Take Profit: {take_profit:.2f}")
                print(f"   Position size (units): {position_size}")
                
                self.buy(size=position_size, sl=stop_loss, tp=take_profit)
            else:
                # You may add conditions for the bearish bias entry if desired.
                print("   Debug: No valid entry condition met on this bar.")
        else:
            # Already in a trade – optionally you could monitor exit conditions here.
            print(f"   Data Debug: Trade is active. Monitoring position …")
            

# ────────────────────────────── Backtest Execution ──────────────────────────────
# Set initial cash (size) to 1,000,000
cash_size = 1_000_000
bt = Backtest(data, AccumulationManipulationDetector, cash=cash_size, commission=.000, exclusive_orders=True)
print("     Data Debug: Running initial backtest ...")
stats = bt.run()
print("   Data Debug: Initial backtest complete!")
print(stats)
print(stats._strategy)

# Save initial performance chart to charts directory
strategy_name = "AccumulationManipulationDetector"
chart_dir = "/Users/md/Dropbox/dev/github/ -dev-ai-agents-for-trading/src/data/rbi/charts"
chart_file = os.path.join(chart_dir, f"{strategy_name}_chart.html")
print(f"     Data Debug: Saving initial chart to {chart_file}")
bt.plot(filename=chart_file, open_browser=False)

# ────────────────────────────── Optimization ──────────────────────────────
# Optimize the risk_reward parameter over the range 150 to 250 with step 50.
# (risk_reward is an integer parameter; risk_reward/100 gives the multiplier.)
print("     Data Debug: Starting parameter optimization …")
optim = bt.optimize(risk_reward=range(150, 251, 50),
                    maximize='Equity Final [$]',
                    constraint=lambda param: param.risk_reward > 0,
                    return_stats=True)

print("   Data Debug: Optimization complete!")
print(optim)
print(optim._strategy)

# Save the optimized chart output
opt_chart_file = os.path.join(chart_dir, f"{strategy_name}_optimized_chart.html")
print(f"     Data Debug: Saving optimized chart to {opt_chart_file}")
bt.plot(filename=opt_chart_file, open_browser=False)

print("     Data: All done! Happy trading!") 

──────────────────────────────

A few notes:
1. We use talib.SMA for market bias detection (SMA9 vs. SMA21).
2. The accumulation phase is roughly detected by comparing the range of the last 3 bars to the average range of the past 5 bars.
3. A “fair value gap” is approximated using the previous candle’s Open price.
4. Position sizing is calculated as: position_size = int(round((equity * risk_percent/100) / risk))
5. The risk_reward parameter is optimized over 150, 200, and 250 (which translates to ratios 1.5, 2.0, and 2.5).
6. Plenty of Data themed debug messages (with emojis       ) are printed.

Make sure the charts directory exists and that the file paths match your local environment. Enjoy backtesting and optimizing with Data’s Backtest AI!