// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract DevCoin is ERC20 {
    constructor() ERC20("DevCoin", "DEV") {
        _mint(msg.sender, 1000 * 10 ** 18);
    }
}

// Plan for today:
// - Deploy smart contract
// - Read from smart contract
// - Write to smart contract / send transactions
// - Listen to evwents

// Stack: ERC20, ethers, React.js, js
