import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { request, saveSession } from '../api'

const input =
  'w-full rounded-xl border border-stone-300 bg-white px-4 py-3 outline-none focus:border-[#c96442] focus:ring-2 focus:ring-[#c96442]/20'

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
      const data = await request('/auth/login', {
        method: 'POST',
        body: JSON.stringify(form),
      })
      saveSession(data)
      navigate('/')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#faf9f5] px-4">
      <form
        onSubmit={submit}
        className="w-full max-w-md space-y-4 rounded-2xl bg-white p-8 shadow-sm ring-1 ring-stone-200"
      >
        <h1 className="text-center font-serif text-3xl text-stone-800">Connexion</h1>

        <input className={input} type="email" name="email" placeholder="Email" value={form.email} onChange={change} required />
        <input className={input} type="password" name="motDePasse" placeholder="Mot de passe" value={form.motDePasse} onChange={change} required />

        {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}

        <button
          disabled={loading}
          className="w-full rounded-xl bg-[#c96442] py-3 font-medium text-white transition hover:bg-[#b5583a] disabled:opacity-60"
        >
          {loading ? 'Connexion...' : 'Se connecter'}
        </button>

        <p className="text-center text-sm text-stone-600">
          Pas encore de compte ?{' '}
          <Link to="/register" className="font-medium text-[#c96442] hover:underline">
            S'inscrire
          </Link>
        </p>
      </form>
    </div>
  )
}