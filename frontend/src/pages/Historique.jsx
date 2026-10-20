import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { History as HistoryIcon, MessageSquarePlus, RotateCcw } from 'lucide-react'
import { clearSession, request } from '../api'

// Transforme une date en "Aujourd'hui", "Hier" ou "12 octobre 2026"
function dayLabel(iso) {
  const d = new Date(iso)
  const start = (x) => new Date(x.getFullYear(), x.getMonth(), x.getDate()).getTime()
  const diff = Math.round((start(new Date()) - start(d)) / 86400000)
  if (diff === 0) return "Aujourd'hui"
  if (diff === 1) return 'Hier'
  return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
}

const hour = (iso) => new Date(iso).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })

export default function Historique() {
  const navigate = useNavigate()
  const [items, setItems] = useState(null) // null = pas encore chargé
  const [error, setError] = useState('')

  useEffect(() => {
    request('/prompts')
      .then(setItems)
      .catch((err) => {
        if (err.message === 'Unauthorized') {
          clearSession()
          navigate('/login')
        } else {
          setError(err.message)
          setItems([])
        }
      })
  }, [navigate])

  // Regroupe les questions par jour, en gardant l'ordre (récent d'abord)
  const groups = []
  for (const item of items || []) {
    const label = dayLabel(item.createdAt)
    const last = groups[groups.length - 1]
    if (last && last.label === label) last.items.push(item)
    else groups.push({ label, items: [item] })
  }

  const again = (question) => navigate('/chat', { state: { prompt: question } })

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 lg:px-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[11px] font-semibold tracking-[0.15em] text-ink/40">ACTIVITÉ</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight">Historique</h1>
          <p className="mt-1 text-ink/60">Les questions que vous avez posées à l'IA.</p>
        </div>
        <Link
          to="/chat"
          className="flex items-center gap-2 rounded-xl bg-brand px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-dark"
        >
          <MessageSquarePlus size={17} /> Nouvelle question
        </Link>
      </div>

      {error && <p className="mt-6 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
      {items === null && <p className="mt-6 animate-pulse text-ink/50">Chargement...</p>}

      {items && items.length === 0 && !error && (
        <div className="mt-8 flex flex-col items-center rounded-3xl border border-dashed border-black/10 bg-white p-12 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-soft text-brand">
            <HistoryIcon size={22} />
          </div>
          <p className="mt-4 font-semibold">Aucune question pour le moment</p>
          <p className="mt-1 text-sm text-ink/60">Vos questions apparaîtront ici dès que vous aurez utilisé le chat.</p>
        </div>
      )}

      <div className="mt-8 space-y-8">
        {groups.map((g) => (
          <section key={g.label}>
            <h2 className="mb-3 text-sm font-semibold text-ink/50">{g.label}</h2>
            <ul className="space-y-3">
              {g.items.map((item) => (
                <li
                  key={item._id}
                  className="flex items-start gap-4 rounded-2xl border border-black/5 bg-white p-4 shadow-sm"
                >
                  <div className="min-w-0 flex-1">
                    <p className="line-clamp-3 whitespace-pre-wrap text-[15px] leading-relaxed">{item.question}</p>
                    <p className="mt-1.5 text-xs text-ink/40">{hour(item.createdAt)}</p>
                  </div>
                  <button
                    onClick={() => again(item.question)}
                    className="flex shrink-0 items-center gap-1.5 rounded-xl border border-black/10 px-3 py-2 text-xs font-semibold transition hover:bg-side"
                  >
                    <RotateCcw size={14} /> Reposer
                  </button>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  )
}