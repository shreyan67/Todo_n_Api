import React, { useState } from 'react';
import { Box, TextField, Button, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function Signup() {
  const [username, setUsername] = useState('');
  const navigate = useNavigate();

  const handleSignup = () => {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const userExists = users.some((user) => user.username === username);

    if (userExists) {
      alert('Username already exists. Please choose a different one.');
      return;
    }

    // Add new user to the users list
    users.push({ username });
    localStorage.setItem('users', JSON.stringify(users));
    alert('Signup successful! Please log in.');
    navigate('/login');
  };

  return (
    <Box sx={{ maxWidth: 400, mx: 'auto', mt: 5 }}>
      <Typography variant="h5" sx={{ mb: 3, textAlign: 'center' }}>
        Signup
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
        onClick={handleSignup}
      >
        Signup
      </Button>
      <Button
        variant="text"
        fullWidth
        onClick={() => navigate('/login')}
        sx={{ mt: 1 }}
      >
        Already have an account? Login
      </Button>
    </Box>
  );
}

export default Signup;
