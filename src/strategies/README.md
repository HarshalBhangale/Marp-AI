#    Data's Trading Strategies

## Overview
This directory contains the base strategy class and custom trading strategies for Data's AI Trading System.

## Structure
```
strategies/
├── base_strategy.py      # Base class all strategies inherit from
├── custom/              # Directory for your custom strategies
│   ├── __init__.py
│   ├── example_strategy.py
│   └── private_my_strategy.py
└── __init__.py
```

## How It Works
1. All strategies must inherit from `BaseStrategy`
2. Each strategy must implement `generate_signals()` method
3. Signals are evaluated by the LLM before execution
4. Approved signals are executed with position sizing based on signal strength

## Creating a Custom Strategy
1. Create a new file in `custom/` directory
2. Inherit from `BaseStrategy`
3. Implement `generate_signals()` returning:
```python
{
    'token': str,          # Token address
    'signal': float,       # Signal strength (0-1)
    'direction': str,      # 'BUY', 'SELL', or 'NEUTRAL'
    'metadata': dict       # Optional strategy-specific data
}
```

## Example Strategy
```python
from src.strategies.base_strategy import BaseStrategy

class MyStrategy(BaseStrategy):
    def __init__(self):
        super().__init__("My Custom Strategy   ")
    
    def generate_signals(self) -> dict:
        return {
            'token': 'TOKEN_ADDRESS',
            'signal': 0.85,        # 85% confidence
            'direction': 'BUY',
            'metadata': {
                'reason': 'Strategy-specific reasoning',
                'indicators': {'rsi': 28, 'trend': 'bullish'}
            }
        }
``` 