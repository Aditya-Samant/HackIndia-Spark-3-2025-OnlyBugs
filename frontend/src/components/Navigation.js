import React from 'react';
import { AppBar, Toolbar, Button, Typography, Box, Chip } from '@mui/material';
import { Link } from 'react-router-dom';
import { useWeb3 } from '../context/Web3Context';

function Navigation() {
    const { account, isIssuer } = useWeb3();

    return (
        <AppBar position="static">
            <Toolbar>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    Certificate System
                </Typography>

                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                    {isIssuer && (
                        <Button 
                            color="inherit" 
                            component={Link} 
                            to="/issue"
                        >
                            Issue Certificate
                        </Button>
                    )}
                    
                    <Button 
                        color="inherit" 
                        component={Link} 
                        to="/verify"
                    >
                        Verify Certificate
                    </Button>
                    
                    <Button 
                        color="inherit" 
                        component={Link} 
                        to="/view"
                    >
                        My Certificates
                    </Button>

                    <Chip
                        label={account ? 
                            `${account.slice(0, 6)}...${account.slice(-4)}` : 
                            'Not Connected'
                        }
                        color={account ? "success" : "default"}
                        variant="outlined"
                        sx={{ 
                            color: 'white',
                            borderColor: 'white',
                            '& .MuiChip-label': {
                                color: 'white'
                            }
                        }}
                    />
                </Box>
            </Toolbar>
        </AppBar>
    );
}

export default Navigation; 