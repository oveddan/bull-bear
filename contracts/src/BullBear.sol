// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

pragma solidity ^0.8.9;

import './BullBearToken.sol';
import './BullBearFood.sol';

import '@openzeppelin/contracts/token/ERC721/ERC721.sol';
import '@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol';
import '@openzeppelin/contracts/access/Ownable.sol';
import '@openzeppelin/contracts/utils/Counters.sol';

contract BullBear is ERC721, ERC721URIStorage, Ownable {
  using Counters for Counters.Counter;
  uint8 constant MAX_HAPPINESS = 100;
  uint constant INITIAL_FOOD = 3;

  Counters.Counter private _tokenIdCounter;

  BullBearToken public immutable bullBearToken;
  BullBearFood public immutable bullBearFood;

  mapping(uint256 => uint8) public happiness;

  uint256 public immutable maxSupply;

  string public baseURI;

  constructor(
    uint256 _maxSupply,
    string memory _initialBaseUri
  ) ERC721('BullBear', 'BBTK') {
    maxSupply = _maxSupply;
    baseURI = _initialBaseUri;
    bullBearToken = new BullBearToken();
    bullBearFood = new BullBearFood();
  }

  function safeMint(address to) public onlyOwner {
    uint256 tokenId = _tokenIdCounter.current();
    if (tokenId >= maxSupply) {
      revert('Max supply reached');
    }
    _tokenIdCounter.increment();
    happiness[tokenId] = MAX_HAPPINESS / 2;

    _safeMint(to, tokenId);
    bullBearFood.mint(to, INITIAL_FOOD);
  }

  // The following functions are overrides required by Solidity.
  function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
    super._burn(tokenId);
  }

  function _baseURI() internal view override returns (string memory) {
    return baseURI;
  }

  function tokenURI(
    uint256 tokenId
  ) public view override(ERC721, ERC721URIStorage) returns (string memory) {
    return super.tokenURI(tokenId);
  }

  function supportsInterface(
    bytes4 interfaceId
  ) public view override(ERC721, ERC721URIStorage) returns (bool) {
    return super.supportsInterface(interfaceId);
  }
}

/*
contract BullBear is
  Initializable,
  ERC721Upgradeable,
  ERC721URIStorageUpgradeable,
  OwnableUpgradeable,
  UUPSUpgradeable
{
  using CountersUpgradeable for CountersUpgradeable.Counter;

  uint8 constant MAX_HAPPINESS = 100;
  uint constant INITIAL_FOOD = 3;

  uint256 public immutable maxSupply;

  string public baseURI;

  BullBearToken public immutable bullBearToken;
  BullBearFood public immutable bullBearFood;

  CountersUpgradeable.Counter private _tokenIdCounter;

  mapping(uint256 => uint8) public happiness;
  mapping(uint256 => uint256) public lastWithdrawn;
  mapping(uint256 => uint8) public happinessWhenWithdrawn;
  mapping(uint256 => uint256) public withdrawals;

  /// @custom:oz-upgrades-unsafe-allow constructor
  constructor(uint256 _maxSupply, string memory _initialBaseUri) {
    _disableInitializers();
    maxSupply = _maxSupply;
    baseURI = _initialBaseUri;
    bullBearToken = new BullBearToken();
    bullBearFood = new BullBearFood();
  }

  function initialize() public initializer {
    __ERC721_init('BullBear', 'BLBR');
    __ERC721URIStorage_init();
    __Ownable_init();
    __UUPSUpgradeable_init();
  }

  function safeMint(address to) public onlyOwner {
    uint256 tokenId = _tokenIdCounter.current();
    if (tokenId >= maxSupply) {
      revert('Max supply reached');
    }
    _tokenIdCounter.increment();
    happiness[tokenId] = MAX_HAPPINESS / 2;

    _safeMint(to, tokenId);
    bullBearFood.mint(to, INITIAL_FOOD);
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
*/
