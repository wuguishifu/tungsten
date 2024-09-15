import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import Toaster from './components/toaster.tsx';
import { AuthProvider } from './providers/auth-provider.tsx';
import { DataProvider } from './providers/data-provider.tsx';

import './index.css';
import { SettingsProvider } from './providers/settings-provider.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SettingsProvider>
      <AuthProvider>
        <DataProvider>
          <App />
        </DataProvider>
      </AuthProvider>
    </SettingsProvider>
    <Toaster />
  </StrictMode>,
);
