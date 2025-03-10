# Certificate NFT System

## Overview
The Certificate NFT System is a decentralized application (dApp) that allows users to issue, verify, and view certificates as Non-Fungible Tokens (NFTs) on the Ethereum blockchain. The application leverages IPFS for storing certificate data and utilizes the Pinata service for file uploads.

## Project Flow
1. **User Registration**: Users connect their Ethereum wallets to the application.
2. **Issuing Certificates**: Authorized issuers can upload certificate files (PDFs) and issue certificates to recipients. The certificate data is stored on IPFS, and the IPFS hash is saved on the blockchain as an NFT.
3. **Verifying Certificates**: Users can verify the authenticity of certificates by entering the token ID. The application fetches the certificate details from the blockchain and displays them.
4. **Viewing Certificates**: Users can view all certificates they own, along with their details.

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
