import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { clearSession, request } from '../api'
import { CATEGORY_NAMES } from '../categories'

const field =
  'w-full rounded-xl border border-black/10 bg-white px-4 py-3 outline-none focus:border-brand focus:ring-2 focus:ring-brand/20'

export default function Creer() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ titre: '', description: '', contenu: '', categorie: CATEGORY_NAMES[0] })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await request('/templates', { method: 'POST', body: JSON.stringify(form) })
      window.dispatchEvent(new Event('mine-changed')) // met à jour le compteur du menu
      navigate('/mes-prompts')
    } catch (err) {
      if (err.message === 'Unauthorized') {
        clearSession()
        return navigate('/login')
      }
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 lg:px-8">
      <p className="text-[11px] font-semibold tracking-[0.15em] text-ink/40">NOUVEAU</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight">Créer un prompt</h1>
      <p className="mt-1 text-ink/60">Écrivez un prompt réutilisable. Utilisez [crochets] pour les parties à compléter.</p>

      <form onSubmit={submit} className="mt-8 space-y-5 rounded-3xl border border-black/5 bg-white p-6 shadow-sm">
        <div>
          <label className="mb-1.5 block text-sm font-semibold" htmlFor="titre">Titre</label>
          <input id="titre" name="titre" value={form.titre} onChange={change} maxLength={80} required
            placeholder="Ex. : Plan de semaine" className={field} />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-semibold" htmlFor="categorie">Catégorie</label>
          <select id="categorie" name="categorie" value={form.categorie} onChange={change} className={field}>
            {CATEGORY_NAMES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-semibold" htmlFor="description">Description courte</label>
          <input id="description" name="description" value={form.description} onChange={change} maxLength={200} required
            placeholder="Ce que fait ce prompt, en une phrase" className={field} />
          <p className="mt-1 text-right text-xs text-ink/40">{form.description.length}/200</p>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-semibold" htmlFor="contenu">Contenu du prompt</label>
          <textarea id="contenu" name="contenu" value={form.contenu} onChange={change} maxLength={4000} required rows={7}
            placeholder="Rédige un article sur le sujet suivant : [sujet]" className={`${field} resize-y`} />
          <p className="mt-1 text-right text-xs text-ink/40">{form.contenu.length}/4000</p>
        </div>

        {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}

        <div className="flex justify-end gap-3">
          <button type="button" onClick={() => navigate(-1)}
            className="rounded-xl border border-black/10 px-5 py-3 text-sm font-medium hover:bg-side">
            Annuler
          </button>
          <button disabled={loading}
            className="rounded-xl bg-brand px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-dark disabled:opacity-60">
            {loading ? 'Création...' : 'Créer le prompt'}
          </button>
        </div>
      </form>
    </div>
  )
}