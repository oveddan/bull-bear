// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import 'forge-std/Test.sol';
import '../src/BullBear.sol';

contract BullBearTest is Test {
  BullBear bullBear;
  address owner;
  uint256 maxSupply;
  string initialBaseUrl;

  function setUp() public {
    owner = vm.addr(1000);
    maxSupply = 5;
    initialBaseUrl = 'ipfs://01231';
    vm.prank(owner);
    bullBear = new BullBear(maxSupply, initialBaseUrl);
  }

  function test_cannotMintMoreThanMaxSupply() public {
    address minter = vm.addr(3);
    for (uint256 i = 0; i < maxSupply; i++) {
      vm.prank(owner);
      bullBear.safeMint(minter);
    }
    vm.expectRevert();

    vm.prank(owner);
    bullBear.safeMint(minter);
  }

  function test_mintedTokensHaveCorrectUrl() public {
    address minter = vm.addr(3);
    vm.prank(owner);
    bullBear.safeMint(minter);
    vm.prank(owner);
    bullBear.safeMint(minter);
    assertEq(
      bullBear.tokenURI(0),
      string(abi.encodePacked(initialBaseUrl, '0'))
    );
    assertEq(
      bullBear.tokenURI(1),
      string(abi.encodePacked(initialBaseUrl, '1'))
    );

    // should revert when token does not exist
    vm.expectRevert();
    bullBear.tokenURI(2);
  }

  function test_hasHalfHappinessOnMint() public {
    address minter = vm.addr(3);
    vm.prank(owner);
    bullBear.safeMint(minter);
    vm.prank(owner);
    bullBear.safeMint(minter);
    assertEq(bullBear.happiness(0), 50);
    assertEq(bullBear.happiness(1), 50);
  }

  function test_mintsFoodToMinter() public {
    address minter = vm.addr(3);
    vm.prank(owner);
    bullBear.safeMint(minter);
    assertEq(bullBear.bullBearFood().totalBalance(minter), 3);
  }
}
