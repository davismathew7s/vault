## Prerequisites
Before setting up the project, ensure that you have the following installed on your system:
- Node.js (v12.x or higher)
- npm or yarn

## Getting Started

### 1. Clone the Repository

```bash
git clone <your-git-repo-url>

```
### 2. Navigate to the Project Directory
```bash
cd vault-frontend
```
### 3. Install Dependencies
- To install the necessary dependencies, run the following command:
```bash
npm install
```
### 4. Configure Environment Variables
- Create a .env file in the root directory with the following environment variables:

### Required Environment Variables

| Variable Name               | Description                                                       |
|-----------------------------|-------------------------------------------------------------------|
| `VITE_APP_CLAIM_ADDRESS`    | The Ethereum address of the claim contract.                      |
| `VITE_APP_CLAIM_ABI`        | The ABI (Application Binary Interface) of the claim contract.   |
| `VITE_APP_CHAIN_ID`         | The chain ID for the network (e.g., `97` for BSC Testnet).     |
| `VITE_APP_BLOCK_EXPLORER`   | URL of the block explorer (e.g., `https://testnet.bscscan.com/`). |
| `VITE_APP_RPC_URL`          | The RPC URL for connecting to the blockchain (e.g., `https://data-seed-prebsc-1-s3.bnbchain.org:8545`). |


### 5. Run the Application Locally
```bash
npm run dev
