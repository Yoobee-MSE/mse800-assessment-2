"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Layout from './layout';
import { useAppContext } from '../context';
import { CircularProgress } from '@mui/material';

const HomePage: React.FC = () => {
  const router = useRouter();
  const { state } = useAppContext()

  useEffect(() => {
    if (!state.isAuthenticated) {
      router.push('/login');
    } else { 
      router.push('/dashboard');
    }
  }, [router, state.isAuthenticated]);

  return state.isPageLoading && (
    <Layout>
      <CircularProgress />
    </Layout>
  );
};

export default HomePage;
