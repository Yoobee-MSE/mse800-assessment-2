import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAppContext } from '../context';


const withPublic = (WrappedComponent: React.FC) => {
  const Wrapper: React.FC = (props) => {
    const { state } = useAppContext();
    const router = useRouter();

    useEffect(() => {
      if (state.isAuthenticated) {
        router.push('/dashboard');
      }
    }, [state.isAuthenticated, router]);

    return !state.isAuthenticated ? <WrappedComponent {...props} /> : null;
  };

  return Wrapper;
};

export default withPublic;
