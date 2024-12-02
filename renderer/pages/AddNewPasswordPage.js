import React, { useState } from 'react'
import { AppBar, TextField, InputAdornment, IconButton, Box, Button, Typography, Toolbar } from '@mui/material'
import { Search, ArrowBack } from '@mui/icons-material'
import { styled } from '@mui/system'
import { useNavigate } from 'react-router-dom'

const GradientBackground = styled(Box)({
  height: '100vh',
  display: 'flex',
  background: 'linear-gradient(210deg, #A472CB, #5883F2)',
})

const FormBox = styled(Box)({
  backgroundColor: '#564E5B',
  padding: '20px',
  borderRadius: '20px',
  maxWidth: '600px',
  margin: 'auto',
  marginTop: '100px',
})

const SaveButton = styled(Button)({
  backgroundColor: '#5A83F2',
  color: '#fff',
  '&:hover': {
    backgroundColor: '#5A83F2',
  },
})

const CancelButton = styled(Button)({
  backgroundColor: '#36343A',
  color: '#fff',
  '&:hover': {
    backgroundColor: '#333',
  },
})

const AddNewPasswordPage = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    website: '',
    note: '',
  })

  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleSave = async () => {
    const { username, password, website, note } = formData

    // Validation
    if (!username || !password || !website) {
      alert('All fields except note are required!')
      return
    }

    try {
      // Sending data to the backend
      const response = await window.ipc.invoke('add-password', { username, password, website, note })
      if (response.success) {
        alert('Password saved successfully!')
        navigate('/HomePage') // Navigate back to the homepage after saving
      } else {
        alert('Failed to save password. Please try again.')
      }
    } catch (error) {
      console.error('Error saving password:', error)
      alert('An error occurred while saving the password.')
    }
  }

  const handleCancel = () => {
    navigate('/HomePage') // Navigate back to the homepage
  }

  const handleBack = () => {
    // Navigate back to HomePage if no data is saved
    navigate('/HomePage');
  }

  return (
    <GradientBackground>
      {/* App Bar */}
      <AppBar position="static" sx={{ background: 'transparent', boxShadow: 'none' }}>
        <Toolbar>
          <IconButton onClick={() => navigate('/HomePage')} sx={{ color: '#fff' }}>
            <ArrowBack />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1, color: 'white' }}>
            Add New Password
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Form Section */}
      <FormBox>
        <Typography variant="h5" align="center" sx={{ color: 'white', mb: 3 }}>
          Add Password Details
        </Typography>
        <TextField
          label="Website"
          name="website"
          value={formData.website}
          onChange={handleChange}
          variant="outlined"
          fullWidth
          sx={{ mb: 2, backgroundColor: '#B39DDB', borderRadius: '5px' }}
        />
        <TextField
          label="Username"
          name="username"
          value={formData.username}
          onChange={handleChange}
          variant="outlined"
          fullWidth
          sx={{ mb: 2, backgroundColor: '#B39DDB', borderRadius: '5px' }}
        />
        <TextField
          label="Password"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          variant="outlined"
          fullWidth
          sx={{ mb: 2, backgroundColor: '#B39DDB', borderRadius: '5px' }}
        />
        <TextField
          label="Note (Optional)"
          name="note"
          value={formData.note}
          onChange={handleChange}
          variant="outlined"
          fullWidth
          sx={{ mb: 3, backgroundColor: '#B39DDB', borderRadius: '5px' }}
        />
        <Box display="flex" justifyContent="space-between">
          <CancelButton onClick={handleCancel} variant="contained">
            Cancel
          </CancelButton>
          <SaveButton onClick={handleSave} variant="contained">
            Save
          </SaveButton>
        </Box>
      </FormBox>
    </GradientBackground>
  )
}

export default AddNewPasswordPage
