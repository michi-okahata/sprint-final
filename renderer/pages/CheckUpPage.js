import React, { useState, useEffect } from 'react';
import {
  AppBar,
  Box,
  Button,
  IconButton,
  InputAdornment,
  List,
  ListItem,
  ListItemText,
  TextField,
  Toolbar,
  Typography,
  Drawer,
} from '@mui/material';
import { Search, Security, Settings, Cached, CheckCircle } from '@mui/icons-material';
import { styled } from '@mui/system';
import { useNavigate } from 'react-router-dom';

const GradientBackground = styled(Box)({
  height: '100vh',
  display: 'flex',
  background: 'linear-gradient(210deg, #A472CB, #5883F2)',
});

const Sidebar = styled(Drawer)({
  width: 240,
  '& .MuiDrawer-paper': {
    width: 240,
    backgroundColor: '#36343A',
    color: '#fff',
  },
});

const CheckupBox = styled(Box)({
  backgroundColor: '#564E5B',
  borderRadius: '20px',
  padding: '20px',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '20px',
});

const CheckupPage = () => {
  const [passwordData, setPasswordData] = useState({
    total: 0,
    reused: 0,
    weak: 0,
  });
  const [lastChecked, setLastChecked] = useState('Never');
  const navigate = useNavigate();

  // Fetch password data from backend
  const fetchCheckupData = async () => {
    try {
      // Call to backend
      const response = await fetch('/api/checkup'); // Function needed in backend (count total passwords, reused, weak)
      const data = await response.json();

      if (response.ok) {
        setPasswordData({
          total: data.total || 0,
          reused: data.reused || 0,
          weak: data.weak || 0,
        });
        setLastChecked(new Date().toLocaleString()); // Set last checked to current time
      } else {
        console.error('Failed to fetch password checkup data.');
      }
    } catch (error) {
      console.error('Error fetching password checkup data:', error);
    }
  };

  useEffect(() => {
    fetchCheckupData(); // Fetch data on initial load
  }, []);

  const handleReusedPasswords = () => navigate('/CheckupUniquePage');
  const handleWeakPasswords = () => navigate('/CheckupStrengthPage');

  return (
    <GradientBackground>
      {/* Sidebar */}
      <Sidebar variant="permanent" anchor="left">
        <Box sx={{ padding: 2 }}>
          <Typography variant="h5" sx={{ color: 'white', mb: 3 }}>
            Password Manager
          </Typography>
          <List>
            <ListItem button>
              <Security sx={{ mr: 2, color: '#8B8B8B' }} />
              <ListItemText primary="Passwords" />
            </ListItem>
            <ListItem button sx={{ backgroundColor: '#A472CB' }}>
              <Security sx={{ mr: 2, color: '#FFFFFF' }} />
              <ListItemText primary="Checkup" />
            </ListItem>
            <ListItem button onClick={() => navigate('/Settings')}>
              <Settings sx={{ mr: 2, color: '#8B8B8B' }} />
              <ListItemText primary="Settings" />
            </ListItem>
          </List>
        </Box>
      </Sidebar>

      {/* Main Content */}
      <Box sx={{ flexGrow: 1, padding: '20px' }}>
        {/* Search Bar */}
        <AppBar position="static" sx={{ background: 'transparent', boxShadow: 'none' }}>
          <Toolbar>
            <TextField
              variant="outlined"
              placeholder="Search passwords"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton>
                      <Search />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{
                backgroundColor: '#FFFFFFCC',
                borderRadius: '50px',
                width: '50%',
              }}
            />
          </Toolbar>
        </AppBar>

        {/* Checkup Information */}
        <Typography variant="h4" sx={{ mt: 3, mb: 3, color: 'white' }}>
          Password Checkup
        </Typography>

        {/* Total Checked Passwords */}
        <CheckupBox>
          <Box>
            <Typography variant="h6" sx={{ color: 'white' }}>
              Checked passwords for {passwordData.total} sites
            </Typography>
            <Typography variant="body2" sx={{ color: '#DDDDDD' }}>
              Last checked: {lastChecked}
            </Typography>
          </Box>
          <IconButton onClick={fetchCheckupData}>
            <Cached sx={{ color: '#FFFFFF' }} />
          </IconButton>
        </CheckupBox>

        {/* Reused Passwords */}
        <CheckupBox onClick={handleReusedPasswords} sx={{ cursor: 'pointer' }}>
          <Box>
            <Typography variant="h6" sx={{ color: 'white' }}>
              {passwordData.reused > 0 ? `${passwordData.reused} reused passwords` : 'Your passwords are unique'}
            </Typography>
            <Typography variant="body2" sx={{ color: '#DDDDDD' }}>
              {passwordData.reused > 0
                ? 'Create unique passwords'
                : "You're not reusing any passwords"}
            </Typography>
          </Box>
          <CheckCircle sx={{ color: passwordData.reused > 0 ? '#F39C12' : '#27AE60' }} />
        </CheckupBox>

        {/* Weak Passwords */}
        <CheckupBox onClick={handleWeakPasswords} sx={{ cursor: 'pointer' }}>
          <Box>
            <Typography variant="h6" sx={{ color: 'white' }}>
              {passwordData.weak > 0 ? `${passwordData.weak} weak passwords` : 'Your passwords look strong'}
            </Typography>
            <Typography variant="body2" sx={{ color: '#DDDDDD' }}>
              {passwordData.weak > 0
                ? 'Create strong passwords'
                : "You're using passwords that look hard to guess"}
            </Typography>
          </Box>
          <CheckCircle sx={{ color: passwordData.weak > 0 ? '#F39C12' : '#27AE60' }} />
        </CheckupBox>
      </Box>
    </GradientBackground>
  );
};

export default CheckupPage;

