// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import './BullBearToken.sol';
import './BullBearFood.sol';

import '@openzeppelin/contracts/token/ERC721/ERC721.sol';
import '@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol';
import '@openzeppelin/contracts/access/Ownable.sol';
import '@openzeppelin/contracts/utils/Counters.sol';

struct LastHappiness {
  uint256 time;
  uint8 happiness;
}

error TooSoonToPet(uint256 minPetTime);
error Rekt();

struct Urls {
  string baseUrl;
  string modelUrl;
  string behaveGraphUrl;
}

contract BullBear is ERC721, ERC721URIStorage, Ownable {
  using Counters for Counters.Counter;
  uint8 constant MAX_HAPPINESS = 100;
  uint8 constant INITIAL_HAPPINESS = MAX_HAPPINESS / 2;
  uint8 constant INITIAL_FOOD = 3;
  uint8 constant HAPPINESS_DECAY_RATE_PER_MINUTE = 30;
  uint8 constant PETTING_BONUS = 20;
  uint8 constant MIN_PETTING_INTERVAL_SECONDS = 5;

  Counters.Counter private _tokenIdCounter;

  BullBearToken public immutable bullBearToken;
  // BullBearFood public immutable bullBearFood;

  event Petted(uint256 tokenId);

  mapping(uint256 => LastHappiness) private lastHappiness;
  mapping(uint256 => uint256) private lastPetTime;

  string public baseURI;
  string public modelURI;
  string public behaveGraphURI;

  constructor(
    string memory _initialBaseUri,
    string memory _modelUrl,
    string memory _initialBehaveGraphURI
  ) ERC721('BullBear', 'BBTK') {
    baseURI = _initialBaseUri;
    bullBearToken = new BullBearToken();
    modelURI = _modelUrl;
    behaveGraphURI = _initialBehaveGraphURI;
    // bullBearFood = new BullBearFood();
  }

  function safeMint(address to) public returns (uint256) {
    uint256 tokenId = _tokenIdCounter.current();

    _tokenIdCounter.increment();
    lastHappiness[tokenId] = LastHappiness(block.timestamp, INITIAL_HAPPINESS);

    _safeMint(to, tokenId);
    // bullBearFood.mint(to, INITIAL_FOOD);

    return tokenId;
  }

  function setBehaveGraphURI(string memory _behaveGraphURI) external onlyOwner {
    behaveGraphURI = _behaveGraphURI;
  }

  function canPet(uint256 tokenId) public view returns (bool) {
    if (lastPetTime[tokenId] == 0) return true;

    uint256 elapsed = block.timestamp - lastPetTime[tokenId];

    return elapsed >= MIN_PETTING_INTERVAL_SECONDS;
  }

  function pet(uint256 tokenId) public {
    // if (isRekt(tokenId)) {
    //   revert Rekt();
    // }
    // check if can pet according to the time
    // if this is a new pet, then we can pet
    if (!canPet(tokenId)) {
      revert TooSoonToPet({minPetTime: MIN_PETTING_INTERVAL_SECONDS});
    }

    lastPetTime[tokenId] = block.timestamp;
    emit Petted(tokenId);
    _increaseHappiness(tokenId, PETTING_BONUS);
  }

  function isRekt(uint256 tokenId) public view returns (bool) {
    return getHappiness(tokenId) == 0;
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

  function getHappiness(uint256 tokenId) public view returns (uint8) {
    LastHappiness storage _lastHappiness = lastHappiness[tokenId];
    uint256 elapsed = block.timestamp - _lastHappiness.time;
    uint256 decay = (HAPPINESS_DECAY_RATE_PER_MINUTE * elapsed) / 60;

    if (decay >= _lastHappiness.happiness) {
      return 0;
    }

    return _lastHappiness.happiness - uint8(decay);
  }

  function pettingBonus() external pure returns (uint8) {
    return PETTING_BONUS;
  }

  function initialHappiness() external pure returns (uint8) {
    return INITIAL_HAPPINESS;
  }

  function happinessDecayRatePerMinute() external pure returns (uint8) {
    return HAPPINESS_DECAY_RATE_PER_MINUTE;
  }

  function minPettingIntervalSeconds() external pure returns (uint8) {
    return MIN_PETTING_INTERVAL_SECONDS;
  }

  function modelAndGraphUrls() external view returns (Urls memory) {
    return Urls(baseURI, modelURI, behaveGraphURI);
  }

  function _increaseHappiness(uint256 tokenId, uint8 amount) private {
    lastHappiness[tokenId] = LastHappiness(
      block.timestamp,
      _min(getHappiness(tokenId) + amount, MAX_HAPPINESS)
    );
  }

  function _min(uint8 a, uint8 b) private pure returns (uint8) {
    if (a < b) {
      return a;
    }

    return b;
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
