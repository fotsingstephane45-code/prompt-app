import { Navigate, Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import Accueil from './pages/Accueil'
import Chat from './pages/Chat'
import Creer from './pages/Creer'
import Explorer from './pages/Explorer'
import Historique from './pages/Historique'
import Login from './pages/Login'
import MesPrompts from './pages/MesPrompts'
import Register from './pages/Register'

function Private({ children }) {
  return localStorage.getItem('token') ? children : <Navigate to="/login" replace />
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Toutes ces pages partagent le même cadre (menu + barre du haut) */}
      <Route element={<Private><Layout /></Private>}>
        <Route path="/" element={<Accueil />} />
        <Route path="/explorer" element={<Explorer />} />
        <Route path="/mes-prompts" element={<MesPrompts />} />
        <Route path="/historique" element={<Historique />} />
        <Route path="/creer" element={<Creer />} />
        <Route path="/chat" element={<Chat />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}