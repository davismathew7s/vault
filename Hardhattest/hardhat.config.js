require('@nomiclabs/hardhat-ethers');
require('@nomicfoundation/hardhat-verify');
require('@nomicfoundation/hardhat-toolbox');

module.exports = {
  networks: {
    bscTestnet: {
      url: `https://data-seed-prebsc-1-s3.bnbchain.org:8545`,
      accounts: ["6450be7a96b6dfeed98aca329338e5e5d4d85b8a9f44752527f944f0adbbbeea"] // Ensure this is a valid private key
    },
  },
  etherscan: {
    apiKey: {
      bscTestnet: "YTM4841RTQN2PCYVYADBDUG9R5QRKRYYGF"
    }
  },
  customChains: [
    {
      network: "bscTestnet",
      chainId: 97,
      urls: {
        apiURL: "https://api-testnet.bscscan.com/api", // Correct API URL for BSC Testnet
        browserURL: "https://testnet.bscscan.com" 
      }
    }
  ],
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
};