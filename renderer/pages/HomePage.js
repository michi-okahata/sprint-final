import React, { useState, useEffect } from 'react'
import {
  AppBar,
  TextField,
  InputAdornment,
  IconButton,
  Box,
  Typography,
  List,
  ListItem,
  Button,
  Toolbar,
  CircularProgress,
} from '@mui/material'
import { Search, Add, Visibility, VisibilityOff } from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'


// PasswordPage Component
const PasswordPage = () => {
  const [passwords, setPasswords] = useState([]) // State for passwords
  const [loading, setLoading] = useState(true) // Loading state
  const [searchQuery, setSearchQuery] = useState('') // Search query
  const navigate = useNavigate()

  // Fetch passwords from backend
  useEffect(() => {
    const fetchPasswords = async () => {
      try {
        setLoading(true) // Start loading
        const response = await window.electronAPI.fetchPasswords()
        if (response.success) {
          setPasswords(response.passwords || [])
        } else {
          console.error('Failed to fetch passwords:', response.error)
        }
      } catch (error) {
        console.error('Error fetching passwords:', error)
      } finally {
        setLoading(false) // End loading
      }
    }
    fetchPasswords()
  }, [])

  // Search filter
  const filteredPasswords = passwords.filter((password) =>
    password.website.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Event Handlers
  const handleSearchChange = (event) => setSearchQuery(event.target.value)
  const handleAddPassword = () => navigate('/AddNewPasswordPage') // Navigate to add password page
  const handleViewPassword = () => navigate('/ViewPassword') // Navigate to view password page



  // Toggle password visibility
  const toggleVisibility = (index) => {
    const updatedPasswords = [...passwords]
    updatedPasswords[index].visible = !updatedPasswords[index].visible
    setPasswords(updatedPasswords)
  }

  return (
    <Box sx={{ height: '100vh', background: 'linear-gradient(210deg, #A472CB, #5883F2)', padding: '20px' }}>
      {/* Header */}
      <AppBar position="static" sx={{ background: 'transparent', boxShadow: 'none', mb: 4 }}>
        <Toolbar>
          <Typography variant="h4" sx={{ flexGrow: 1, color: 'white' }}>
            Password Manager
          </Typography>
          <Button
            variant="contained"
            onClick={handleAddPassword}
            startIcon={<Add />}
            sx={{
              backgroundColor: '#36343A',
              color: 'white',
              textTransform: 'none',
              borderRadius: '50px',
              padding: '10px 20px',
            }}
          >
            Add Password
          </Button>
        </Toolbar>
      </AppBar>

      {/* Search Bar */}
      <TextField
        variant="outlined"
        placeholder="Search passwords"
        value={searchQuery}
        onChange={handleSearchChange}
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
          width: '100%',
          maxWidth: '600px',
          mb: 4,
        }}
      />

      {/* Content */}
      {loading ? (
        // Loading Spinner
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : passwords.length === 0 ? (
        // Empty State
        <Typography variant="h6" sx={{ color: 'white', textAlign: 'center', mt: 4 }}>
          No passwords found. Add your first password!
        </Typography>
      ) : (
        // Password List
        <List>
          {filteredPasswords.map((password, index) => (
            <ListItem
              key={password.id}
              sx={{
                backgroundColor: '#CFC4FE',
                borderRadius: '10px',
                padding: '10px 20px',
                mb: 2,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Box>
                <Typography variant="subtitle1">{password.website}</Typography>
                <Typography variant="body2">{password.username}</Typography>
              </Box>
              <Box>
                <Typography
                  sx={{ marginRight: '10px', color: password.visible ? '#000' : '#888' }}
                >
                  {password.visible ? password.password : '••••••••'}
                </Typography>
                <IconButton onClick={() => toggleVisibility(index)}>
                  {password.visible ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </Box>
            </ListItem>
          ))}
        </List>
      )}
    </Box>
  )
}

export default PasswordPage

