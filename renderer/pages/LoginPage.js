import { Box, Button, Container, Typography, Snackbar, Alert } from '@mui/material'
import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import { GradientBackground, StyledAvatar, StyledTextField } from '../components/Components.js'

export default function LoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  const handleUsernameChange = (event) => setUsername(event.target.value)
  const handlePasswordChange = (event) => setPassword(event.target.value)

  const handleLogin = async () => {
    if (username.trim() === '' || password.trim() === '') {
      setError('Username and password cannot be empty.')
      return
    }

    try {
      const response = await window.ipc.invoke('validate-login', username, password)
      const valid = response?.login

      if (valid) {
        navigate('/HomePage')
      } else {
        setError('Incorrect username or password.')
      }
    } catch (error) {
      console.error('Error logging in:', error)
      setError('An error occurred while logging in. Please try again.')
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
              width: '100%',
              borderRadius: '50px',
              backgroundColor: '#36343A'
            }}
          >
            Login
          </Button>
        </Box>
      </Container>
      {error && (
        <Snackbar open={true} autoHideDuration={6000} onClose={() => setError(null)}>
          <Alert onClose={() => setError(null)} severity="error">
            {error}
          </Alert>
        </Snackbar>
      )}
    </GradientBackground>
  )
}
