import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx';
import Toaster from './components/toaster.tsx';
import { AuthProvider } from './providers/auth-provider.tsx';
import { DataProvider } from './providers/data-provider.tsx';
import { SettingsProvider } from './providers/settings-provider.tsx';

import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <SettingsProvider>
        <AuthProvider>
          <DataProvider>
            <App />
          </DataProvider>
        </AuthProvider>
      </SettingsProvider>
      <Toaster />
    </BrowserRouter>
  </StrictMode>,
);
