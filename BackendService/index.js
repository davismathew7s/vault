const express = require('express');
const Web3 = require('web3');
const { ethers } = require("ethers");
const VaultContract = require('./contract/Vault.json');  // ABI
require('dotenv').config();
const app = express();
const PORT = process.env.PORT || 5000;

const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_PROVIDER);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
const contract = new ethers.Contract(process.env.CONTRACT_ADDRESS, VaultContract.abi, wallet);

app.use(express.json());

// Listening for Deposit events
contract.on("Deposit", (user, amount, event) => {
    console.log(`Deposit: ${user} deposited ${ethers.utils.formatEther(amount)} ETH`);
    // Optional: Notify frontend via WebSocket or another mechanism
});

// Listening for Withdrawal events
contract.on("Withdrawal", (user, amount, event) => {
    console.log(`Withdrawal: ${user} withdrew ${ethers.utils.formatEther(amount)} ETH`);
    // Optional: Notify frontend via WebSocket or another mechanism
});

app.post('/withdraw', async (req, res) => {
    const { amount } = req.body;
    try {
        const tx = await contract.withdraw(ethers.utils.parseEther(amount));
        await tx.wait();
        res.status(200).json({ message: `Withdrawn ${amount} BNB`, txHash: tx.hash });
    } catch (error) {
        console.error("Withdrawal Error:", error);
        res.status(500).json({ error: "Withdrawal failed" });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
