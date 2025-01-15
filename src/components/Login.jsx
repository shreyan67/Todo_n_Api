import React, { useState } from 'react';
import { Box, TextField, Button, Typography } from '@mui/material';
import { useDispatch } from 'react-redux';
import { login } from '../slices/authSlice';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [username, setUsername] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = () => {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const userExists = users.some((user) => user.username === username);

    if (!userExists) {
      alert('User does not exist. Please sign up first.');
      navigate('/signup');
      return;
    }

    // Save the current user to local storage and dispatch login
    localStorage.setItem('currentUser', username);
    dispatch(login({ username }));
    navigate('/');
  };

  return (
    <Box sx={{ maxWidth: 400, mx: 'auto', mt: 5 }}>
      <Typography variant="h5" sx={{ mb: 3, textAlign: 'center' }}>
        Login
      </Typography>
      <TextField
        label="Username"
        variant="outlined"
        fullWidth
        sx={{ mb: 2 }}
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <Button
        variant="contained"
        fullWidth
        onClick={handleLogin}
      >
        Login
      </Button>
      <Button
        variant="text"
        fullWidth
        onClick={() => navigate('/signup')}
        sx={{ mt: 1 }}
      >
        Create an Account
      </Button>
    </Box>
  );
}

export default Login;
