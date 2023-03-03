// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

pragma solidity ^0.8.9;

import '@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol';
import '@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721URIStorageUpgradeable.sol';
import '@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol';
import '@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol';
import '@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol';
import '@openzeppelin/contracts-upgradeable/utils/CountersUpgradeable.sol';

contract BullBear is
  Initializable,
  ERC721Upgradeable,
  ERC721URIStorageUpgradeable,
  OwnableUpgradeable,
  UUPSUpgradeable
{
  using CountersUpgradeable for CountersUpgradeable.Counter;

  uint256 public immutable maxSupply;

  string public baseURI;

  CountersUpgradeable.Counter private _tokenIdCounter;

  /// @custom:oz-upgrades-unsafe-allow constructor
  constructor(uint256 _maxSupply, string memory _initialBaseUri) {
    maxSupply = _maxSupply;
    baseURI = _initialBaseUri;
    _disableInitializers();
  }

  function initialize() public initializer {
    __ERC721_init('BullBear', 'BLBR');
    __ERC721URIStorage_init();
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

  function setBaseUri(string calldata _newBaseUri) public onlyOwner {
    baseURI = _newBaseUri;
  }

  function _burn(
    uint256 tokenId
  ) internal override(ERC721Upgradeable, ERC721URIStorageUpgradeable) {
    super._burn(tokenId);
  }

  function _baseURI() internal view override returns (string memory) {
    return baseURI;
  }

  function tokenURI(
    uint256 tokenId
  )
    public
    view
    override(ERC721Upgradeable, ERC721URIStorageUpgradeable)
    returns (string memory)
  {
    return super.tokenURI(tokenId);
  }

  function _authorizeUpgrade(
    address newImplementation
  ) internal override onlyOwner {}
}
