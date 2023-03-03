// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

pragma solidity ^0.8.9;

import '@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol';
import '@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol';
import '@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol';
import '@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol';
import '@openzeppelin/contracts-upgradeable/utils/CountersUpgradeable.sol';

contract BullBear is
  Initializable,
  ERC721Upgradeable,
  OwnableUpgradeable,
  UUPSUpgradeable
{
  using CountersUpgradeable for CountersUpgradeable.Counter;

  uint256 public immutable maxSupply;

  CountersUpgradeable.Counter private _tokenIdCounter;

  /// @custom:oz-upgrades-unsafe-allow constructor
  constructor(uint256 _maxSupply) {
    maxSupply = _maxSupply;
    _disableInitializers();
  }

  function initialize() public initializer {
    __ERC721_init('BullBear', 'BLBR');
    __Ownable_init();
    __UUPSUpgradeable_init();
  }

  function safeMint(address to) public {
    uint256 tokenId = _tokenIdCounter.current();
    if (tokenId >= maxSupply) {
      revert('Max supply reached');
    }
    _tokenIdCounter.increment();
    _safeMint(to, tokenId);
  }

  function _authorizeUpgrade(
    address newImplementation
  ) internal override onlyOwner {}
}
