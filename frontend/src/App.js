import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { createTheme } from '@mui/material/styles';
import Navigation from './components/Navigation';
import IssueCertificate from './components/IssueCertificate';
import VerifyCertificate from './components/VerifyCertificate';
import ViewCertificates from './components/ViewCertificates';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <div className="App">
          <Navigation />
          <Routes>
            <Route path="/" element={<IssueCertificate />} />
            <Route path="/issue" element={<IssueCertificate />} />
            <Route path="/verify" element={<VerifyCertificate />} />
            <Route path="/view" element={<ViewCertificates />} />
          </Routes>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
