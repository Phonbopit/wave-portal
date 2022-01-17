// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract WavePortal {
    uint256 totalWaves;
    address[] public wavedAddresses;

    uint256 private seed;

    mapping(address => uint256) public lastWavedAt;

    event NewWave(address indexed from, string message, uint256 timestamp);

    struct Wave {
        address waver;
        string message;
        uint256 timestamp;
    }

    Wave[] waves;

    constructor() payable {
        console.log("WavePortal by Chai Phonbopit");
        // Set the intial seed
        seed = (block.timestamp + block.difficulty) % 100;
    }

    function wave(string memory _message) public {
        require(
            lastWavedAt[msg.sender] + 10 minutes < block.timestamp, "Please Waiting for 10m"
        );

        lastWavedAt[msg.sender] = block.timestamp;
        totalWaves += 1;
        console.log("%s waved w/ message %s", msg.sender, _message);
        
        waves.push(Wave(msg.sender, _message, block.timestamp));
        
        seed = (block.difficulty + block.timestamp + seed) % 100;
        console.log('Random # generated: %d', seed);

        if (seed <= 50) {
            console.log('%s won!', msg.sender);

            uint256 prizeAmount = 0.0001 ether;

            require(prizeAmount <= address(this).balance, "Out of money :)");
            
            (bool success, ) = (msg.sender).call{value: prizeAmount}("");
            require(success, "Failed to withdraw money from this contract.");
        }
        emit NewWave(msg.sender, _message, block.timestamp);
    }

    function getAllWaves() public view returns (Wave[] memory) {
        return waves;
    }

    function getTotalWaves() public view returns (uint256) {
        console.log("We have %d total waves!", totalWaves);
        return totalWaves;
    }
}