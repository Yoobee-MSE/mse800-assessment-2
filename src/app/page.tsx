// src/app/page.tsx

"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Layout from './layout';
import { useAppContext } from '../context';

const HomePage: React.FC = () => {
  const router = useRouter();
  const { state } = useAppContext()

  useEffect(() => {
    if (!state.isAuthenticated) {
      router.push('/login');
    }
  }, [router, state.isAuthenticated]);

  return (
    <div>Loading...</div>
  );
};

export default HomePage;
