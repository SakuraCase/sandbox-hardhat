// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "./lib/ERC721A.sol";
import "./lib/Base64.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract Erc721A is Ownable, ERC721A {
    constructor() ERC721A("TestERC721A", "T721A") {}
    function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
        require(_exists(tokenId), "ERC721Metadata: URI query for nonexistent token");

        string[4] memory parts;
        parts[0] = "<svg xmlns='http://www.w3.org/2000/svg' preserveAspectRatio='xMinYMin meet' viewBox='0 0 350 350'><style>.base { fill: white; font-family: serif; font-size: 14px; }</style><rect width='100%' height='100%' fill='black' /><text x='10' y='20' class='base'>";

        parts[1] = "</text><text x='10' y='20' class='base'>";

        parts[2] = Strings.toString(tokenId);

        parts[3] = "</text></svg>";

        string memory output = string(abi.encodePacked(parts[0], parts[1], parts[2], parts[3]));
        string memory json = Base64.encode(bytes(string(abi.encodePacked("{'name': 'ERC721A-", Strings.toString(tokenId), "', 'description': 'test', 'image': 'data:image/svg+xml;base64,", Base64.encode(bytes(output)), "'}"))));
        output = string(abi.encodePacked("data:application/json;base64,", json));

        return output;
    }

    function safeMint(address to, uint256 quantity) public onlyOwner {
        _safeMint(to, quantity);
    }
}