import React, { useState, useEffect } from 'react'
import { NavLink } from 'react-router-dom'
import styled from 'styled-components'
import { Button, Box, InputAdornment, TextField, Typography } from '@mui/material'

const FormBox = styled(Box)({
  backgroundColor: '#564E5B',
  padding: '20px',
  borderRadius: '20px',
  maxWidth: '898px',
  margin: 'auto',
  marginTop: '20px',
  height: 'auto',  
  minHeight: '260px', 
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

export default function AddPassword() {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    url: ''
  })

  // none of this is updating correctly.

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleSave = async () => {
    // try to pass formData?
    /*
    const testData = {
      username: 'mokahat',
      password: 'testpass123!A',
      url: 'michi.com'
    }
    */
    try {
      const response = await window.ipc.invoke('add-password', formData)
      const added = response?.message
      console.log(added)
      alert("Password added!")
      return
    } catch (error) {
      console.error('Error adding password:', error)
      return
    }
  }

  const [password, setPassword] = useState('')
  const [strength, setStrength] = useState(0)
  const [recommend, setRecommend] = useState('Recommendations')

  const handlePasswordChange = (event) => {
    setPassword(event.target.value)
    checkStrength(event.target.value)
    checkRecommend(event.target.value)
    handleChange(event)
  };

  const checkLength = (password) => password.length >= 8
  const checkUppercase = (password) => /[A-Z]/.test(password)
  const checkLowercase = (password) => /[a-z]/.test(password)
  const checkNumbers = (password) => /\d/.test(password)
  const checkSpecialChars = (password) => /[!@#$%^&*(),.?":{}|<>]/.test(password)

  const checkStrength = (password) => {
    let s = 0
    if (checkLength(password)) s += 1
    if (checkUppercase(password)) s += 1
    if (checkLowercase(password)) s += 1
    if (checkNumbers(password)) s += 1
    if (checkSpecialChars(password)) s += 1
    setStrength(s / 6)
  };

  const checkRecommend = (password) => {
    if (!checkLength(password)) setRecommend('At least 8 characters')
    else if (!checkUppercase(password)) setRecommend('Add uppercase')
    else if (!checkLowercase(password)) setRecommend('Add lowercase')
    else if (!checkNumbers(password)) setRecommend('Add numbers')
    else if (!checkSpecialChars(password)) setRecommend('Add special characters')
    else setRecommend('Secure!')
  }

  // Back button?

  {/* Form Section */}
  return (
    <FormBox>
      <Typography variant="h6" sx={{ mb: 3, color: 'white' }} align="center">
        Add New Password
      </Typography>
      <Box display="flex" gap={3} mb={3}>
        <TextField
          label="Username"
          name="username"
          value={formData.username}
          onChange={handleChange}
          variant="outlined"
          fullWidth
          sx={{ backgroundColor: '#B39DDB', borderRadius: '15px' }}
        />
        <TextField
          label="Website"
          name="url"
          value={formData.url}
          onChange={handleChange}
          variant="outlined"
          fullWidth
          sx={{ backgroundColor: '#B39DDB', borderRadius: '15px' }}
        />
      </Box>
      <Box display="flex" gap={3} mb={3}>
        <TextField
          label="Password"
          name="password"
          type="password"
          value={formData.password}
          onChange={handlePasswordChange}
          variant="outlined"
          fullWidth
          sx={{ 
            background: (strength == 0) ? 
                '#B39DDB':
                `linear-gradient(to right, #5883F2 ${strength * 100 - 20}%, #B39DDB ${strength * 100 + 20}%)`,
            borderRadius: '15px',
          }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                  <span>{(strength == 0) ? '' : recommend}</span>
              </InputAdornment>
            )
          }}
        />
      </Box>
      <Box display="flex" justifyContent="space-between">
        <NavLink to="/Dashboard">
          <CancelButton 
            variant="contained"
            sx={{
              color: 'white',
              textTransform: 'none',
              borderRadius: '50px'
            }}
          >
            Cancel
          </CancelButton>
        </NavLink>
        <SaveButton 
          variant="contained"
          sx={{
            textTransform: 'none',
            borderRadius: '50px'
          }}
          onClick={handleSave}
        >
          Save
        </SaveButton>
      </Box>
    </FormBox>
  )
}