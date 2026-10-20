import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { clearSession, request } from '../api'
import { CATEGORY_NAMES } from '../categories'
import PromptCard from '../components/PromptCard'

export default function Explorer() {
  const navigate = useNavigate()
  const [params, setParams] = useSearchParams()
  const search = params.get('search') || ''
  const categorie = params.get('categorie') || ''
  const key = `${search}|${categorie}` // identifie la recherche en cours

  // On garde les résultats avec la recherche à laquelle ils correspondent
  const [data, setData] = useState({ key: '', items: [], error: '' })
  const loading = data.key !== key // résultats pas encore arrivés pour cette recherche

  useEffect(() => {
    let cancelled = false
    const qs = new URLSearchParams()
    if (search) qs.set('search', search)
    if (categorie) qs.set('categorie', categorie)
    const url = '/templates' + (qs.toString() ? `?${qs}` : '')

    request(url)
      .then((items) => {
        if (!cancelled) setData({ key, items, error: '' })
      })
      .catch((err) => {
        if (cancelled) return
        if (err.message === 'Unauthorized') {
          clearSession()
          navigate('/login')
        } else {
          setData({ key, items: [], error: err.message })
        }
      })

    // Si la recherche change avant la réponse, on ignore l'ancienne réponse
    return () => {
      cancelled = true
    }
  }, [key, search, categorie, navigate])

  const update = (t) =>
    setData((d) => ({ ...d, items: d.items.map((x) => (x.id === t.id ? t : x)) }))

  const chooseCategory = (name) => {
    const next = new URLSearchParams(params)
    if (name) next.set('categorie', name)
    else next.delete('categorie')
    setParams(next)
  }

  const clearSearch = () => {
    const next = new URLSearchParams(params)
    next.delete('search')
    setParams(next)
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 lg:px-8">
      <p className="text-[11px] font-semibold tracking-[0.15em] text-ink/40">BIBLIOTHÈQUE</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight">Explorer</h1>

      {/* Filtres par catégorie */}
      <div className="mt-6 flex flex-wrap gap-2">
        {['', ...CATEGORY_NAMES].map((name) => (
          <button
            key={name || 'tous'}
            onClick={() => chooseCategory(name)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition ${
              categorie === name
                ? 'bg-brand text-white'
                : 'border border-black/10 bg-white text-ink/70 hover:bg-side'
            }`}
          >
            {name || 'Tous'}
          </button>
        ))}
      </div>

      {/* Rappel de la recherche en cours */}
      {search && (
        <p className="mt-5 text-sm text-ink/60">
          Résultats pour <strong className="text-ink">« {search} »</strong>{' '}
          <button onClick={clearSearch} className="ml-1 font-semibold text-brand hover:underline">
            Effacer
          </button>
        </p>
      )}

      {data.error && <p className="mt-6 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{data.error}</p>}
      {loading && <p className="mt-6 animate-pulse text-ink/50">Chargement...</p>}

      {!loading && !data.error && (
        <p className="mt-5 text-sm text-ink/50">
          {data.items.length} prompt{data.items.length > 1 ? 's' : ''}
        </p>
      )}

      {!loading && !data.error && data.items.length === 0 && (
        <div className="mt-6 rounded-3xl border border-dashed border-black/10 bg-white p-10 text-center text-ink/50">
          Aucun prompt ne correspond à votre recherche.
        </div>
      )}

      <div className="mt-4 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {!loading && data.items.map((t) => <PromptCard key={t.id} t={t} onChange={update} />)}
      </div>
    </div>
  )
}