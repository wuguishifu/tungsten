import { ThemeProvider } from 'next-themes';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx';
import Toaster from './components/toaster.tsx';
import './index.css';
import { AuthProvider } from './providers/auth-provider.tsx';
import { DataProvider } from './providers/data-provider.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider attribute='class' defaultTheme='dark' enableSystem storageKey='theme' disableTransitionOnChange>
      <BrowserRouter>
        <AuthProvider>
          <DataProvider>
            <App />
          </DataProvider>
        </AuthProvider>
      </BrowserRouter>
      <Toaster />
    </ThemeProvider>
  </StrictMode>,
);
