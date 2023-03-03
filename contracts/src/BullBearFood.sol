// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import '@openzeppelin/contracts/token/ERC1155/ERC1155.sol';
import '@openzeppelin/contracts/access/Ownable.sol';
import '@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Supply.sol';

struct BullBearTokenSpec {
  uint8 id;
  uint8 happinessImpact;
  string assetUri;
}

contract BullBearFood is ERC1155, Ownable {
  uint8 constant maxTokens = 4;

  uint8 nextToken = 1;

  // way to view until we have events
  mapping(address => mapping(uint8 => uint16)) tokenBalance;
  mapping(address => uint256) public totalBalance;

  constructor() ERC1155('ipfs.io://') {}

  function setURI(string memory newuri) public onlyOwner {
    _setURI(newuri);
  }

  function mint(address account, uint256 amount) public onlyOwner {
    bytes memory element;

    uint256 randomSeed = block.difficulty;
    // randomish tokens
    uint8 start = uint8(
      uint256(keccak256(abi.encodePacked(randomSeed))) % maxTokens
    );

    for (uint8 i = 0; i < amount; i++) {
      uint8 id = (start + i) % maxTokens;

      tokenBalance[account][id]++;
      totalBalance[account]++;
      _mint(account, id, 1, element);
    }
  }

  // normally this would be in an event
}
