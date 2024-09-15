import { Navigate, Outlet, Route, Routes, useParams } from 'react-router-dom';
import Loading from './components/suspense/loading';
import Notebook from './pages/notebook';
import Login from './pages/login';
import { useAuth } from './providers/auth-provider';

export default function App() {
  return (
    <Routes>
      {/* authentication */}
      <Route path='/login' element={<Login />} />
      <Route path='/:username'>
        <Route element={<Protected />}>
          <Route index element={<Notebook />} />
          <Route path='*' element={<Notebook />} />
        </Route>
      </Route>
    </Routes>
  );
}

function Protected() {
  const { username, ready } = useAuth();
  const { username: u } = useParams();
  if (!ready) return <Loading />;
  if (u !== username) return <Navigate to='/login' replace />;
  return <Outlet />;
}
