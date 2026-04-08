import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { AppShell } from './components/layout/AppShell'
import { LandingPage } from './pages/LandingPage'
import { AuthPage } from './pages/AuthPage'
import { DashboardPage } from './pages/DashboardPage'
import { ListViewPage } from './pages/ListViewPage'
import { ListEditorPage } from './pages/ListEditorPage'
import { ListGroupPage } from './pages/ListGroupPage'
import { PeopleGroupPage } from './pages/PeopleGroupPage'
import { ProfilePage } from './pages/ProfilePage'
import { NotFoundPage } from './pages/NotFoundPage'

const router = createBrowserRouter([
  {
    element: <AppShell />,
    children: [
      { path: '/',                     element: <LandingPage /> },
      { path: '/auth',                 element: <AuthPage /> },
      { path: '/dashboard',            element: <DashboardPage /> },
      { path: '/lists/:id',            element: <ListViewPage /> },
      { path: '/lists/:id/edit',       element: <ListEditorPage /> },
      { path: '/groups/:id',           element: <ListGroupPage /> },
      { path: '/people-groups/:id',    element: <PeopleGroupPage /> },
      { path: '/profile',             element: <ProfilePage /> },
      { path: '*',                     element: <NotFoundPage /> },
    ],
  },
])

export default function App() {
  return <RouterProvider router={router} />
}
