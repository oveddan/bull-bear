// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import 'forge-std/Script.sol';

import '../src/BullBear.sol';

contract DeployBase is Script {
  uint256 deployerPrivateKey;

  constructor(uint256 _deployerPrivateKey) {
    deployerPrivateKey = _deployerPrivateKey;
  }

  function run() external returns (address bullBearAddress) {
    address minter = 0x70997970C51812dc3A010C7d01b50e0d17dc79C8;

    vm.startBroadcast(deployerPrivateKey);

    BullBear bullBear = new BullBear('ipfs.io://ipfs');
    bullBearAddress = address(bullBear);

    bullBear.safeMint(minter);

    console.log(bullBearAddress);

    vm.stopBroadcast();
  }
}

contract DeployAnvil is DeployBase {
  constructor() DeployBase(vm.envUint('DEPLOYER_PRIVATE_KEY')) {}
}

contract DeployScroll is DeployBase {
  constructor() DeployBase(vm.envUint('SCROLL_DEPLOYER_PRIVATE_KEY')) {}
}
