import { StrictMode } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx';
import Toaster from './components/toaster.tsx';
import { AuthProvider } from './providers/auth-provider.tsx';
import { DataProvider } from './providers/data/provider.tsx';
import { SettingsProvider } from './providers/settings-provider.tsx';
import { TreeProvider } from './providers/tree/provider.tsx';

import './editor.css';
import './highlight.css';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <SettingsProvider>
        <AuthProvider>
          <DataProvider>
            <TreeProvider>
              <DndProvider backend={HTML5Backend}>
                <App />
              </DndProvider>
            </TreeProvider>
          </DataProvider>
        </AuthProvider>
      </SettingsProvider>
      <Toaster />
    </BrowserRouter>
  </StrictMode>,
);
