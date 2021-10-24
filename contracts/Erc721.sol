// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/presets/ERC721PresetMinterPauserAutoId.sol";

contract Erc721 is ERC721PresetMinterPauserAutoId {
  constructor() ERC721PresetMinterPauserAutoId("MyToken", "MTK", "http://localhost:3000/tokens/") {}
}