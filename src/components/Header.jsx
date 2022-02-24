import React from 'react';

const Header = () => {
  return (
    <div className="relative overflow-hidden flex justify-center bg-teal-300 text-lg font-semibold py-2 px-4 sm:px-6 lg:px-8 bg-center bg-no-repeat">
      <div className="flex items-center text-red-500 hover:text-red-600 ">
        ⚠️ This is a Harmony One Testnet{' '}
        <a
          href="https://explorer.pops.one/address/0x6914794128792d7de3a902E6ce1cD4f6c4ca1dE9"
          className="px-2 underline text-indigo-500 decoration-indigo-500 decoration-wavy decoration-2"
        >
          Contract Address
        </a>
      </div>
    </div>
  );
};

export default Header;
