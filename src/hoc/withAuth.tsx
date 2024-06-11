import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAppContext } from '../context';


const withAuth = (WrappedComponent: React.FC) => {
  const Wrapper: React.FC = (props) => {
    const { state } = useAppContext();
    const router = useRouter();

    console.log("🚀 ~ useEffect ~ state.isAuthenticated:", state.isAuthenticated)
    useEffect(() => {
      if (!state.isAuthenticated) {
        router.push('/login');
      }
    }, [state.isAuthenticated, router]);

    return state.isAuthenticated ? <WrappedComponent {...props} /> : null;
  };

  return Wrapper;
};

export default withAuth;
