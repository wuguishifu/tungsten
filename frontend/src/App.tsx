import { createBrowserRouter, Navigate, Outlet, RouterProvider, useParams } from 'react-router-dom';
import Loading from './components/suspense/loading';
import Login from './pages/login';
import Notebook from './pages/notebook';
import { useAuth } from './providers/auth-provider';

const router = createBrowserRouter([
  {
    path: '/',
    children: [
      {
        path: 'login',
        element: <Login />,
      },
      {
        path: ':username',
        children: [
          {
            element: <Protected />,
            children: [
              {
                index: true,
                element: <Notebook />,
              },
              {
                path: '*',
                element: <Notebook />
              }
            ],
          },
        ],
      },
    ]
  }
])

export default function App() {
  return (
    <RouterProvider router={router} />
  );
}

function Protected() {
  const { username, ready } = useAuth();
  const { username: u } = useParams();
  if (!ready) return <Loading />;
  if (u !== username) return <Navigate to='/login' replace />;
  return <Outlet />;
}
