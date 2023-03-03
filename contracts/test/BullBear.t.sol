// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import 'forge-std/Test.sol';
import '../src/BullBear.sol';

contract BullBearTest is Test {
  BullBear bullBear;
  address owner;
  uint256 maxSupply;

  function setUp() public {
    owner = vm.addr(1);
    maxSupply = 5;
    vm.prank(owner);
    bullBear = new BullBear(maxSupply);
    // vm.prank(owner);
    // bullBear.initialize();
  }

  function test_cannotMintMoreThanMaxSupply() public {
    address minter = vm.addr(3);
    for (uint256 i = 0; i < maxSupply; i++) {
      bullBear.safeMint(minter);
    }
    vm.expectRevert();

    bullBear.safeMint(minter);
  }
}
