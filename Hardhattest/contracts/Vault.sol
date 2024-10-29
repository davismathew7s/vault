// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract Vault is AccessControl, Ownable, ReentrancyGuard {
    // Define roles for access control
    bytes32 public constant WITHDRAW_ROLE = keccak256("WITHDRAW_ROLE");

    // Events
    event Deposit(address indexed user, uint256 amount);
    event Withdrawal(address indexed user, uint256 amount);

    // Mapping to store user balances
    mapping(address => uint256) public balances;

    // Constructor to initialize the owner and set up roles
    constructor() Ownable(msg.sender) {
        // Grant the contract deployer the default admin role and withdraw role
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(WITHDRAW_ROLE, msg.sender);
    }

    // Deposit function, allowing users to deposit BNB
    function deposit() external payable {
        require(msg.value > 0, "Must deposit more than zero");
        balances[msg.sender] += msg.value;
        emit Deposit(msg.sender, msg.value);
    }

    // Withdraw function, restricted to accounts with WITHDRAW_ROLE
    function withdraw(uint256 amount) external nonReentrant onlyRole(WITHDRAW_ROLE) {
        require(balances[msg.sender] >= amount, "Insufficient balance");
        balances[msg.sender] -= amount;
        payable(msg.sender).transfer(amount);
        emit Withdrawal(msg.sender, amount);
    }

    // Function for owner to assign the WITHDRAW_ROLE to other addresses
    function grantWithdrawRole(address account) external onlyOwner {
        grantRole(WITHDRAW_ROLE, account);
    }

    // Function for owner to revoke the WITHDRAW_ROLE from addresses
    function revokeWithdrawRole(address account) external onlyOwner {
        revokeRole(WITHDRAW_ROLE, account);
    }

    // View function to check the balance of a user
    function getBalance(address user) external view returns (uint256) {
        return balances[user];
    }
}
