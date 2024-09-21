import { Navigate, Outlet, Route, Routes, useParams } from 'react-router-dom';
import Navbar from './components/navbar';
import Loading from './components/suspense/loading';
import Login from './pages/login';
import Notebook from './pages/notebook';
import Register from './pages/register';
import { useAuth } from './providers/auth-provider';
import { EditorProvider } from './providers/editor-provider';

export default function App() {
  return (
    <Routes>
      <Route path='/' element={<BigBoyWrapper />}>
        {/* authentication */}
        <Route path='login' element={<Login />} />
        <Route path='register' element={<Register />} />

        <Route path=':username' element={
          <EditorProvider>
            <Outlet />
          </EditorProvider>
        }>
          <Route element={<Protected />}>
            <Route index element={<Notebook />} />
            <Route path='*' element={<Notebook />} />
          </Route>
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

function BigBoyWrapper() {
  return (
    <div className='h-screen flex flex-col'>
      <Navbar />
      <Outlet />
    </div>
  );
}
