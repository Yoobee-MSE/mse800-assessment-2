// src/app/login.tsx
"use client";

import React, { useState } from 'react';
import { TextField, Button, Container, Typography, Box } from '@mui/material';
import { useRouter } from 'next/navigation';
import RootLayout from '../layout';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    // Add your authentication logic here
    console.log({ email, password });

    // For now, we'll just redirect to a dashboard or home page on successful login
    router.push('/dashboard');
  };

  return (
    <RootLayout>
      <Container maxWidth="sm">
        <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" minHeight="100vh">
          <Typography variant="h4" component="h1" gutterBottom>
            Login
          </Typography>
          <form onSubmit={handleLogin} style={{ width: '100%' }}>
            <TextField
              label="Email"
              type="email"
              fullWidth
              margin="normal"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <TextField
              label="Password"
              type="password"
              fullWidth
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <Button type="submit" variant="contained" color="primary" fullWidth style={{ marginTop: '1rem' }}>
              Login
            </Button>
          </form>
        </Box>
      </Container>
    </RootLayout>
  );
};

export default LoginPage;
