// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "./ERC721Permit.sol";
import "./ERC721Mintable.sol";
import "./ERC721URI.sol";


//  _                 __  ___  _____         ___              _
// | |__  _   _    /\ \ \/ __\/__   \__  __ / __\__ _ _ __ __| |___
// | '_ \| | | |  /  \/ / _\    / /\/\ \/ // /  / _` | '__/ _` / __|
// | |_) | |_| | / /\  / /     / /    >  </ /__| (_| | | | (_| \__ \
// |_.__/ \__, | \_\ \/\/      \/    /_/\_\____/\__,_|_|  \__,_|___/
//        |___/



contract MusesOfPleasure is ERC721Permit, ERC721URI, ERC721Mintable {
    constructor(
        string memory name,
        string memory symbol,
        string memory baseURI,
        uint256 maxBatchSize
    ) ERC721A(name, symbol, maxBatchSize) ERC721URI(baseURI) ERC721Mintable(msg.sender) {}

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
