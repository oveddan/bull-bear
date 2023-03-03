// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import 'forge-std/Script.sol';

import '../src/BullBear.sol';

contract Deploy is Script {
  function run() external returns (address bullBearAddress) {
    uint256 deployerPrivateKey = vm.envUint('DEPLOYER_PRIVATE_KEY');

    address minter = 0x70997970C51812dc3A010C7d01b50e0d17dc79C8;

    vm.startBroadcast(deployerPrivateKey);

    BullBear bullBear = new BullBear(5, 'ipfs.io://ipfs');
    bullBearAddress = address(bullBear);

    bullBear.safeMint(minter);

    console.log(bullBearAddress);

    vm.stopBroadcast();
  }
}
