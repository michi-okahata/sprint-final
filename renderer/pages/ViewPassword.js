import React, { useState, useEffect } from 'react'
import {
  AppBar,
  TextField,
  InputAdornment,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Box,
  Button,
  Fab,
  Typography,
  Toolbar,
} from '@mui/material'
import { Search, ArrowBack, Lock, Security, Settings, Visibility, VisibilityOff } from '@mui/icons-material'
import { styled } from '@mui/system'
import { useNavigate, useLocation } from 'react-router-dom'
import DeletePassword from './DeletePassword'

const GradientBackground = styled(Box)({
  height: '100vh',
  display: 'flex',
  background: 'linear-gradient(210deg, #A472CB, #5883F2)',
})

const Sidebar = styled(Drawer)({
  width: 240,
  '& .MuiDrawer-paper': {
    width: 240,
    backgroundColor: '#36343A',
    color: '#fff',
  },
})

const FormBox = styled(Box)({
  backgroundColor: '#564E5B',
  padding: '20px',
  borderRadius: '20px',
  maxWidth: '600px',
  margin: 'auto',
  marginTop: '100px',
})

const BackButton = styled(Fab)({
  backgroundColor: '#36343A',
  color: '#fff',
  borderRadius: '50px',
  position: 'absolute',
  top: '100px',
  left: '20px',
  '&:hover': {
    backgroundColor: '#333',
  },
})

const ActionButton = styled(Button)({
  color: '#fff',
  '&:hover': {
    backgroundColor: '#333',
  },
})

const ViewPassword = () => {
  const navigate = useNavigate()
  const location = useLocation()

  const [passwordEntry, setPasswordEntry] = useState(null)
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const username = location.state?.username
  const website = location.state?.website

  useEffect(() => {
    const fetchPasswordEntry = async () => {
      try {
        const response = await window.ipc.invoke('get_password', { username, website })
        if (response.success) {
          const { username: retrievedUsername, password, note } = response.data
          setPasswordEntry({ username: retrievedUsername, password, note, website })
        } else {
          console.error(response.error)
          alert('Failed to fetch password entry.')
        }
      } catch (error) {
        console.error('Error fetching password entry:', error)
        alert('An error occurred while fetching the password entry.')
      }
    }

    if (username && website) {
      fetchPasswordEntry()
    }
  }, [username, website])

  const handleBack = () => {
    navigate('/PasswordPage')
  }

  const handleEdit = () => {
    navigate('/EditPassword', { state: { passwordEntry } })
  }

  const handleDelete = () => {
    setDeleteModalOpen(true)
  }

  const handleCloseDeleteModal = () => {
    setDeleteModalOpen(false)
  }

  const handleConfirmDelete = async () => {
    try {
      const response = await window.ipc.invoke('delete_password', { username, website })
      if (response.success) {
        setDeleteModalOpen(false)
        navigate('/PasswordPage')
      } else {
        alert('Failed to delete password. Please try again.')
      }
    } catch (error) {
      console.error('Error deleting password:', error)
    }
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  return (
    <GradientBackground>
      <Sidebar variant="permanent" anchor="left">
        <Box sx={{ padding: 2 }}>
          <Typography variant="h5" sx={{ flexGrow: 1, color: 'white', mb: 3 }}>
            Password Manager
          </Typography>
          <List>
            <ListItem button sx={{ backgroundColor: '#A472CB' }}>
              <Lock sx={{ mr: 2, color: '#FFFFFF' }} />
              <ListItemText primary="Passwords" />
            </ListItem>
            <ListItem button>
              <Security sx={{ mr: 2, color: '#8B8B8B' }} />
              <ListItemText primary="Checkup" />
            </ListItem>
            <ListItem button>
              <Settings sx={{ mr: 2, color: '#8B8B8B' }} />
              <ListItemText primary="Settings" />
            </ListItem>
          </List>
        </Box>
      </Sidebar>

      <Box sx={{ flexGrow: 1, padding: '20px', position: 'relative' }}>
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

        <BackButton onClick={handleBack}>
          <ArrowBack />
          Back
        </BackButton>

        <FormBox>
          <Typography variant="h5" sx={{ mb: 3, color: 'white' }} align="center">
            {passwordEntry?.website || 'Website'}
          </Typography>
          <Box display="flex" flexDirection="column" gap={2}>
            <TextField
              label="Username"
              value={passwordEntry?.username || 'N/A'}
              variant="outlined"
              fullWidth
              InputProps={{ readOnly: true }}
              sx={{ backgroundColor: '#B39DDB', borderRadius: '5px' }}
            />
            <TextField
              label="Password"
              value={passwordEntry ? (showPassword ? passwordEntry.password : '********') : 'N/A'}
              variant="outlined"
              fullWidth
              InputProps={{
                readOnly: true,
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={togglePasswordVisibility}>
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{ backgroundColor: '#B39DDB', borderRadius: '5px' }}
            />
            <TextField
              label="Note"
              value={passwordEntry?.note || 'No notes added'}
              variant="outlined"
              fullWidth
              InputProps={{ readOnly: true }}
              sx={{ backgroundColor: '#B39DDB', borderRadius: '5px' }}
            />
          </Box>

          <Box display="flex" justifyContent="space-between" mt={3}>
            <ActionButton variant="contained" sx={{ backgroundColor: '#F44336' }} onClick={handleDelete}>
              Delete
            </ActionButton>
            <ActionButton variant="contained" sx={{ backgroundColor: '#5A83F2' }} onClick={handleEdit}>
              Edit
            </ActionButton>
          </Box>
        </FormBox>

        <DeletePassword
          isOpen={isDeleteModalOpen}
          onClose={handleCloseDeleteModal}
          onDelete={handleConfirmDelete}
          website={passwordEntry?.website}
        />
      </Box>
    </GradientBackground>
  )
}

export default ViewPassword
