import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import { clearSession, request } from '../api'
import { CATEGORIES, CATEGORY_NAMES } from '../categories'
import PromptCard from '../components/PromptCard'

const TABS = ['Tous', 'Rédaction', 'Marketing', 'Créativité']

export default function Accueil() {
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem('user') || '{}')
  const [items, setItems] = useState([])
  const [tab, setTab] = useState('Tous')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    request('/templates')
      .then(setItems)
      .catch((err) => {
        if (err.message === 'Unauthorized') {
          clearSession()
          navigate('/login')
        } else setError(err.message)
      })
      .finally(() => setLoading(false))
  }, [])

  // Remplace un prompt de la liste par sa version mise à jour (like, enregistrement)
  const update = (t) => setItems((list) => list.map((x) => (x.id === t.id ? t : x)))

  const shown = (tab === 'Tous' ? items : items.filter((t) => t.categorie === tab)).slice(0, 6)

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 lg:px-8">
      <h1 className="text-3xl font-semibold tracking-tight">Bonjour, {user.prenom}</h1>
      <p className="mt-1 text-ink/60">Que souhaitez-vous créer aujourd'hui ?</p>

      {/* Catégories */}
      <div className="mt-8 flex gap-3 overflow-x-auto pb-2">
        {CATEGORY_NAMES.map((name) => {
          const { icon: Icon, bg, fg } = CATEGORIES[name]
          return (
            <button
              key={name}
              onClick={() => navigate(`/explorer?categorie=${encodeURIComponent(name)}`)}
              className="flex min-w-[190px] items-center gap-3 rounded-2xl border border-black/5 bg-white px-4 py-4 text-left shadow-sm transition hover:shadow-md"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-xl" style={{ background: bg, color: fg }}>
                <Icon size={20} />
              </span>
              <span className="flex-1 font-semibold">{name}</span>
              <ChevronRight size={16} className="text-ink/40" />
            </button>
          )
        })}
      </div>

      {/* Prompts populaires */}
      <div className="mt-12 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[11px] font-semibold tracking-[0.15em] text-ink/40">SÉLECTION DU MOMENT</p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight">Prompts populaires</h2>
        </div>
        <div className="flex rounded-xl bg-side p-1">
          {TABS.map((name) => (
            <button
              key={name}
              onClick={() => setTab(name)}
              className={`rounded-lg px-3.5 py-1.5 text-xs font-medium transition ${
                tab === name ? 'bg-white font-semibold shadow-sm' : 'text-ink/50'
              }`}
            >
              {name}
            </button>
          ))}
        </div>
      </div>

      {error && <p className="mt-6 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
      {loading && <p className="mt-6 animate-pulse text-ink/50">Chargement...</p>}
      {!loading && !error && shown.length === 0 && <p className="mt-6 text-ink/50">Aucun prompt dans cette catégorie.</p>}

      <div className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {shown.map((t) => (
          <PromptCard key={t.id} t={t} onChange={update} />
        ))}
      </div>
    </div>
  )
}