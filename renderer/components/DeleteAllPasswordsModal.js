import React from 'react';
import { Box, Button, Typography, Modal, Backdrop } from '@mui/material';
import { styled } from '@mui/system';

const ModalBox = styled(Box)({
  backgroundColor: '#564E5B',
  padding: '20px',
  borderRadius: '20px',
  textAlign: 'center',
  width: '400px',
  margin: 'auto',
});

const BackdropBlur = styled(Backdrop)({
  backdropFilter: 'blur(10px)',
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
});

const DeleteButton = styled(Button)({
  backgroundColor: '#E53935',
  color: '#fff',
  marginTop: '20px',
  '&:hover': {
    backgroundColor: '#D32F2F',
  },
});

const CancelButton = styled(Button)({
  backgroundColor: '#424242',
  color: '#fff',
  marginTop: '20px',
  '&:hover': {
    backgroundColor: '#333',
  },
});

const DeleteAllPasswordsModal = ({ isOpen, onClose }) => {
  const handleDelete = async () => {
    try {
      const response = await window.ipc.invoke('delete_all_passwords'); // Need function in back
      if (response.success) {
        alert('All data deleted successfully.');
        onClose();
      } else {
        alert('Failed to delete data.');
      }
    } catch (error) {
      console.error('Error deleting all passwords:', error);
      alert('An error occurred while deleting the data.');
    }
  };

  return (
    <Modal open={isOpen} onClose={onClose} closeAfterTransition BackdropComponent={BackdropBlur}>
      <ModalBox>
        <Typography variant="h6" color="white">
          Are you sure you want to delete all data?
        </Typography>
        <Box mt={2}>
          <CancelButton onClick={onClose}>Cancel</CancelButton>
          <DeleteButton onClick={handleDelete}>Delete All</DeleteButton>
        </Box>
      </ModalBox>
    </Modal>
  );
};

export default DeleteAllPasswordsModal;
