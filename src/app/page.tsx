// src/app/page.tsx

"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Layout from './layout';

const HomePage: React.FC = () => {
  const router = useRouter();

  useEffect(() => {
    try {
      const createAdmin = async () => { 
        const response = await fetch('/api/create-admin', {
          method: 'POST',
        });
  
        if (!response.ok) {
          throw new Error('Failed to create admin user');
        }
  
        const data = await response.json();
        console.log(data.message);
      }

      createAdmin()
    } catch (error) {
      
    }
  }, [])

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
