import { useEffect, useRef, useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import {
  ArrowRight, Bell, Bookmark, Compass, History as HistoryIcon,
  LayoutGrid, Menu, MoreHorizontal, Plus, Search, Sparkles, X,MessageSquare,
} from 'lucide-react'
import { clearSession, request } from '../api'

const links = [
  { to: '/', label: 'Accueil', icon: LayoutGrid, end: true },
  { to: '/explorer', label: 'Explorer', icon: Compass },
  { to: '/mes-prompts', label: 'Mes prompts', icon: Bookmark, counter: true },
  { to: '/historique', label: 'Historique', icon: HistoryIcon },
  { to: '/chat', label: 'Chat IA', icon: MessageSquare },
]

export default function Layout() {
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem('user') || '{}')
  const initials = `${user.prenom?.[0] ?? ''}${user.nom?.[0] ?? ''}`.toUpperCase()

  const [open, setOpen] = useState(false) // tiroir du menu sur téléphone
  const [menu, setMenu] = useState(false) // petit menu "..." de l'utilisateur
  const [count, setCount] = useState(0) // compteur "Mes prompts"
  const [q, setQ] = useState('')
  const searchRef = useRef(null)

  const logout = () => {
    clearSession()
    navigate('/login')
  }

  const loadCount = () =>
    request('/templates/mine')
      .then((d) => setCount(d.length))
      .catch((err) => err.message === 'Unauthorized' && logout())

  // Compteur : chargé au départ et à chaque événement "mine-changed"
  useEffect(() => {
    loadCount()
    window.addEventListener('mine-changed', loadCount)
    return () => window.removeEventListener('mine-changed', loadCount)
  }, [])

  // Raccourci Ctrl+K (ou Cmd+K) : place le curseur dans la recherche
  useEffect(() => {
    const onKey = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        searchRef.current?.focus()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const search = (e) => {
    e.preventDefault()
    navigate(`/explorer?search=${encodeURIComponent(q.trim())}`)
  }

  return (
    <div className="min-h-screen bg-canvas text-ink">
      {open && <div className="fixed inset-0 z-40 bg-black/30 lg:hidden" onClick={() => setOpen(false)} />}

      {/* Menu de gauche */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[260px] flex-col border-r border-black/5 bg-side px-4 py-5 transition-transform duration-200 lg:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand text-white">
              <Sparkles size={20} />
            </div>
            <span className="text-2xl font-semibold tracking-tight">Promptly</span>
          </div>
          <button className="rounded-lg p-1 lg:hidden" onClick={() => setOpen(false)} aria-label="Fermer le menu">
            <X size={20} />
          </button>
        </div>

        <NavLink
          to="/creer"
          onClick={() => setOpen(false)}
          className="mt-6 flex items-center justify-center gap-2 rounded-2xl bg-brand py-3.5 font-semibold text-white shadow-md transition hover:bg-brand-dark"
        >
          <Plus size={18} /> Créer un prompt
        </NavLink>

        <p className="mt-8 px-3 text-[11px] font-semibold tracking-[0.15em] text-ink/40">ESPACE</p>
        <nav className="mt-2 space-y-1">
          {links.map(({ to, label, icon: Icon, end, counter }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-3 py-2.5 text-[15px] transition ${
                  isActive ? 'bg-white font-semibold text-brand shadow-sm' : 'text-ink/70 hover:bg-white/60'
                }`
              }
            >
              <Icon size={19} />
              <span className="flex-1">{label}</span>
              {counter && (
                <span className="rounded-md bg-brand-soft px-2 py-0.5 text-xs font-semibold text-brand">{count}</span>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="mt-auto space-y-4">
          {/* Encart Pro (décoratif) */}
          <div className="rounded-2xl border border-brand/10 bg-brand-soft p-4">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-brand">
              <Sparkles size={18} />
            </div>
            <p className="mt-3 font-semibold">Passez à Promptly Pro</p>
            <p className="mt-1 text-sm text-ink/60">Des prompts illimités et des modèles exclusifs.</p>
            <button className="mt-3 flex items-center gap-1 text-sm font-semibold text-brand">
              Découvrir Pro <ArrowRight size={15} />
            </button>
          </div>

          {/* Carte utilisateur */}
          <div className="relative flex items-center gap-3 border-t border-black/5 pt-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#dcbfae] text-sm font-semibold text-[#6b3f2a]">
              {initials}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold">{user.prenom} {user.nom}</p>
              <p className="text-xs text-ink/50">Compte gratuit</p>
            </div>
            <button onClick={() => setMenu(!menu)} className="rounded-lg p-1.5 hover:bg-white/70" aria-label="Menu du compte">
              <MoreHorizontal size={18} />
            </button>
            {menu && (
              <button
                onClick={logout}
                className="absolute bottom-full right-0 mb-2 rounded-xl bg-white px-4 py-2 text-sm shadow-lg ring-1 ring-black/5 hover:bg-canvas"
              >
                Déconnexion
              </button>
            )}
          </div>
        </div>
      </aside>

      {/* Zone principale */}
      <div className="lg:pl-[260px]">
        <header className="sticky top-0 z-30 flex h-[72px] items-center gap-3 border-b border-black/5 bg-canvas/90 px-4 backdrop-blur lg:px-8">
          <button className="rounded-lg p-2 lg:hidden" onClick={() => setOpen(true)} aria-label="Ouvrir le menu">
            <Menu size={22} />
          </button>

          <form onSubmit={search} className="relative max-w-md flex-1">
            <Search size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink/40" />
            <input
              ref={searchRef}
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Rechercher un prompt..."
              className="w-full rounded-xl bg-transparent py-2.5 pl-10 pr-14 text-sm outline-none placeholder:text-ink/40 focus:bg-white focus:ring-1 focus:ring-black/10"
            />
            <kbd className="absolute right-3 top-1/2 hidden -translate-y-1/2 rounded-md bg-side px-1.5 py-0.5 text-[11px] text-ink/50 sm:block">
              Ctrl K
            </kbd>
          </form>

          <div className="ml-auto flex items-center gap-3">
            <button className="relative rounded-lg p-2 text-ink/70 hover:bg-white" aria-label="Notifications">
              <Bell size={20} />
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500" />
            </button>
            <button className="hidden rounded-xl border border-black/10 bg-white px-4 py-2.5 text-sm font-medium sm:block">
              Besoin d'aide ?
            </button>
          </div>
        </header>

        <Outlet />
      </div>
    </div>
  )
}