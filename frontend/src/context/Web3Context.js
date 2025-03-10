import React, { createContext, useState, useContext, useEffect } from 'react';
import { ethers } from 'ethers';
import CertificateNFT from '../contracts/CertificateNFT.json';

const Web3Context = createContext();

export function Web3Provider({ children }) {
    const [account, setAccount] = useState(null);
    const [contract, setContract] = useState(null);
    const [isIssuer, setIsIssuer] = useState(false);

    useEffect(() => {
        const init = async () => {
            if (window.ethereum) {
                try {
                    // Request account access
                    const accounts = await window.ethereum.request({
                        method: 'eth_requestAccounts'
                    });
                    setAccount(accounts[0]);

                    const provider = new ethers.providers.Web3Provider(window.ethereum);
                    const signer = provider.getSigner();
                    const contractInstance = new ethers.Contract(
                        process.env.REACT_APP_CONTRACT_ADDRESS,
                        CertificateNFT.abi,
                        signer
                    );
                    setContract(contractInstance);

                    // Check if user is an issuer
                    const issuerStatus = await contractInstance.issuers(accounts[0]);
                    setIsIssuer(issuerStatus);

                    // Listen for account changes
                    window.ethereum.on('accountsChanged', (newAccounts) => {
                        setAccount(newAccounts[0]);
                    });
                } catch (error) {
                    console.error("Error initializing web3:", error);
                }
            }
        };

        init();
    }, []);

    return (
        <Web3Context.Provider value={{ account, contract, isIssuer }}>
            {children}
        </Web3Context.Provider>
    );
}

export function useWeb3() {
    return useContext(Web3Context);
} 