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
        if (!response.IpfsHash) {
            throw new Error('Failed to upload to Pinata');
        }

        console.log("Pinata Upload Successful. Hash:", response.IpfsHash);
        return response.IpfsHash; // Return the CID
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

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
}); 