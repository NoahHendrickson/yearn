import { Routes, Route } from 'react-router-dom'
import { AppShell } from '@/components/layout/AppShell'
import { LandingPage } from '@/pages/LandingPage'
import { AuthPage } from '@/pages/AuthPage'
import { DashboardPage } from '@/pages/DashboardPage'
import { YearnPage } from '@/pages/YearnPage'
import { ListViewPage } from '@/pages/ListViewPage'
import { ListEditorPage } from '@/pages/ListEditorPage'
import { ListGroupPage } from '@/pages/ListGroupPage'
import { PeopleGroupPage } from '@/pages/PeopleGroupPage'
import { ProfilePage } from '@/pages/ProfilePage'
import { NotFoundPage } from '@/pages/NotFoundPage'

export default function App() {
  return (
    <Routes>
      <Route path="/auth" element={<AuthPage />} />
      <Route element={<AppShell />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/dashboard" element={<YearnPage />} />
        <Route path="/lists" element={<DashboardPage />} />
        <Route path="/lists/:id" element={<ListViewPage />} />
        <Route path="/lists/:id/edit" element={<ListEditorPage />} />
        <Route path="/groups/:id" element={<ListGroupPage />} />
        <Route path="/people-groups/:id" element={<PeopleGroupPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}
