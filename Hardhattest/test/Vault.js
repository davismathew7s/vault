// SPDX-License-Identifier: MIT
const { assert, expect } = require("chai");
const { ethers } = require("hardhat");

describe("Vault Contract", function () {
    let vault;
    let owner;
    let user1;
    let user2;

    beforeEach(async function () {
        // Deploy the Vault contract
        [owner, user1, user2] = await ethers.getSigners();
        const Vault = await ethers.getContractFactory("Vault");
        vault = await Vault.deploy();  // Deploy the contract
    });

    it("should allow users to deposit BNB", async function () {
        const depositAmount = ethers.parseUnits("25", "wei");
        await vault.connect(user1).deposit({ value: depositAmount });

        const balance = await vault.getBalance(user1.address);
        expect(balance).to.equal(depositAmount);
    });

    it("should allow only users with WITHDRAW_ROLE to withdraw", async function () {
        const depositAmount = ethers.parseUnits("25", "wei");
        await vault.connect(user1).deposit({ value: depositAmount });

        // User1 should not be able to withdraw yet
        await expect(vault.connect(user1).withdraw(depositAmount)).to.be.reverted

        // Grant WITHDRAW_ROLE to user1
        await vault.grantWithdrawRole(user1.address);

        // Now user1 can withdraw
        await vault.connect(user1).withdraw(depositAmount);

        const balance = await vault.getBalance(user1.address);
        expect(balance).to.equal(0, "User1's balance should be zero after withdrawal");
    });

    it("should allow the owner to grant and revoke WITHDRAW_ROLE", async function () {
        // Grant WITHDRAW_ROLE to user1
        await vault.grantWithdrawRole(user1.address);
        assert.isTrue(await vault.hasRole(await vault.WITHDRAW_ROLE(), user1.address), "User1 should have WITHDRAW_ROLE");

        // Revoke WITHDRAW_ROLE from user1
        await vault.revokeWithdrawRole(user1.address);
        assert.isFalse(await vault.hasRole(await vault.WITHDRAW_ROLE(), user1.address), "User1 should not have WITHDRAW_ROLE anymore");
    });

    it("should revert withdrawal if amount exceeds balance", async function () {
        const depositAmount = ethers.parseUnits("25", "wei");
        await vault.connect(user1).deposit({ value: depositAmount });

        // Grant WITHDRAW_ROLE to user1
        await vault.grantWithdrawRole(user1.address);

        // Try to withdraw more than the balance using the + operator
        const overWithdrawAmount = depositAmount + ethers.parseUnits("1", "wei");
        await expect(vault.connect(user1).withdraw(overWithdrawAmount)).to.be.revertedWith("Insufficient balance");
    });

    it("should revert deposit of zero amount", async function () {
        await expect(vault.connect(user1).deposit({ value: 0 })).to.be.revertedWith("Must deposit more than zero");
    });

    it("should revert withdrawal without WITHDRAW_ROLE", async function () {
        const depositAmount = ethers.parseUnits("25", "wei");
        await vault.connect(user1).deposit({ value: depositAmount });

        // User1 tries to withdraw without WITHDRAW_ROLE
        await expect(vault.connect(user1).withdraw(depositAmount)).to.be.reverted
    });

    it("should revert withdrawal of more than balance after multiple deposits", async function () {
        const depositAmount1 = ethers.parseUnits("25", "wei");
        const depositAmount2 = ethers.parseUnits("15", "wei");
        await vault.connect(user1).deposit({ value: depositAmount1 });
        await vault.connect(user1).deposit({ value: depositAmount2 });

        // Grant WITHDRAW_ROLE to user1
        await vault.grantWithdrawRole(user1.address);

        // Total balance is now 40 wei, try to withdraw 50 wei
        const overWithdrawAmount = ethers.parseUnits("50", "wei");
        await expect(vault.connect(user1).withdraw(overWithdrawAmount)).to.be.revertedWith("Insufficient balance");
    });

    it("should allow the owner to grant multiple WITHDRAW_ROLE and revoke correctly", async function () {
        await vault.grantWithdrawRole(user1.address);
        await vault.grantWithdrawRole(user2.address);
        assert.isTrue(await vault.hasRole(await vault.WITHDRAW_ROLE(), user1.address), "User1 should have WITHDRAW_ROLE");
        assert.isTrue(await vault.hasRole(await vault.WITHDRAW_ROLE(), user2.address), "User2 should have WITHDRAW_ROLE");

        await vault.revokeWithdrawRole(user1.address);
        assert.isFalse(await vault.hasRole(await vault.WITHDRAW_ROLE(), user1.address), "User1 should not have WITHDRAW_ROLE anymore");
        assert.isTrue(await vault.hasRole(await vault.WITHDRAW_ROLE(), user2.address), "User2 should still have WITHDRAW_ROLE");
    });

    it("should allow only the owner to grant and revoke roles", async function () {
        await expect(vault.connect(user1).grantWithdrawRole(user2.address)).to.be.reverted
        await expect(vault.connect(user1).revokeWithdrawRole(user2.address)).to.be.reverted
    });

});
