import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Box, TextField, Button, Typography, Modal, Backdrop } from '@mui/material';
import { styled } from '@mui/system';

const FormBox = styled(Box)({
  backgroundColor: '#897F8F',
  padding: '20px',
  borderRadius: '20px',
  width: '500px',
  textAlign: 'center',
  position: 'relative',
  zIndex: 1400,
});

const BackdropBlur = styled(Backdrop)({
  zIndex: 1300,
  backdropFilter: 'blur(10px)',
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
});

const ModalContainer = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  height: '100vh',
});

const CancelButton = styled(Button)({
  backgroundColor: '#36343A',
  color: '#fff',
  '&:hover': {
    backgroundColor: '#333',
  },
});

const SaveButton = styled(Button)({
  backgroundColor: '#5A83F2',
  color: '#fff',
  '&:hover': {
    backgroundColor: '#5A83F2',
  },
});

const StrongPasswordButton = styled(Button)({
  backgroundColor: '#A473CB',
  color: '#fff',
  marginBottom: '20px',
  '&:hover': {
    backgroundColor: '#A473CB',
  },
});

const EditPassword = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Retrieve the passed password data or set a default state
  const { password } = location.state || {};
  const [formData, setFormData] = useState(password || {
    website: '',
    username: '',
    password: '',
    note: '',
  });

  const [loading, setLoading] = useState(false); // Loading state for save operation
  const [error, setError] = useState(null); // Error state for save operation

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSave = async () => {
    const { website: url, username, password: newPassword, note } = formData;
    setLoading(true);
    setError(null);

    try {
      // Send the updated data to the backend
      const response = await window.ipc.invoke('update_password_entry', { username, url, newPassword, note }); // Need new function in back
      if (response.success) {
        navigate('/PasswordPage', { state: { password: formData } });
      } else {
        console.error('Failed to update password:', response.error);
        setError(response.error || 'Failed to update password. Please try again.');
      }
    } catch (error) {
      console.error('Error updating password:', error);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGeneratePassword = () => {
    // Making a strong password using simple algorithm
    const newPassword = Math.random().toString(36).slice(-12) + '!@#';
    setFormData({ ...formData, password: newPassword });
  };

  const handleCancel = () => {
    navigate('/ViewPassword');
  };

  return (
    <Modal
      open
      onClose={handleCancel}
      BackdropComponent={BackdropBlur}
      closeAfterTransition
    >
      <ModalContainer>
        <FormBox>
          <Typography variant="h5" sx={{ mb: 2, color: 'white' }}>
            Edit Password
          </Typography>

          {/* Website (Read-only hyperlink) */}
          <Typography variant="subtitle1" sx={{ mb: 2, color: '#FFFFFF' }}>
            Website: <a href={`https://${formData.website}`} target="_blank" rel="noopener noreferrer" style={{ color: '#FFFFFF' }}>
              {formData.website}
            </a>
          </Typography>

          {/* Display error message if any */}
          {error && (
            <Typography variant="body2" sx={{ color: 'red', mb: 2 }}>
              {error}
            </Typography>
          )}

          {/* Form Fields */}
          <TextField
            label="Username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            variant="outlined"
            fullWidth
            sx={{ backgroundColor: '#B39DDB', borderRadius: '15px', mb: 3 }}
          />
          <TextField
            label="Password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            variant="outlined"
            fullWidth
            sx={{ backgroundColor: '#B39DDB', borderRadius: '15px', mb: 3 }}
          />
          <TextField
            label="Note"
            name="note"
            value={formData.note}
            onChange={handleChange}
            variant="outlined"
            fullWidth
            sx={{ backgroundColor: '#B39DDB', borderRadius: '15px', mb: 3 }}
          />

          {/* Generate Strong Password Button */}
          <StrongPasswordButton onClick={handleGeneratePassword} disabled={loading}>
            Create Strong Password
          </StrongPasswordButton>

          <Box display="flex" justifyContent="space-between">
            <CancelButton variant="contained" onClick={handleCancel} disabled={loading}>
              Cancel
            </CancelButton>
            <SaveButton variant="contained" onClick={handleSave} disabled={loading}>
              {loading ? 'Saving...' : 'Save'}
            </SaveButton>
          </Box>
        </FormBox>
      </ModalContainer>
    </Modal>
  );
};

export default EditPassword;
