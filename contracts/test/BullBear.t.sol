// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import 'forge-std/Test.sol';
import '../src/BullBear.sol';

contract BullBearTest is Test {
  BullBear bullBear;
  address owner;
  // uint256 maxSupply;
  string initialBaseUrl;

  function setUp() public {
    owner = vm.addr(1000);
    // maxSupply = 5;
    initialBaseUrl = 'ipfs://01231';
    vm.prank(owner);
    bullBear = new BullBear(initialBaseUrl, '', '');
  }

  function test_canMintUnlimited(uint8 quantity) public {
    address minter = vm.addr(3);
    for (uint256 i = 0; i < quantity; i++) {
      vm.prank(owner);
      bullBear.safeMint(minter);
    }
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
    bullBear.safeMint(minter);
    bullBear.safeMint(minter);
    assertEq(bullBear.getHappiness(0), 50);
    assertEq(bullBear.getHappiness(1), 50);
  }

  function test_happinessReducesOverTime() public {
    address minter = vm.addr(3);

    uint256 startTime = 4 days;

    vm.warp(startTime);
    uint256 tokenId = bullBear.safeMint(minter);

    // decays 50 happiness per 60 seconds;
    uint256 decayRate = bullBear.happinessDecayRatePerMinute();
    uint256 decayInterval = 60;

    uint256 timeSinceStart = 27 seconds;

    vm.warp(startTime + timeSinceStart);

    // decayRate / decayInterval = (x / timeElapsed)
    // x = (decayRate / decayInterval) * timeElapsed
    uint256 expectedDecay = (timeSinceStart * decayRate) / decayInterval;

    // expected happiness is starting happiness - decay * time since start
    uint8 expectedHappiness = uint8(50 - expectedDecay);

    assertEq(bullBear.getHappiness(tokenId), expectedHappiness);
  }

  function test_pettingIncreasesHappiness() public {
    address minter = vm.addr(3);
    uint256 mintTime = 1 days;

    vm.warp(mintTime);
    uint256 tokenId = bullBear.safeMint(minter);

    // pet the bull bear
    bullBear.pet(tokenId);

    uint256 initialHappiness = bullBear.initialHappiness() +
      bullBear.pettingBonus();
    // happiness should increase by 10
    assertEq(bullBear.getHappiness(tokenId), initialHappiness);

    uint256 timeSinceStart = 33 seconds;
    // advance by 33 seconds
    vm.warp(mintTime + timeSinceStart);

    // happiness should decrease by expected decay
    uint256 expectedDecay = (timeSinceStart *
      bullBear.happinessDecayRatePerMinute()) / 60;

    assertEq(bullBear.getHappiness(tokenId), initialHappiness - expectedDecay);

    // now pet the bull bear again, it should increase by 10
    bullBear.pet(tokenId);
    console.log(bullBear.getHappiness(tokenId));
    assertEq(
      bullBear.getHappiness(tokenId),
      initialHappiness - expectedDecay + 10,
      'pet again'
    );
  }

  function test_pet_RevertsWhen_MinPettingIntervalSecondsNotElapsed() public {
    address minter = vm.addr(3);
    uint256 mintTime = 1 days;

    vm.warp(mintTime);
    uint256 tokenId = bullBear.safeMint(minter);

    // pet the bull bear
    bullBear.pet(tokenId);

    // advance to 1 second before min petting interval
    vm.warp(mintTime + bullBear.minPettingIntervalSeconds() - 1 seconds);
    // petting again should revert
    vm.expectRevert();
    bullBear.pet(tokenId);

    // now advance by 1 second (min petting interval), should succeed
    vm.warp(mintTime + bullBear.minPettingIntervalSeconds());
    bullBear.pet(tokenId);
  }

  // function test_revertsWhen_reachesZero() public {
  //   address minter = vm.addr(3);
  //   uint256 mintTime = 1 days;

  //   vm.warp(mintTime);
  //   uint256 tokenId = bullBear.safeMint(minter);

  //   // advance beyond when the bull bear should be dead
  //   // happiness to decay = initial happiness
  //   // x / happiness to decay = 60 seconds / decay rate
  //   // solve for x:
  //   // x = happiness to decay * (60 seconds / decay rate)
  //   uint256 timeToReachZero = ((uint256(bullBear.initialHappiness()) * 60) /
  //     bullBear.happinessDecayRatePerMinute());
  //   vm.warp(mintTime + timeToReachZero);

  //   // assert happiness is zero
  //   assertEq(bullBear.getHappiness(tokenId), 0);

  //   // petting should revert
  //   vm.expectRevert();
  //   bullBear.pet(tokenId);
  // }

  // function test_mintsFoodToMinter() public {
  //   address minter = vm.addr(3);
  //   vm.prank(owner);
  //   bullBear.safeMint(minter);
  //   assertEq(bullBear.bullBearFood().totalBalance(minter), 3);
  // }
}
