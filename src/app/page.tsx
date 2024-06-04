// src/app/page.tsx

"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Layout from './layout';

const HomePage: React.FC = () => {
  const router = useRouter();

  useEffect(() => {
    router.push('/login');
  }, [router]);

  return (
    <Layout>
      <div>Loading...</div>
    </Layout>
  );
};

export default HomePage;
