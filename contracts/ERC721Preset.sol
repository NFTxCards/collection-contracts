// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "./ERC721Permit.sol";
import "./ERC721Mintable.sol";
import "./ERC721URI.sol";

contract ERC721Preset is ERC721Permit, ERC721URI, ERC721Mintable {
    constructor(
        string memory name,
        string memory symbol,
        string memory baseURI
    ) ERC721A(name, symbol, type(uint256).max) ERC721URI(baseURI) ERC721Mintable(msg.sender) {}

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721Permit, ERC721A)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    function _baseURI() internal view override(ERC721URI, ERC721A) returns (string memory) {
        return super._baseURI();
    }
}
