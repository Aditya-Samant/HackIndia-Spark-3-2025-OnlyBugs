import React, { useState, useEffect } from 'react';
import { 
    Box, 
    Typography, 
    Grid, 
    Card, 
    CardContent, 
    Button, 
    Alert,
    CircularProgress,
    Link,
    Chip
} from '@mui/material';
import { useWeb3 } from '../context/Web3Context';

function ViewCertificates() {
    const { contract, account } = useWeb3();
    const [certificates, setCertificates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        loadCertificates();
    }, [account, contract]);

    const loadCertificates = async () => {
        if (!contract || !account) {
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            setError('');

            // Get balance of NFTs for current user
            const balance = await contract.balanceOf(account);
            const certs = [];

            // Fetch all certificates owned by user
            for (let i = 0; i < balance; i++) {
                const tokenId = await contract.tokenOfOwnerByIndex(account, i);
                const certData = await contract.getCertificate(tokenId);
                
                certs.push({
                    tokenId: tokenId.toString(),
                    ipfsHash: certData.ipfsHash,
                    issuer: certData.issuer,
                    courseName: certData.courseName,
                    issuedDate: new Date(certData.issuedDate.toNumber() * 1000).toLocaleDateString()
                });
            }

            setCertificates(certs);

        } catch (err) {
            console.error('Error:', err);
            setError(err.message || 'Failed to load certificates');
        } finally {
            setLoading(false);
        }
    };

    if (!account) {
        return (
            <Box sx={{ p: 3 }}>
                <Alert severity="info">
                    Please connect your wallet to view your certificates
                </Alert>
            </Box>
        );
    }

    if (loading) {
        return (
            <Box sx={{ p: 3, textAlign: 'center' }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>
                My Certificates
            </Typography>

            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}

            {certificates.length === 0 ? (
                <Alert severity="info">
                    You don't have any certificates yet
                </Alert>
            ) : (
                <Grid container spacing={3}>
                    {certificates.map((cert) => (
                        <Grid item xs={12} sm={6} md={4} key={cert.tokenId}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h6" gutterBottom>
                                        {cert.courseName}
                                    </Typography>

                                    <Box sx={{ mb: 1 }}>
                                        <Chip 
                                            label={`Token ID: ${cert.tokenId}`}
                                            size="small"
                                            sx={{ mb: 1 }}
                                        />
                                    </Box>

                                    <Typography variant="body2" color="text.secondary" gutterBottom>
                                        <strong>Issuer:</strong><br />
                                        {cert.issuer}
                                    </Typography>

                                    <Typography variant="body2" color="text.secondary" gutterBottom>
                                        <strong>Issue Date:</strong><br />
                                        {cert.issuedDate}
                                    </Typography>

                                    <Button 
                                        variant="outlined" 
                                        component={Link}
                                        href={`https://ipfs.io/ipfs/${cert.ipfsHash}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        sx={{ mt: 2 }}
                                        fullWidth
                                    >
                                        View Certificate
                                    </Button>

                                    <Button 
                                        variant="outlined" 
                                        component={Link}
                                        to={`/manage-access/${cert.tokenId}`}
                                        sx={{ mt: 1 }}
                                        fullWidth
                                    >
                                        Manage Access
                                    </Button>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}
        </Box>
    );
}

export default ViewCertificates; 