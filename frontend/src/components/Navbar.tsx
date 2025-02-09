import Link from 'next/link';

const Navbar = () => {
  return (
    <nav className="bg-gray-800/50 backdrop-blur-sm border-b border-gray-700 fixed w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <span className="text-xl font-bold text-white">Trading Bot</span>
            </Link>
          </div>
          
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <Link href="/" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                Home
              </Link>
              <Link href="/library" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                Library
              </Link>
              <Link href="/transactions" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                Transactions
              </Link>
            </div>
          </div>

          <div className="flex items-center">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium">
              Connect Wallet
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 