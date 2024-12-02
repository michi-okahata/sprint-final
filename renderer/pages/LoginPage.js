import { Box, Button, Container, Typography } from '@mui/material'
import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import { GradientBackground, StyledAvatar, StyledTextField } from '../components/Components.js'

export default function LoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  const handleUsernameChange = (event) => setUsername(event.target.value)
  const handlePasswordChange = (event) => setPassword(event.target.value)

  // Probably need useEffect and login/setLogin
  const handleLogin = async () => {
    if (username === '' || password === '') {
      alert('Incorrect username or password.')
      return
    }

    try {      
      const response = await window.ipc.invoke('validate-login', username, password)
      const valid = response?.login

      if (valid) {
        alert('In')
        navigate('/Dashboard')
      } else {
        alert('Incorrect username or password.')
        return
      }
    } catch (error) {
      console.error('Error logging in:', error)
      return
    }
  }

  return (
    <GradientBackground display="flex" justifyContent="center" alignItems="center">
      <Container maxWidth="sm">
        <Box display="flex" justifyContent="center" mb={4}>
          <StyledAvatar>
            <Typography variant="h1">👤</Typography>
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
            onClick={handleLogin}
            sx={{
              textTransform: 'none',
              height: '50px',
              width: '100px',
              borderRadius: '50px',
              backgroundColor: '#36343A'
            }}
          >
            Login
          </Button>
        </Box>
      </Container>
    </GradientBackground>
  )
}