// src/app/login.tsx
"use client";

import React, { useState } from 'react';
import { TextField, Button, Container, Typography, Box, FormControl, FormHelperText, InputLabel, OutlinedInput, InputAdornment, IconButton, Icon, CircularProgress, Select, MenuItem, SelectChangeEvent } from '@mui/material';
import { useRouter } from 'next/navigation';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import RemoveRedEyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined';

// react-hook-form and yup
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm, Controller } from 'react-hook-form'
import withPublic from '../../hoc/withPublic';
import { APP_ACTION, AppState, useAppContext } from '../../context';
import { getDictionary } from '../../dictionary/dictionaries';

const defaultValues = {
  password: '',
  email: ''
}

const schema = yup.object().shape({
  email: yup.string().email().required(),
  password: yup.string().min(5, 'Password must be at least 5 characters').required()
})

const LoginPage: React.FC = () => {
  const [showPassword, setShowPassword] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const router = useRouter();
  const { dispatch, state }: { dispatch: any, state: AppState } = useAppContext();

  const {
    control,
    handleSubmit,
    formState: { errors, isValid }
  } = useForm({
    defaultValues,
    mode: 'onBlur',
    resolver: yupResolver(schema)
  })

  const handleLogin = async (data: any) => {
    setIsLoading(true);
    // Add your authentication logic here
    const body = {
      email: data.email,
      password: data.password
    }
    try {
      const response = await fetch('/api/login', {
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body), 
        method: 'POST'
      });

      if (response.status < 400) {
        response.json().then((data) => {
          dispatch({ type: APP_ACTION.SET_USER, payload: data });
          dispatch({ type: APP_ACTION.SET_IS_AUTHENTICATED, payload: true });
          router.replace('/dashboard');
        });
      }
    } catch (error) {
      console.log("🚀 ~ handleLogin ~ error:", error)
      
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangeLanguage = async(event: SelectChangeEvent) => {
    dispatch({ type: APP_ACTION.SET_APP_LANGUAGE, payload: event.target.value as string });
  }

  return (
    // <RootLayout>
      <Container maxWidth="sm">
        <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" minHeight="100vh">
          <Typography variant="h4" component="h1" gutterBottom>
            {state.dictionary?.buttons?.login}
          </Typography>
          <form onSubmit={handleSubmit(handleLogin)} style={{ width: '100%' }}>
            <FormControl fullWidth sx={{ mb: 4 }}>
              <Controller
                name='email'
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange, onBlur } }) => (
                  <TextField
                    autoFocus
                    label={state.dictionary?.forms?.email}
                    value={value}
                    onBlur={onBlur}
                    onChange={onChange}
                    error={Boolean(errors.email)}
                    placeholder={state.dictionary?.forms?.email}
                  />
                )}
              />
              {errors.email && <FormHelperText sx={{ color: 'error.main' }}>{errors.email.message}</FormHelperText>}
            </FormControl>
            <FormControl fullWidth>
              <InputLabel error={Boolean(errors.password)}>
                {state.dictionary?.forms?.password}
              </InputLabel>
              <Controller
                name='password'
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange, onBlur } }) => (
                  <OutlinedInput
                    value={value}
                    onBlur={onBlur}
                    label={state.dictionary?.forms?.password}
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
              <Button disabled={!isValid} fullWidth size='large' type='submit' variant='contained' sx={{ mb: 7, mt: 4 }}>
                {isLoading ? <CircularProgress className='bg-white' /> : state.dictionary?.buttons?.login}
              </Button>
            </FormControl>
          </form>
          <div className='flex flex-col justify-center items-center mt-200 mb-100'>
            <Typography className='text-center'>{state.dictionary?.pages?.login?.new_on_our_platform}
              <Button onClick={() => router.replace('/register')} color='primary'>
              {state.dictionary?.pages?.login?.create_an_account}
              </Button>
            </Typography>
          </div>
          <div >
            <FormControl fullWidth className='flex mt-100'>
              <InputLabel id="demo-simple-select-label">Language</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={state.language}
                label="Language"
                onChange={handleChangeLanguage}
              >
                <MenuItem value='mi'>Māori</MenuItem>
                <MenuItem value='en'>English</MenuItem>
              </Select>
            </FormControl>
          </div>
        </Box>
      </Container>
    // </RootLayout>
  );
};

export default withPublic(LoginPage);
