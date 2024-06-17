// src/app/login.tsx
"use client";

import React, { useState } from 'react';
import { TextField, Button, Container, Typography, Box, FormControl, FormHelperText, InputLabel, OutlinedInput, InputAdornment, IconButton, Icon, CircularProgress, Snackbar } from '@mui/material';
import { useRouter } from 'next/navigation';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import RemoveRedEyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined';

// react-hook-form and yup
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm, Controller } from 'react-hook-form'
import withPublic from '../../hoc/withPublic';
import { APP_ACTION, useAppContext } from '../../context';
import { UserRole } from '@prisma/client';

const defaultValues = {
  email: '',
  password: '',
  repeatPassword: '',
}

const schema = yup.object().shape({
  email: yup.string().email().required(),
  password: yup.string()
  .min(8, 'Password must be at least 8 characters')
  .required('Password is required'),
  repeatPassword: yup
    .string()
    .oneOf([yup.ref('password'), undefined], 'Passwords must match')
    .required('Please confirm your password'),
})

const LoginPage: React.FC = () => {
  const [showPassword, setShowPassword] = useState<boolean>(false)
  const [showRepeatPassword, setShowRepeatPassword] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const router = useRouter();
  const [snackMessage, setSnackMessage] = useState<string>('');

  const {
    control,
    handleSubmit,
    formState: { errors, isValid }
  } = useForm({
    defaultValues,
    mode: 'onBlur',
    resolver: yupResolver(schema)
  })

  const handleSignup = async (data: any) => {
    setIsLoading(true);
    // Add your authentication logic here
    const body = {
      email: data.email,
      password: data.password,
      role: UserRole.CUSTOMER,
    }

    try {
      const response = await fetch('/api/users', {
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
        method: 'POST'
      });

      if (response.status < 400) {
        response.json().then(() => {
          setSnackMessage('User registered successfully');
        });
      }
    } catch (error) {
      setSnackMessage('User registration failed');
    } finally {
      setIsLoading(false);
      setTimeout(() => {
        setSnackMessage('');
      }, 3000);
    }
  };

  return (
    // <RootLayout>
      <Container maxWidth="sm">
        <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" minHeight="100vh">
          <Typography variant="h4" component="h1" gutterBottom>
            Sign Up 
          </Typography>
          <form onSubmit={handleSubmit(handleSignup)} style={{ width: '100%' }}>
            <FormControl fullWidth sx={{ mb: 4 }}>
              <Controller
                name='email'
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange, onBlur } }) => (
                  <TextField
                    autoFocus
                    label='Email'
                    value={value}
                    onBlur={onBlur}
                    onChange={onChange}
                    error={Boolean(errors.email)}
                    placeholder='Email'
                  />
                )}
              />
              {errors.email && <FormHelperText sx={{ color: 'error.main' }}>{errors.email.message}</FormHelperText>}
            </FormControl>
            <FormControl fullWidth sx={{ mb: 4 }}>
              <InputLabel error={Boolean(errors.password)}>
                Password
              </InputLabel>
              <Controller
                name='password'
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange, onBlur } }) => (
                  <OutlinedInput
                    value={value}
                    onBlur={onBlur}
                    label='Password'
                    onChange={onChange}
                    id='auth-login-v2-password'
                    error={Boolean(errors.password)}
                    type={showPassword ? 'text' : 'password'}
                    endAdornment={
                      <InputAdornment position='end'>
                        <IconButton
                          edge='end'
                          onMouseDown={e => e.preventDefault()}
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <RemoveRedEyeIcon fontSize='medium'/> : <RemoveRedEyeOutlinedIcon fontSize='medium' />}
                          
                        </IconButton>
                      </InputAdornment>
                    }
                  />
                )}
              />
              {errors.password && (
                <FormHelperText sx={{ color: 'error.main' }} id=''>
                  {errors.password.message}
                </FormHelperText>
              )}
            </FormControl>
            <FormControl fullWidth>
              <InputLabel error={Boolean(errors.password)}>
                Repeat Password
              </InputLabel>
              <Controller
                name='repeatPassword'
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange, onBlur } }) => (
                  <OutlinedInput
                    value={value}
                    onBlur={onBlur}
                    label='Repeat Password'
                    onChange={onChange}
                    id='auth-login-v2-password'
                    error={Boolean(errors.repeatPassword)}
                    type={showRepeatPassword ? 'text' : 'password'}
                    endAdornment={
                      <InputAdornment position='end'>
                        <IconButton
                          edge='end'
                          onMouseDown={e => e.preventDefault()}
                          onClick={() => setShowRepeatPassword(!showRepeatPassword)}
                        >
                          {showRepeatPassword ? <RemoveRedEyeIcon fontSize='medium'/> : <RemoveRedEyeOutlinedIcon fontSize='medium' />}
                          
                        </IconButton>
                      </InputAdornment>
                    }
                  />
                )}
              />
              {errors.repeatPassword && (
                <FormHelperText sx={{ color: 'error.main' }} id=''>
                  {errors.repeatPassword.message}
                </FormHelperText>
              )}
            </FormControl>
            <FormControl fullWidth>
              <Button disabled={!isValid} fullWidth size='large' type='submit' variant='contained' sx={{ mb: 7, mt: 4 }}>
                {isLoading ? <CircularProgress /> : 'Signup'}
              </Button>
            </FormControl>
          </form>
          <div className='flex flex-col justify-center items-center mt-200'>
            <Typography className='text-center'>
              Already have an account?
              <Button onClick={() => router.replace('/login')} color='primary'>
                Login
              </Button>
            </Typography>
            
          </div>
        </Box>
        <Snackbar
          open={snackMessage !== ''}
          autoHideDuration={3000}
          message={snackMessage}
        />
      </Container>
    // </RootLayout>
  );
};

export default withPublic(LoginPage);
