import React, { useState } from 'react';
import { 
    Box, 
    TextField, 
    Button, 
    Typography, 
    Paper,
    Alert,
    CircularProgress
} from '@mui/material';
import { useWeb3 } from '../context/Web3Context';

function IssueCertificate() {
    const { contract, account, isIssuer } = useWeb3();
    const [formData, setFormData] = useState({
        recipientAddress: '',
        courseName: '',
        certificateFile: null
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleFileChange = (event) => {
        setFormData({
            ...formData,
            certificateFile: event.target.files[0]
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            if (!contract || !account) {
                throw new Error("Please connect your wallet");
            }

            if (!isIssuer) {
                throw new Error("Not authorized to issue certificates");
            }

            // Upload file to IPFS through backend
            const formDataForUpload = new FormData();
            formDataForUpload.append('certificate', formData.certificateFile);

            const response = await fetch('http://localhost:5000/api/upload', {
                method: 'POST',
                body: formDataForUpload
            });

            const data = await response.json();
            if (!data.success) {
                throw new Error(data.error || 'Failed to upload to IPFS');
            }

            // Add console logs for debugging
            console.log('IPFS Hash:', data.ipfsHash);
            console.log('Recipient:', formData.recipientAddress);
            console.log('Course Name:', formData.courseName);

            // Ensure all parameters are strings and not undefined
            const ipfsHash = data.ipfsHash || '';
            const recipientAddress = formData.recipientAddress || '';
            const courseName = formData.courseName || '';

            // Issue certificate on blockchain
            const tx = await contract.issueCertificate(
                recipientAddress,
                ipfsHash,
                courseName
            );

            await tx.wait();
            
            setSuccess('Certificate issued successfully!');
            setFormData({
                recipientAddress: '',
                courseName: '',
                certificateFile: null
            });

        } catch (err) {
            console.error('Error:', err);
            setError(err.message || 'Failed to issue certificate');
        } finally {
            setLoading(false);
        }
    };

    if (!isIssuer) {
        return (
            <Box sx={{ p: 3 }}>
                <Alert severity="error">
                    You are not authorized to issue certificates
                </Alert>
            </Box>
        );
    }

    return (
        <Box sx={{ p: 3, maxWidth: 600, mx: 'auto' }}>
            <Paper sx={{ p: 3 }}>
                <Typography variant="h5" gutterBottom>
                    Issue New Certificate
                </Typography>

                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                )}

                {success && (
                    <Alert severity="success" sx={{ mb: 2 }}>
                        {success}
                    </Alert>
                )}

                <form onSubmit={handleSubmit}>
                    <TextField
                        fullWidth
                        label="Recipient Address"
                        value={formData.recipientAddress}
                        onChange={(e) => setFormData({
                            ...formData,
                            recipientAddress: e.target.value
                        })}
                        margin="normal"
                        required
                    />

                    <TextField
                        fullWidth
                        label="Course Name"
                        value={formData.courseName}
                        onChange={(e) => setFormData({
                            ...formData,
                            courseName: e.target.value
                        })}
                        margin="normal"
                        required
                    />

                    <Box sx={{ my: 2 }}>
                        <input
                            accept="image/*,application/pdf"
                            style={{ display: 'none' }}
                            id="certificate-file"
                            type="file"
                            onChange={handleFileChange}
                        />
                        <label htmlFor="certificate-file">
                            <Button
                                variant="outlined"
                                component="span"
                                fullWidth
                            >
                                Upload Certificate File
                            </Button>
                        </label>
                        {formData.certificateFile && (
                            <Typography variant="body2" sx={{ mt: 1 }}>
                                Selected: {formData.certificateFile.name}
                            </Typography>
                        )}
                    </Box>

                    <Button
                        type="submit"
                        variant="contained"
                        fullWidth
                        disabled={loading || !formData.certificateFile}
                        sx={{ mt: 2 }}
                    >
                        {loading ? (
                            <CircularProgress size={24} color="inherit" />
                        ) : (
                            'Issue Certificate'
                        )}
                    </Button>
                </form>
            </Paper>
        </Box>
    );
}

export default IssueCertificate; 