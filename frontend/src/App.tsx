import { Route, Routes } from 'react-router-dom';
import Index from './pages';
import Login from './pages/login';

export default function App() {
  return (
    <Routes>
      {/* authentication */}
      <Route path='/login' element={<Login />} />
      <Route path='/:username'>
        <Route index element={<Index />} />
        <Route path='*' element={<Index />} />
      </Route>
    </Routes>
  );
}
