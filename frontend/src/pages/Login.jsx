import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { request, saveSession } from '../api'
import AuthLayout from '../components/AuthLayout'

const field =
  'w-full rounded-xl border border-black/10 bg-white px-4 py-3 outline-none focus:border-brand focus:ring-2 focus:ring-brand/20'

export default function Login() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', motDePasse: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const data = await request('/auth/login', { method: 'POST', body: JSON.stringify(form) })
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
      title="Bon retour"
      subtitle="Connectez-vous pour retrouver vos prompts."
      footer={
        <>
          Pas encore de compte ?{' '}
          <Link to="/register" className="font-semibold text-brand hover:underline">
            S'inscrire
          </Link>
        </>
      }
    >
      <form onSubmit={submit} className="space-y-4">
        <input className={field} type="email" name="email" placeholder="Email" value={form.email} onChange={change} required />
        <input className={field} type="password" name="motDePasse" placeholder="Mot de passe" value={form.motDePasse} onChange={change} required />

        {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}

        <button
          disabled={loading}
          className="w-full rounded-xl bg-brand py-3 font-semibold text-white shadow-md transition hover:bg-brand-dark disabled:opacity-60"
        >
          {loading ? 'Connexion...' : 'Se connecter'}
        </button>
      </form>
    </AuthLayout>
  )
}