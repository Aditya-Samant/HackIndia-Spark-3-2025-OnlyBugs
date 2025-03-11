import React, { useState, useEffect } from 'react';
import { 
    Box, 
    TextField, 
    Button, 
    Typography, 
    Paper,
    Alert,
    CircularProgress,
    List,
    ListItem,
    ListItemText,
    IconButton,
    Divider
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useWeb3 } from '../context/Web3Context';

function ManageAccess({ tokenId }) {
    const { contract, account } = useWeb3();
    const [viewerAddress, setViewerAddress] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [authorizedViewers, setAuthorizedViewers] = useState([]);
    const [isOwnerOrIssuer, setIsOwnerOrIssuer] = useState(false);

    useEffect(() => {
        if (contract && tokenId) {
            checkOwnerOrIssuer();
        }
    }, [contract, tokenId, account]);

    const checkOwnerOrIssuer = async () => {
        try {
            const owner = await contract.ownerOf(tokenId);
            const certData = await contract.getCertificate(tokenId);
            
            setIsOwnerOrIssuer(
                account.toLowerCase() === owner.toLowerCase() || 
                account.toLowerCase() === certData.issuer.toLowerCase()
            );
        } catch (error) {
            console.error("Error checking owner or issuer:", error);
            setError("Failed to check if you are the owner or issuer of this certificate.");
        }
    };

    const handleAuthorize = async () => {
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            if (!contract) {
                throw new Error("Please connect your wallet");
            }

            if (!isOwnerOrIssuer) {
                throw new Error("Only the owner or issuer can authorize viewers");
            }

            const tx = await contract.authorizeViewer(tokenId, viewerAddress);
            await tx.wait();
            
            setSuccess(`Viewer ${viewerAddress} authorized successfully.`);
            setViewerAddress('');
            
            // Refresh the list of authorized viewers
            // This would require a function to fetch all authorized viewers
            // which is not directly available in the current contract
            
        } catch (err) {
            console.error('Error:', err);
            setError(err.message || 'Failed to authorize viewer');
        } finally {
            setLoading(false);
        }
    };

    const handleRevoke = async (viewer) => {
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            if (!contract) {
                throw new Error("Please connect your wallet");
            }

            if (!isOwnerOrIssuer) {
                throw new Error("Only the owner or issuer can revoke viewers");
            }

            const tx = await contract.revokeViewer(tokenId, viewer);
            await tx.wait();
            
            setSuccess(`Viewer ${viewer} revoked successfully.`);
            
            // Refresh the list of authorized viewers
            // This would require a function to fetch all authorized viewers
            // which is not directly available in the current contract
            
        } catch (err) {
            console.error('Error:', err);
            setError(err.message || 'Failed to revoke viewer');
        } finally {
            setLoading(false);
        }
    };

    if (!isOwnerOrIssuer) {
        return (
            <Box sx={{ p: 3 }}>
                <Alert severity="info">
                    You must be the owner or issuer of this certificate to manage access.
                </Alert>
            </Box>
        );
    }

    return (
        <Box sx={{ p: 3, maxWidth: 600, mx: 'auto' }}>
            <Paper sx={{ p: 3 }}>
                <Typography variant="h5" gutterBottom>
                    Manage Access for Certificate #{tokenId}
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

                <Box sx={{ mb: 3 }}>
                    <TextField
                        fullWidth
                        label="Viewer Address"
                        value={viewerAddress}
                        onChange={(e) => setViewerAddress(e.target.value)}
                        margin="normal"
                        required
                    />

                    <Button
                        variant="contained"
                        onClick={handleAuthorize}
                        disabled={loading || !viewerAddress}
                        sx={{ mt: 2 }}
                    >
                        {loading ? (
                            <CircularProgress size={24} color="inherit" />
                        ) : (
                            'Authorize Viewer'
                        )}
                    </Button>
                </Box>

                <Divider sx={{ my: 3 }} />

                <Typography variant="h6" gutterBottom>
                    Authorized Viewers
                </Typography>

                {authorizedViewers.length === 0 ? (
                    <Alert severity="info">
                        No additional viewers authorized for this certificate.
                    </Alert>
                ) : (
                    <List>
                        {authorizedViewers.map((viewer) => (
                            <ListItem
                                key={viewer}
                                secondaryAction={
                                    <IconButton 
                                        edge="end" 
                                        aria-label="delete"
                                        onClick={() => handleRevoke(viewer)}
                                        disabled={loading}
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                }
                            >
                                <ListItemText primary={viewer} />
                            </ListItem>
                        ))}
                    </List>
                )}
            </Paper>
        </Box>
    );
}

export default ManageAccess; 