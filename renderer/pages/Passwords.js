import { Box, Button, Typography } from '@mui/material'
import React, { useState, useEffect } from 'react'
import styled from 'styled-components'

// index for Dashboard, shows all passwords.
// grab all stored passwords.

const PassBox = styled(Box)({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  backgroundColor: 'rgba(255, 255, 255, 0.5)',
  padding: '20px',
  borderRadius: '20px',
  maxWidth: '898px',
  height: 'auto',
  margin: 'auto',
  marginTop: '20px',
  marginBottom: '20px',
})

const ViewButton = styled(Button)({
  borderRadius: '50px',
  color: '#36343A'
})

export default function Passwords() {
  const [data, setData] = useState([])

  useEffect(() => {
    const checkPasswords = async () => {
      try {
        const fetchedData = await window.ipc.invoke('display-all-passwords')
        setData(fetchedData)
      } catch (error) {
        console.error('Error displaying all passwords:', error)
      }
    }

    checkPasswords()
  }, [])

  // Implement loading.

  return (
    <Box sx={{ 
      justifyContent: 'center'
    }}>
      {data.length > 0 ? (
        data.map((entry, index) => (
          <PassBox key={index}>
            <Typography variant="subtitle1">{entry.url}</Typography>
            <ViewButton
              variant="contained"
              sx={{
                textTransform: 'none',
                borderRadius: '50px',
                backgroundColor: '#36343A'
              }}
            >
              View!
            </ViewButton>
          </PassBox>
        ))
      ) : (
        <PassBox>
          <Typography variant="subtitle1">No passwords saved</Typography>
        </PassBox>
      )}
    </Box>
  )
}