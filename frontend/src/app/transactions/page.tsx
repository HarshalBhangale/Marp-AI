import LeftSidebar from '@/components/LeftSidebar'
import RightSidebar from '@/components/RightSidebar'

const transactions = [
  {
    id: 1,
    type: 'buy',
    asset: 'BTC',
    amount: '0.25',
    price: '48,234.21',
    total: '12,058.55',
    status: 'completed',
    date: '2024-02-09 14:30:00',
  },
  {
    id: 2,
    type: 'sell',
    asset: 'ETH',
    amount: '2.5',
    price: '2,854.12',
    total: '7,135.30',
    status: 'completed',
    date: '2024-02-09 13:15:00',
  },
  {
    id: 3,
    type: 'buy',
    asset: 'ETH',
    amount: '1.0',
    price: '2,845.00',
    total: '2,845.00',
    status: 'pending',
    date: '2024-02-09 14:45:00',
  },
]

export default function Transactions() {
  return (
    <div className="flex h-screen">
      <LeftSidebar />
      <main className="flex-1 bg-gray-900 p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Transaction History</h1>
          <div className="flex gap-4">
            <button className="bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-700">
              Export CSV
            </button>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
              New Transaction
            </button>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-900">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Asset
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {transactions.map((transaction) => (
                <tr key={transaction.id}>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        transaction.type === 'buy'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {transaction.type.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4">{transaction.asset}</td>
                  <td className="px-6 py-4">{transaction.amount}</td>
                  <td className="px-6 py-4">${transaction.price}</td>
                  <td className="px-6 py-4">${transaction.total}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        transaction.status === 'completed'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {transaction.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4">{transaction.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
      <RightSidebar />
    </div>
  )
} 