import { Box, Button, Container, Typography } from '@mui/material'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { GradientBackground, StyledAvatar, StyledTextField } from '../components/Components.js'

// Need to figure out edge cases, no username after first check.

export default function SetUpPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  const handleUsernameChange = (event) => setUsername(event.target.value)
  const handlePasswordChange = (event) => setPassword(event.target.value)

  const handleSetUp = async () => {
    // Ensure username and password are non-empty
    if (username.trim() === "" || password.trim() === "") {
      alert("Username and password cannot be empty.")
      return
    }
  
    // Validate the username
    if (/\s/.test(username)) {
      alert("Username cannot contain spaces.")
      return
    }
  
    // Validate the password
    if (password.length <= 8 || !/\d/.test(password) || !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      alert("Password must be longer than 8 characters, include a number, and a special character.")
      return
    }
  
    try {
      // Invoke IPC method to test master password
      const response = await window.ipc.invoke('test-master-pass', username, password)
      console.log('Response from test-master-pass:', response)
  
      // Navigate to password page upon success
      navigate('/HomePage')
    } catch (error) {
      console.error('Error during setup:', error.message)
      alert("An error occurred while setting up your account. Please try again.")
    }
  }

  return (
    <GradientBackground display="flex" justifyContent="center" alignItems="center">
      <Container maxWidth="sm">
        <Box display="flex" justifyContent="center" mb={4}>
          <StyledAvatar>
            <Typography variant="h1">🔐</Typography>
          </StyledAvatar>
        </Box>
        <Box display="flex" flexDirection="column" alignItems="center" gap="20px">
          <StyledTextField
            variant="outlined"
            label="Username"
            value={username}
            onChange={handleUsernameChange}
            fullWidth
          />
          <StyledTextField
            variant="outlined"
            label="Master Password"
            type="password"
            value={password}
            onChange={handlePasswordChange}
            fullWidth
          />
          <Button 
            variant="contained" 
            color="primary" 
            onClick={handleSetUp}
            sx={{
              textTransform: 'none',
              height: '50px',
              borderRadius: '50px',
              backgroundColor: '#36343A'
            }}
          >
            Set Up Account
          </Button>
        </Box>
      </Container>
    </GradientBackground>
  )
}