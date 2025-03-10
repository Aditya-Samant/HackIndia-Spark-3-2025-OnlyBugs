import React, { useState } from 'react';
import { 
    Box, 
    TextField, 
    Button, 
    Typography, 
    Paper,
    Alert,
    CircularProgress,
    Card,
    CardContent,
    Link
} from '@mui/material';
import { useWeb3 } from '../context/Web3Context';

function VerifyCertificate() {
    const { contract } = useWeb3();
    const [tokenId, setTokenId] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [certificate, setCertificate] = useState(null);

    const handleVerify = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setCertificate(null);

        try {
            if (!contract) {
                throw new Error("Please connect your wallet");
            }

            // Get certificate details from blockchain
            const certData = await contract.getCertificate(tokenId);
            
            // Format the certificate data
            const formattedCert = {
                ipfsHash: certData.ipfsHash,
                issuer: certData.issuer,
                courseName: certData.courseName,
                issuedDate: new Date(certData.issuedDate.toNumber() * 1000).toLocaleDateString(),
            };

            setCertificate(formattedCert);

        } catch (err) {
            console.error('Error:', err);
            setError(err.message || 'Failed to verify certificate');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ p: 3, maxWidth: 600, mx: 'auto' }}>
            <Paper sx={{ p: 3, mb: 3 }}>
                <Typography variant="h5" gutterBottom>
                    Verify Certificate
                </Typography>

                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                )}

                <form onSubmit={handleVerify}>
                    <TextField
                        fullWidth
                        label="Certificate Token ID"
                        value={tokenId}
                        onChange={(e) => setTokenId(e.target.value)}
                        margin="normal"
                        required
                        type="number"
                    />

                    <Button
                        type="submit"
                        variant="contained"
                        fullWidth
                        disabled={loading || !tokenId}
                        sx={{ mt: 2 }}
                    >
                        {loading ? (
                            <CircularProgress size={24} color="inherit" />
                        ) : (
                            'Verify Certificate'
                        )}
                    </Button>
                </form>
            </Paper>

            {certificate && (
                <Card>
                    <CardContent>
                        <Typography variant="h6" gutterBottom>
                            Certificate Details
                        </Typography>
                        
                        <Typography variant="body1" gutterBottom>
                            <strong>Course Name:</strong> {certificate.courseName}
                        </Typography>
                        
                        <Typography variant="body1" gutterBottom>
                            <strong>Issuer:</strong> {certificate.issuer}
                        </Typography>
                        
                        <Typography variant="body1" gutterBottom>
                            <strong>Issue Date:</strong> {certificate.issuedDate}
                        </Typography>
                        
                        <Typography variant="body1" gutterBottom>
                            <strong>IPFS Hash:</strong> {certificate.ipfsHash}
                        </Typography>

                        <Button 
                            variant="outlined" 
                            component={Link}
                            href={`https://ipfs.io/ipfs/${certificate.ipfsHash}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            sx={{ mt: 2 }}
                            fullWidth
                        >
                            View Certificate
                        </Button>
                    </CardContent>
                </Card>
            )}
        </Box>
    );
}

export default VerifyCertificate; 