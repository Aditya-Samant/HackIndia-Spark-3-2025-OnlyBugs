import express from 'express';
import cors from 'cors';
import multer from 'multer';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import fetch from 'node-fetch'; // Import fetch for making HTTP requests
import FormData from 'form-data'; // Import FormData for creating form data
import fs from 'fs'; // Import fs for file system operations

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();

const app = express();
const upload = multer({ storage: multer.memoryStorage() });

const JWT = process.env.PINATA_JWT; // Use your Pinata JWT

app.use(cors());
app.use(express.json());

// Function to upload to Pinata
const uploadToPinata = async (fileBuffer, fileName) => {
    try {
        const formData = new FormData();
        formData.append("file", fileBuffer, {
            filename: fileName,
            contentType: 'application/pdf',
        });

        console.log('File Buffer Size:', fileBuffer.length); // Log the size of the buffer

        const request = await fetch("https://uploads.pinata.cloud/v3/files", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${JWT}`,
            },
            body: formData,
        });

        const response = await request.json();
        console.log("Pinata Response:", response); // Log the entire response

        // Check for the correct field in the response
        if (!response.data || !response.data.cid) {
            throw new Error('Failed to upload to Pinata');
        }

        const ipfsHash = response.data.cid; // Use the CID from the response
        console.log("Pinata Upload Successful. Hash:", ipfsHash);
        return ipfsHash; // Return the CID
    } catch (error) {
        console.error("Pinata Upload Error:", error);
        throw new Error('Pinata upload failed');
    }
};

// Upload certificate to IPFS
app.post('/api/upload', upload.single('certificate'), async (req, res) => {
    try {
        const file = req.file;
        if (!file) {
            return res.status(400).json({
                success: false,
                error: 'No file uploaded'
            });
        }

        console.log('Uploading file:', file.originalname); // Debug log

        const ipfsHash = await uploadToPinata(file.buffer, file.originalname); // Use Pinata upload
        res.json({
            success: true,
            ipfsHash: ipfsHash
        });
    } catch (error) {
        console.error('Upload Error:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// New endpoint to fetch certificate file from IPFS
app.get('/api/certificate/:ipfsHash', async (req, res) => {
    try {
        const { ipfsHash } = req.params;
        
        // Fetch the file from Pinata's gateway
        const response = await fetch(`https://gateway.pinata.cloud/ipfs/${ipfsHash}`, {
            headers: {
                Authorization: `Bearer ${JWT}`,
            },
        });
        
        if (!response.ok) {
            throw new Error('Failed to fetch certificate from IPFS');
        }
        
        // Get the content type from the response
        const contentType = response.headers.get('content-type');
        
        // Set the appropriate content type for the response
        res.setHeader('Content-Type', contentType || 'application/pdf');
        
        // Pipe the response to the client
        response.body.pipe(res);
    } catch (error) {
        console.error('Fetch Error:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
}); 