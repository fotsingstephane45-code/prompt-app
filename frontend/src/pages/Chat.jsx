import { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Sparkles } from 'lucide-react'
import { clearSession, request } from '../api'

export default function Chat() {
  const navigate = useNavigate()
  const location = useLocation()
  const user = JSON.parse(localStorage.getItem('user') || '{}')

  const [messages, setMessages] = useState([]) // { question, answer, error }
  const [text, setText] = useState(location.state?.prompt || '') // prompt venu du bouton "Utiliser"
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  const send = async () => {
    const question = text.trim()
    if (!question || loading) return

    setText('')
    setLoading(true)
    setMessages((m) => [...m, { question }])

    try {
      const { answer } = await request('/prompts', { method: 'POST', body: JSON.stringify({ question }) })
      setMessages((m) => m.map((x, i) => (i === m.length - 1 ? { ...x, answer } : x)))
    } catch (err) {
      if (err.message === 'Unauthorized') {
        clearSession()
        return navigate('/login')
      }
      setMessages((m) => m.map((x, i) => (i === m.length - 1 ? { ...x, error: err.message } : x)))
    } finally {
      setLoading(false)
    }
  }

  const onKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      send()
    }
  }

  return (
    <div className="flex h-[calc(100vh-72px)] flex-col">
      <main className="flex-1 overflow-y-auto px-4">
        <div className="mx-auto flex h-full max-w-3xl flex-col">
          {messages.length === 0 ? (
            <div className="flex flex-1 flex-col items-center justify-center text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand text-white">
                <Sparkles size={26} />
              </div>
              <h1 className="mt-5 text-4xl font-semibold tracking-tight">Bonjour, {user.prenom}</h1>
              <p className="mt-2 text-ink/60">Posez une question, ou complétez le prompt choisi puis envoyez-le.</p>
            </div>
          ) : (
            <div className="space-y-6 py-6">
              {messages.map((m, i) => (
                <div key={i} className="space-y-4">
                  <div className="ml-auto w-fit max-w-[85%] whitespace-pre-wrap rounded-2xl bg-brand-soft px-4 py-3">
                    {m.question}
                  </div>
                  {m.answer && <div className="whitespace-pre-wrap leading-relaxed">{m.answer}</div>}
                  {m.error && <div className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{m.error}</div>}
                </div>
              ))}
              {loading && <div className="animate-pulse text-ink/50">L'IA réfléchit...</div>}
              <div ref={bottomRef} />
            </div>
          )}
        </div>
      </main>

      <footer className="px-4 pb-6">
        <div className="mx-auto flex max-w-3xl items-end gap-2 rounded-3xl bg-white p-3 shadow-md ring-1 ring-black/10 focus-within:ring-brand/50">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={onKeyDown}
            rows={text.includes('\n') || text.length > 90 ? 4 : 1}
            placeholder="Posez votre question..."
            className="max-h-48 flex-1 resize-none bg-transparent px-2 py-2 outline-none placeholder:text-ink/40"
          />
          <button
            onClick={send}
            disabled={loading || !text.trim()}
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand text-white transition hover:bg-brand-dark disabled:opacity-40"
            aria-label="Envoyer"
          >
            ↑
          </button>
        </div>
      </footer>
    </div>
  )
}