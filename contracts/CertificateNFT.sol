// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract CertificateNFT is ERC721, Ownable {
    uint256 private _tokenIds;
    
    // Certificate metadata structure
    struct Certificate {
        string ipfsHash;      // Hash of certificate data on IPFS
        address issuer;       // Address of certificate issuer
        string courseName;    // Name of the course/certification
        uint256 issuedDate;   // Timestamp when certificate was issued
    }
    
    // Mapping from token ID to Certificate data
    mapping(uint256 => Certificate) public certificates;
    
    // Mapping to track authorized issuers
    mapping(address => bool) public issuers;
    
    // Mapping to track authorized viewers for each certificate
    mapping(uint256 => mapping(address => bool)) public authorizedViewers;

    constructor() ERC721("CertificateNFT", "CERT") Ownable(msg.sender) {}

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

        // Automatically authorize the issuer and recipient to view the certificate
        authorizedViewers[newTokenId][msg.sender] = true;
        authorizedViewers[newTokenId][recipient] = true;

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
        
        // Check if the caller is authorized to view the certificate
        require(
            authorizedViewers[tokenId][msg.sender] || 
            msg.sender == _ownerOf(tokenId) || 
            msg.sender == certificates[tokenId].issuer,
            "Not authorized to view this certificate"
        );
        
        Certificate memory cert = certificates[tokenId];
        return (cert.ipfsHash, cert.issuer, cert.courseName, cert.issuedDate);
    }
    
    // Authorize a viewer to access a certificate
    function authorizeViewer(uint256 tokenId, address viewer) public {
        require(
            msg.sender == _ownerOf(tokenId) || 
            msg.sender == certificates[tokenId].issuer,
            "Only owner or issuer can authorize viewers"
        );
        authorizedViewers[tokenId][viewer] = true;
    }
    
    // Revoke viewer access to a certificate
    function revokeViewer(uint256 tokenId, address viewer) public {
        require(
            msg.sender == _ownerOf(tokenId) || 
            msg.sender == certificates[tokenId].issuer,
            "Only owner or issuer can revoke viewers"
        );
        
        // Ensure the owner and issuer always have access
        require(
            viewer != _ownerOf(tokenId) && 
            viewer != certificates[tokenId].issuer,
            "Cannot revoke access from owner or issuer"
        );
        
        authorizedViewers[tokenId][viewer] = false;
    }
    
    // Check if a viewer is authorized to access a certificate
    function isViewerAuthorized(uint256 tokenId, address viewer) public view returns (bool) {
        return authorizedViewers[tokenId][viewer] || 
               viewer == _ownerOf(tokenId) || 
               viewer == certificates[tokenId].issuer;
    }
} 