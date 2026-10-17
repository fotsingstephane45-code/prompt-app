import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { clearSession, request } from '../api'

export default function Home() {
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem('user') || '{}')

  const [messages, setMessages] = useState([]) // { question, answer, error }
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef(null)

  // Descend automatiquement vers le dernier message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  const logout = () => {
    clearSession()
    navigate('/login')
  }

  const send = async () => {
    const question = text.trim()
    if (!question || loading) return

    setText('')
    setLoading(true)
    setMessages((m) => [...m, { question }])

    try {
      const { answer } = await request('/prompts', {
        method: 'POST',
        body: JSON.stringify({ question }),
      })
      setMessages((m) => m.map((x, i) => (i === m.length - 1 ? { ...x, answer } : x)))
    } catch (err) {
      // Jeton expiré ou invalide : retour à la connexion
      if (err.message === 'Unauthorized') return logout()
      setMessages((m) => m.map((x, i) => (i === m.length - 1 ? { ...x, error: err.message } : x)))
    } finally {
      setLoading(false)
    }
  }

  // Entrée = envoyer, Maj+Entrée = nouvelle ligne
  const onKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      send()
    }
  }

  return (
    <div className="flex h-screen flex-col bg-[#faf9f5]">
      {/* En-tête */}
      <header className="flex items-center justify-between px-6 py-4">
        <span className="font-serif text-xl text-stone-800">Prompt</span>
        <button
          onClick={logout}
          className="rounded-lg px-3 py-1.5 text-sm text-stone-600 hover:bg-stone-200/60"
        >
          Déconnexion
        </button>
      </header>

      {/* Zone de conversation */}
      <main className="flex-1 overflow-y-auto px-4">
        <div className="mx-auto flex h-full max-w-3xl flex-col">
          {messages.length === 0 ? (
            <div className="flex flex-1 items-center justify-center">
              <h1 className="font-serif text-4xl text-stone-800">
                <span className="text-[#c96442]">✻</span> Bonjour, {user.prenom}
              </h1>
            </div>
          ) : (
            <div className="space-y-6 py-6">
              {messages.map((m, i) => (
                <div key={i} className="space-y-4">
                  <div className="ml-auto w-fit max-w-[85%] whitespace-pre-wrap rounded-2xl bg-stone-200/70 px-4 py-3 text-stone-800">
                    {m.question}
                  </div>
                  {m.answer && (
                    <div className="whitespace-pre-wrap leading-relaxed text-stone-800">{m.answer}</div>
                  )}
                  {m.error && (
                    <div className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{m.error}</div>
                  )}
                </div>
              ))}
              {loading && <div className="animate-pulse text-stone-500">L'IA réfléchit...</div>}
              <div ref={bottomRef} />
            </div>
          )}
        </div>
      </main>

      {/* Barre de prompt */}
      <footer className="px-4 pb-6">
        <div className="mx-auto flex max-w-3xl items-end gap-2 rounded-3xl bg-white p-3 shadow-md ring-1 ring-stone-200 focus-within:ring-stone-400">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={onKeyDown}
            rows={1}
            placeholder="Posez votre question..."
            className="max-h-40 flex-1 resize-none bg-transparent px-2 py-2 text-stone-800 outline-none placeholder:text-stone-400"
          />
          <button
            onClick={send}
            disabled={loading || !text.trim()}
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#c96442] text-white transition hover:bg-[#b5583a] disabled:opacity-40"
            aria-label="Envoyer"
          >
            ↑
          </button>
        </div>
      </footer>
    </div>
  )
}