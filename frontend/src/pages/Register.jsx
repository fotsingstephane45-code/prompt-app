import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { request, saveSession } from '../api'
import AuthLayout from '../components/AuthLayout'

const field =
  'w-full rounded-xl border border-black/10 bg-white px-4 py-3 outline-none focus:border-brand focus:ring-2 focus:ring-brand/20'

export default function Register() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ nom: '', prenom: '', email: '', motDePasse: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const data = await request('/auth/register', { method: 'POST', body: JSON.stringify(form) })
      saveSession(data)
      navigate('/')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout
      title="Créer un compte"
      subtitle="Rejoignez Promptly en quelques secondes."
      footer={
        <>
          Déjà inscrit ?{' '}
          <Link to="/login" className="font-semibold text-brand hover:underline">
            Se connecter
          </Link>
        </>
      }
    >
      <form onSubmit={submit} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <input className={field} name="prenom" placeholder="Prénom" value={form.prenom} onChange={change} required />
          <input className={field} name="nom" placeholder="Nom" value={form.nom} onChange={change} required />
        </div>
        <input className={field} type="email" name="email" placeholder="Email" value={form.email} onChange={change} required />
        <input className={field} type="password" name="motDePasse" placeholder="Mot de passe (6 caractères min.)" value={form.motDePasse} onChange={change} required minLength={6} />

        {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}

        <button
          disabled={loading}
          className="w-full rounded-xl bg-brand py-3 font-semibold text-white shadow-md transition hover:bg-brand-dark disabled:opacity-60"
        >
          {loading ? 'Création...' : "S'inscrire"}
        </button>
      </form>
    </AuthLayout>
  )
}