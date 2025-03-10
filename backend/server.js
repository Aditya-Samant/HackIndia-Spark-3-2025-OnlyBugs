import express from 'express';
import cors from 'cors';
import multer from 'multer';
import { create } from 'ipfs-http-client';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();

const app = express();
const upload = multer({ storage: multer.memoryStorage() });

// IPFS client setup with explicit URL
const ipfs = create({
    host: process.env.IPFS_HOST,
    port: process.env.IPFS_PORT,
    protocol: process.env.IPFS_PROTOCOL
});

app.use(cors());
app.use(express.json());

// Upload certificate to IPFS
app.post('/api/upload', upload.single('certificate'), async (req, res) => {
    try {
        const file = req.file;
        const result = await ipfs.add(file.buffer);
        
        res.json({
            success: true,
            ipfsHash: result.path
        });
    } catch (error) {
        console.error('IPFS Error:', error);
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