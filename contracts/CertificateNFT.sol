// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract CertificateNFT is ERC721, ERC721Enumerable, Ownable {
    uint256 private _tokenIds;
    
    // Certificate metadata structure
    struct Certificate {
        string ipfsHash;      // Hash of certificate data on IPFS
        address issuer;       // Address of certificate issuer
        string courseName;    // Name of the course/certification
        uint256 issuedDate;  // Timestamp when certificate was issued
    }
    
    // Mapping from token ID to Certificate data
    mapping(uint256 => Certificate) public certificates;
    
    // Mapping to track authorized issuers
    mapping(address => bool) public issuers;

    constructor() ERC721("CertificateNFT", "CERT") Ownable(msg.sender) {}

    // Required overrides for ERC721Enumerable
    function _update(address to, uint256 tokenId, address auth)
        internal
        override(ERC721, ERC721Enumerable)
        returns (address)
    {
        return super._update(to, tokenId, auth);
    }

    function _increaseBalance(address account, uint128 value)
        internal
        override(ERC721, ERC721Enumerable)
    {
        super._increaseBalance(account, value);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721Enumerable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    // Add or remove issuers
    function setIssuer(address issuer, bool status) public onlyOwner {
        issuers[issuer] = status;
    }

    // Issue new certificate
    function issueCertificate(
        address recipient,
        string memory ipfsHash,
        string memory courseName
    ) public returns (uint256) {
        require(issuers[msg.sender], "Not authorized to issue certificates");
        
        _tokenIds++;
        uint256 newTokenId = _tokenIds;
        
        certificates[newTokenId] = Certificate({
            ipfsHash: ipfsHash,
            issuer: msg.sender,
            courseName: courseName,
            issuedDate: block.timestamp
        });

        _safeMint(recipient, newTokenId);
        
        return newTokenId;
    }

    // Get certificate details
    function getCertificate(uint256 tokenId) public view returns (
        string memory ipfsHash,
        address issuer,
        string memory courseName,
        uint256 issuedDate
    ) {
        require(_ownerOf(tokenId) != address(0), "Certificate does not exist");
        Certificate memory cert = certificates[tokenId];
        return (cert.ipfsHash, cert.issuer, cert.courseName, cert.issuedDate);
    }
} 