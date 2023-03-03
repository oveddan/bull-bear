// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

contract Counter {
  uint256 public number = 0;

  event Transfer(address indexed from, address indexed to, uint256 value);

  function setNumber(uint256 newNumber) public {
    number = newNumber;
  }

  function getNumber() public view returns (uint256) {
    return number;
  }

  function increment() public {
    number++;
  }
}
