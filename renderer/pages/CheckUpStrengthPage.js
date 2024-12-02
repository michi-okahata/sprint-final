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
  Typography,
  Toolbar,
} from '@mui/material'
import { Search, Lock, Security, Settings, CloseFullscreen } from '@mui/icons-material'
import { styled } from '@mui/system'
import { useNavigate } from 'react-router-dom'

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
  maxWidth: '898px',
  margin: 'auto',
  marginTop: '20px',
})

const CheckupButton = styled(Button)({
  backgroundColor: '#8B8B8B',
  color: '#fff',
  textTransform: 'none',
  borderRadius: '50px',
  padding: '10px 30px',
  minHeight: '60px',
  '&:hover': {
    backgroundColor: 'red',
  },
})

const CheckupStrengthPage = () => {
  const navigate = useNavigate()
  const [passwordIssues, setPasswordIssues] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Fetch passwords with strength issues from the backend
    const fetchWeakPasswords = async () => {
      try {
        const response = await window.ipc.invoke('fetch_weak_passwords') // function needed in back
        if (response.success) {
          setPasswordIssues(response.weakPasswords || [])
        } else {
          console.error('Failed to fetch weak passwords:', response.error)
        }
      } catch (error) {
        console.error('Error fetching weak passwords:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchWeakPasswords()
  }, [])

  const handlePassword = () => {
    navigate('/ViewPassword')
  }

  const handleCheckup = () => {
    navigate('/CheckupPage')
  }

  const handleSettings = () => {
    navigate('/SettingsPage')
  }

  return (
    <GradientBackground>
      {/* Sidebar Navigation */}
      <Sidebar variant="permanent" anchor="left">
        <Box sx={{ padding: 2 }}>
          <Typography variant="h5" sx={{ flexGrow: 1, color: 'white', mb: 3 }}>
            Password Manager
          </Typography>
          <List>
            <ListItem button onClick={handlePassword}>
              <Lock sx={{ mr: 2, color: '#8B8B8B' }} />
              <ListItemText primary="Passwords" />
            </ListItem>
            <ListItem button onClick={handleCheckup} sx={{ backgroundColor: '#A472CB' }}>
              <Security sx={{ mr: 2, color: '#FFFFFF' }} />
              <ListItemText primary="Checkup" />
            </ListItem>
            <ListItem button onClick={handleSettings}>
              <Settings sx={{ mr: 2, color: '#8B8B8B' }} />
              <ListItemText primary="Settings" />
            </ListItem>
          </List>
        </Box>
      </Sidebar>

      {/* Main Content */}
      <Box sx={{ flexGrow: 1, padding: '20px', position: 'relative' }}>
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

        {/* Password Strength Issues */}
        <FormBox>
          <Typography variant="h5" sx={{ mb: 3, color: 'white' }} align="center">
            Password Strength Issues
          </Typography>
          {isLoading ? (
            <Typography variant="h6" sx={{ color: '#DDDDDD' }} align="center">
              Loading...
            </Typography>
          ) : passwordIssues.length > 0 ? (
            passwordIssues.map((issue, index) => (
              <Box
                key={index}
                sx={{
                  backgroundColor: '#CFC4FE',
                  borderRadius: '15px',
                  padding: '10px 20px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  mb: 2,
                }}
              >
                <Typography variant="h6">{issue.website}</Typography>
                <Typography variant="body1">{issue.recommendation}</Typography>
              </Box>
            ))
          ) : (
            <Typography variant="h6" sx={{ color: '#DDDDDD' }} align="center">
              All passwords are strong!
            </Typography>
          )}
        </FormBox>
      </Box>
    </GradientBackground>
  )
}

export default CheckupStrengthPage
