import React, { ReactNode } from 'react';
import { AppProvider } from '.';


const GeneralProvider = ({ children }: { children: ReactNode }) => {
  return (
    <AppProvider>
        {children}
    </AppProvider>
  );
};

export default GeneralProvider;
