import { Box, Button } from '@mui/material'
import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'

export default function TestPage() {
  return (
    <Box>
      <h1>Test Page!</h1>
      <Button onClick={() => { window.ipc.send('set-title', 'test-page-var') }}>
        Test
      </Button>
      <Button onClick={() => { window.ipc.invoke('test-master-pass', 'testUserFront', 'password123A!Front')}}>
        Add Master Password
      </Button>
      <Button onClick={() => { window.ipc.invoke('test-login', 'testUserFront', 'password123A!Front')}}>
        Verify Password
      </Button>
      <Button onClick={() => { window.ipc.invoke('get-master-password')}}>
        Verify Profile
      </Button>
    </Box>
  )
}