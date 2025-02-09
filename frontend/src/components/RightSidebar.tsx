'use client'

import { ArrowUpRight, ArrowDownRight, User } from 'lucide-react';

const RightSidebar = () => {
  return (
    <div className="w-80 bg-gray-900/50 backdrop-blur-sm border-l border-gray-700 p-4 overflow-y-auto">
      <div className="space-y-6">
        {/* Account Section */}
        <div className="bg-gray-800/50 rounded-lg p-4">
          <div className="flex items-center space-x-3 mb-4">
            <div className="bg-gray-700 p-2 rounded-full">
              <User className="h-6 w-6" />
            </div>
            <div>
              <div className="text-sm text-gray-400">Connected Wallet</div>
              <div className="font-medium">0x075e...70ea</div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-700/50 rounded-lg p-3">
              <div className="text-sm text-gray-400">Balance</div>
              <div className="font-bold">2.45 ETH</div>
            </div>
            <div className="bg-gray-700/50 rounded-lg p-3">
              <div className="text-sm text-gray-400">Value</div>
              <div className="font-bold">$7,012.59</div>
            </div>
          </div>
        </div>

        {/* Transaction History */}
        <div>
          <h2 className="text-xl font-bold mb-4">Recent Transactions</h2>
          <div className="space-y-3">
            <div className="bg-gray-800/50 rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center">
                  <ArrowUpRight className="h-5 w-5 text-green-400 mr-2" />
                  <div>
                    <div className="font-medium">Bought ETH</div>
                    <div className="text-sm text-gray-400">Today, 2:45 PM</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium">+1.5 ETH</div>
                  <div className="text-sm text-gray-400">$4,281.75</div>
                </div>
              </div>
            </div>

            <div className="bg-gray-800/50 rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div className="flex items-center">
                  <ArrowDownRight className="h-5 w-5 text-red-400 mr-2" />
                  <div>
                    <div className="font-medium">Sold BTC</div>
                    <div className="text-sm text-gray-400">Yesterday, 6:12 PM</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium">-0.25 BTC</div>
                  <div className="text-sm text-gray-400">$12,058.55</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RightSidebar; 