import React, { useState } from 'react';
import { AppBar, TextField, InputAdornment, IconButton, Drawer, List, ListItem, ListItemText, Box, Button, Typography, Toolbar } from '@mui/material';
import { Search, Lock, Security, Settings } from '@mui/icons-material';
import { styled } from '@mui/system';
import { useNavigate } from 'react-router-dom';
import DeleteAllPasswordsModal from './DeleteAllPasswordsModal';

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

const FormBox = styled(Box)({
  backgroundColor: '#564E5B',
  borderRadius: '20px',
  padding: '20px',
  maxWidth: '600px',
  margin: 'auto',
  marginTop: '100px',
});

const DeleteButton = styled(Button)({
  backgroundColor: '#5A83F2',
  color: '#fff',
  textTransform: 'none',
  borderRadius: '20px',
  padding: '10px 20px',
  '&:hover': {
    backgroundColor: '#476BB8',
  },
});

const SettingsPage = () => {
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const navigate = useNavigate();

  const handlePasswordsNavigation = () => navigate('/ViewPassword');
  const handleCheckupNavigation = () => navigate('/CheckupPage');
  const handleConfirmDelete = () => {
    // No function for deleting all data?
    console.log('Deleting all data...');
    setDeleteModalOpen(false);
  };

  return (
    <GradientBackground>
      <Sidebar variant="permanent" anchor="left">
        <Box sx={{ padding: 2 }}>
          <Typography variant="h5" sx={{ color: 'white', mb: 3 }}>
            Password Manager
          </Typography>
          <List>
            <ListItem button onClick={handlePasswordsNavigation}>
              <Lock sx={{ mr: 2, color: '#8B8B8B' }} />
              <ListItemText primary="Passwords" />
            </ListItem>
            <ListItem button onClick={handleCheckupNavigation}>
              <Security sx={{ mr: 2, color: '#8B8B8B' }} />
              <ListItemText primary="Checkup" />
            </ListItem>
            <ListItem button sx={{ backgroundColor: '#A472CB' }}>
              <Settings sx={{ mr: 2, color: '#FFFFFF' }} />
              <ListItemText primary="Settings" />
            </ListItem>
          </List>
        </Box>
      </Sidebar>
      <Box sx={{ flexGrow: 1, padding: '20px' }}>
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
              sx={{ backgroundColor: '#FFFFFFCC', borderRadius: '50px', width: '50%' }}
            />
          </Toolbar>
        </AppBar>
        <FormBox>
          <Typography variant="h5" sx={{ color: 'white', mb: 2 }}>
            Delete all Password Manager data
          </Typography>
          <Typography variant="body2" sx={{ color: '#DDDDDD', mb: 2 }}>
            Passwords and other data will be permanently deleted.
          </Typography>
          <DeleteButton onClick={() => setDeleteModalOpen(true)}>Delete Data</DeleteButton>
        </FormBox>
      </Box>
      <DeleteAllPasswordsModal
        isOpen={isDeleteModalOpen}
        handleCancel={() => setDeleteModalOpen(false)}
        handleConfirm={handleConfirmDelete}
      />
    </GradientBackground>
  );
};

export default SettingsPage;

