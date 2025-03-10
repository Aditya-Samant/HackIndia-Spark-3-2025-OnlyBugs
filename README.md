# Certificate NFT System

## Overview
The Certificate NFT System is a decentralized application (dApp) that allows users to issue, verify, and view certificates as Non-Fungible Tokens (NFTs) on the Ethereum blockchain. The application leverages IPFS for storing certificate data and utilizes the Pinata service for file uploads.

## Project Flow

1. **User Registration**:
   - **Connect Wallet**: Users begin by connecting their Ethereum wallets (e.g., MetaMask) to the application. This allows them to interact with the Ethereum blockchain and manage their NFTs.
   - **Account Management**: Once connected, the application retrieves the user's Ethereum account address, which is used for issuing and verifying certificates.

2. **Issuing Certificates**:
   - **Authorized Issuers**: Only users designated as issuers (e.g., educators or organizations) can issue certificates. The owner of the smart contract (usually the admin) can set or remove issuers using the `setIssuer` function in the smart contract.
   - **Upload Certificate Files**: Authorized issuers can upload certificate files (typically in PDF format) through a user-friendly interface. The application uses a file input to allow issuers to select and upload their certificate files.
   - **Store Metadata on IPFS**: When a certificate is issued, the application uploads the certificate file to IPFS using the Pinata service. The IPFS hash (a unique identifier for the file) is then stored on the Ethereum blockchain as part of the NFT.
   - **Minting the NFT**: The smart contract mints a new NFT representing the certificate, associating it with the recipient's Ethereum address. The NFT contains metadata such as the IPFS hash, issuer address, course name, and issuance date.

3. **Verifying Certificates**:
   - **Input Token ID**: Users can verify the authenticity of a certificate by entering its token ID into the verification form.
   - **Fetch Certificate Details**: Upon submission, the application calls the smart contract's `getCertificate` function, which retrieves the certificate details from the blockchain, including the IPFS hash, issuer, course name, and issuance date.
   - **Display Certificate Information**: The application displays the retrieved certificate information to the user, allowing them to confirm its authenticity.

4. **Viewing Certificates**:
   - **List User's Certificates**: Users can view all certificates they own by accessing the "My Certificates" section of the application. The application queries the smart contract to get the balance of NFTs owned by the user.
   - **Fetch Certificate Data**: For each NFT owned, the application retrieves the corresponding certificate details from the blockchain and displays them in a user-friendly format.
   - **View Certificate on IPFS**: Users can click on a link to view the certificate file stored on IPFS, which opens the certificate in a new tab.

## Technologies Used
- **Solidity**: Smart contract development for the Ethereum blockchain.
- **Hardhat**: Development environment for compiling, deploying, and testing smart contracts.
- **Express.js**: Backend framework for handling API requests.
- **Multer**: Middleware for handling file uploads.
- **Pinata**: Service for uploading files to IPFS.
- **React**: Frontend framework for building the user interface.
- **Material-UI**: React components for building a responsive UI.
- **Ethers.js**: Library for interacting with the Ethereum blockchain.

## How to Run the Project

### Prerequisites
- Node.js (v14 or later)
- npm (Node package manager)
- An Ethereum wallet (e.g., MetaMask) for interacting with the dApp
- Pinata account for file uploads

### Setup Instructions

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/yourusername/certificate-nft-system.git
   cd certificate-nft-system
   ```

2. **Install Backend Dependencies**:
   Navigate to the backend directory and install the required packages:
   ```bash
   cd backend
   npm install
   ```

3. **Set Up Environment Variables**:
   Create a `.env` file in the `backend` directory and add your Pinata API key, secret, and JWT:
   ```plaintext
   PORT=5000
   PINATA_API_KEY=your_pinata_api_key
   PINATA_API_SECRET=your_pinata_api_secret
   PINATA_JWT=your_pinata_jwt
   ```

4. **Compile and Deploy Smart Contracts**:
   Navigate to the Hardhat directory and deploy the smart contracts:
   ```bash
   npx hardhat run scripts/deploy.js --network sepolia
   ```

5. **Start the Backend Server**:
   In the backend directory, start the server:
   ```bash
   npm start
   ```

6. **Install Frontend Dependencies**:
   Navigate to the frontend directory and install the required packages:
   ```bash
   cd ../frontend
   npm install
   ```

7. **Set Up Frontend Environment Variables**:
   Create a `.env` file in the `frontend` directory and add your contract address:
   ```plaintext
   REACT_APP_CONTRACT_ADDRESS=your_deployed_contract_address
   REACT_APP_BACKEND_URL=http://localhost:5000
   ```

8. **Start the Frontend Application**:
   In the frontend directory, start the React application:
   ```bash
   npm start
   ```

9. **Access the Application**:
   Open your browser and navigate to `http://localhost:3000` to access the Certificate NFT System.

## License
This project is licensed under the MIT License.
