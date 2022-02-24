require('@nomiclabs/hardhat-waffle');
require('hardhat-gas-reporter');

const dotenv = require('dotenv');
dotenv.config();

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task('accounts', 'Prints the list of accounts', async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

const ACCOUNT_PRIVATE_KEY = process.env.ETHEREUM_WALLET_PRIVATE_KEY;
/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: '0.8.4',
  networks: {
    rinkeby: {
      url: process.env.ALCHEMY_API_URL,
      accounts: [ACCOUNT_PRIVATE_KEY]
    },
    harmony_testnet: {
      url: 'https://api.s0.b.hmny.io',
      accounts: [ACCOUNT_PRIVATE_KEY]
    }
  }
};
