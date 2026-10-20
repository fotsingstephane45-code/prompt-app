import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Bookmark } from 'lucide-react'
import { clearSession, request } from '../api'
import PromptCard from '../components/PromptCard'

export default function MesPrompts() {
  const navigate = useNavigate()
  const [items, setItems] = useState(null) // null = pas encore chargé
  const [error, setError] = useState('')

  useEffect(() => {
    request('/templates/mine')
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

  const update = (t) => setItems((list) => list.map((x) => (x.id === t.id ? t : x)))

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 lg:px-8">
      <p className="text-[11px] font-semibold tracking-[0.15em] text-ink/40">MA COLLECTION</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight">Mes prompts</h1>
      <p className="mt-1 text-ink/60">Les prompts que vous avez enregistrés ou créés.</p>

      {error && <p className="mt-6 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
      {items === null && <p className="mt-6 animate-pulse text-ink/50">Chargement...</p>}

      {items && items.length === 0 && !error && (
        <div className="mt-8 flex flex-col items-center rounded-3xl border border-dashed border-black/10 bg-white p-12 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-soft text-brand">
            <Bookmark size={22} />
          </div>
          <p className="mt-4 font-semibold">Aucun prompt pour le moment</p>
          <p className="mt-1 text-sm text-ink/60">
            Enregistrez un prompt avec le marque-page, ou créez le vôtre.
          </p>
          <div className="mt-5 flex gap-3">
            <Link to="/explorer" className="rounded-xl border border-black/10 px-4 py-2.5 text-sm font-medium hover:bg-side">
              Explorer
            </Link>
            <Link to="/creer" className="rounded-xl bg-brand px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-dark">
              Créer un prompt
            </Link>
          </div>
        </div>
      )}

      <div className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {items?.map((t) => <PromptCard key={t.id} t={t} onChange={update} />)}
      </div>
    </div>
  )
}