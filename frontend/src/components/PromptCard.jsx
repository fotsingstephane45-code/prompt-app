import { Bookmark, Copy, Heart } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { request } from '../api'
import { CATEGORIES } from '../categories'

const fmt = (n) => (n >= 1000 ? (n / 1000).toFixed(1).replace('.', ',') + 'k' : String(n))
const initials = (name) => name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase()

export default function PromptCard({ t, onChange }) {
  const navigate = useNavigate()
  const c = CATEGORIES[t.categorie] || { bg: '#eee', fg: '#444' }

  // "like" ou "save" : le backend renvoie le prompt mis à jour
  const toggle = async (action) => {
    try {
      const updated = await request(`/templates/${t.id}/${action}`, { method: 'POST' })
      onChange(updated)
      if (action === 'save') window.dispatchEvent(new Event('mine-changed'))
    } catch (err) {
      console.error(err)
    }
  }

  const use = () => navigate('/chat', { state: { prompt: t.contenu } })

  return (
    <article className="flex flex-col rounded-3xl border border-black/5 bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between">
        <span
          className="rounded-md px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide"
          style={{ background: c.bg, color: c.fg }}
        >
          {t.categorie}
        </span>
        <button
          onClick={() => toggle('save')}
          aria-label={t.saved ? 'Retirer de mes prompts' : 'Enregistrer'}
          className="rounded-lg p-1 text-ink/50 hover:bg-canvas"
        >
          <Bookmark size={20} className={t.saved ? 'fill-brand text-brand' : ''} />
        </button>
      </div>

      <h3 className="mt-4 text-xl font-semibold tracking-tight">{t.titre}</h3>
      <p className="mt-2 text-sm leading-relaxed text-ink/60">{t.description}</p>

      <div className="mt-5 rounded-2xl bg-side px-4 py-3">
        <p className="line-clamp-3 text-xs leading-relaxed text-ink/50">{t.contenu}</p>
      </div>

      <div className="mt-5 flex items-center gap-3 border-t border-black/5 pt-4">
        <div
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-semibold"
          style={{ background: c.bg, color: c.fg }}
        >
          {initials(t.auteurNom)}
        </div>
        <div className="min-w-0 flex-1 leading-tight">
          <p className="text-[11px] text-ink/40">Par</p>
          <p className="truncate text-sm font-semibold">{t.auteurNom}</p>
        </div>
        <button onClick={() => toggle('like')} className="flex items-center gap-1.5 text-sm text-ink/50" aria-label="J'aime">
          <Heart size={18} className={t.liked ? 'fill-red-500 text-red-500' : ''} />
          {fmt(t.likesCount)}
        </button>
        <button
          onClick={use}
          className="flex items-center gap-1.5 rounded-xl bg-ink px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-black"
        >
          <Copy size={14} /> Utiliser
        </button>
      </div>
    </article>
  )
}