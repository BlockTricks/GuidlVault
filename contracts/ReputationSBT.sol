// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract ReputationSBT is ERC721, Ownable {
    uint256 private _tokenId;
    mapping(address => bool) public researcherMinted;
    mapping(address => bool) public judgeMinted;
    address public minter;

    constructor(address _owner) ERC721("VaultGuard Reputation", "VGR") Ownable(_owner) {}

    function setMinter(address _minter) external onlyOwner {
        require(_minter != address(0), "Invalid minter");
        minter = _minter;
    }

    modifier onlyMinter() {
        require(msg.sender == minter, "Not minter");
        _;
    }

    function mintResearcher(address to) external onlyMinter {
        if (!researcherMinted[to]) {
            researcherMinted[to] = true;
            _mintOne(to);
        }
    }

    function mintJudge(address to) external onlyMinter {
        if (!judgeMinted[to]) {
            judgeMinted[to] = true;
            _mintOne(to);
        }
    }

    function _mintOne(address to) internal {
        _tokenId += 1;
        _safeMint(to, _tokenId);
    }

    // Non-transferable overrides
    function approve(address, uint256) public pure override {
        revert("SBT: non-transferable");
    }

    function setApprovalForAll(address, bool) public pure override {
        revert("SBT: non-transferable");
    }

    function transferFrom(address, address, uint256) public pure override {
        revert("SBT: non-transferable");
    }

    function safeTransferFrom(address, address, uint256) public pure override {
        revert("SBT: non-transferable");
    }

    function safeTransferFrom(address, address, uint256, bytes memory) public pure override {
        revert("SBT: non-transferable");
    }
}

