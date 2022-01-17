import React from 'react';

const Header = () => {
  return (
    <div className="relative overflow-hidden flex justify-center bg-teal-300 text-lg font-semibold py-2 px-4 sm:px-6 lg:px-8 bg-center bg-no-repeat">
      <div className="flex items-center text-red-500 hover:text-red-600 ">
        ⚠️ This is a Rinkeby Testnet{' '}
        <a
          href="https://rinkeby.etherscan.io/address/0xb77d9699267298eaa57d6fa96c65fe9b7c45a6c8"
          className="px-2 underline text-indigo-500 decoration-indigo-500 decoration-wavy decoration-2"
        >
          Contract Adress
        </a>
      </div>
    </div>
  );
};

export default Header;
