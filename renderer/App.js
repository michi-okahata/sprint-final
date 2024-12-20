// changed to avoid double router
import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Pages and Components
import Dashboard from './components/Sidebar.js';
import AddNewPasswordPage from './pages/AddNewPasswordPage.js';
import AddPassword from './pages/AddPassword.js';
import CheckUpPage from './pages/CheckUpPage.js';
import CheckUpStrengthPage from './pages/CheckUpStrengthPage.js';
import CheckUpUniquePage from './pages/CheckUpUniquePage.js';
import DeletePassword from './pages/DeletePassword.js';
import EditPassword from './pages/EditPassword.js';
import HomePage from './pages/HomePage.js';
import LoginPage from './pages/LoginPage.js';
import Passwords from './pages/Passwords.js';
import SettingsPage from './pages/SettingsPage.js';
import SetUpPage from './pages/SetUpPage.js';
import ViewPassword from './pages/ViewPassword.js';

export default function App() {
  const [isProfile, setProfile] = useState(null);

  useEffect(() => {
    const checkProfile = async () => {
      try {
        const response = await window.ipc.invoke('get-master-password');
        const username = response?.username;

        if (username === 'undefined' || !username) {
          setProfile(false);
        } else {
          setProfile(true);
        }
      } catch (error) {
        console.error('Error checking profile:', error);
        setProfile(false);
      }
    };

    checkProfile();
  }, []); // Runs once.

  return (
    <Routes>
      {/* Initial Route */}
      <Route path="/" element={isProfile === null ? null : isProfile ? <LoginPage /> : <SetUpPage />} />

      {/* Setup and Login */}
      <Route path="/SetUpPage" element={<SetUpPage />} />
      <Route path="/LoginPage" element={<LoginPage />} />

      {/* Dashboard with Sidebar */}
      <Route path="/Dashboard" element={<Dashboard />}>
        {/* Nested Routes inside Dashboard */}
        <Route path="Home" element={<HomePage />} />
        <Route path="Passwords" element={<Passwords />} />
        <Route path="AddNewPassword" element={<AddNewPasswordPage />} />
        <Route path="AddPassword" element={<AddPassword />} />
        <Route path="CheckUp" element={<CheckUpPage />} />
        <Route path="CheckUpStrength" element={<CheckUpStrengthPage />} />
        <Route path="CheckUpUnique" element={<CheckUpUniquePage />} />
        <Route path="Settings" element={<SettingsPage />} />
        <Route path="DeletePassword" element={<DeletePassword />} />
        <Route path="EditPassword" element={<EditPassword />} />
        <Route path="ViewPassword" element={<ViewPassword />} />
      </Route>

      {/* Fallback Redirect */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}