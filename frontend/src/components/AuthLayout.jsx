import { Sparkles } from 'lucide-react'

export default function AuthLayout({ title, subtitle, children, footer }) {
  return (
    <div className="grid min-h-screen bg-canvas text-ink lg:grid-cols-2">
      {/* Panneau de présentation (ordinateur uniquement) */}
      <div className="relative hidden flex-col justify-between overflow-hidden bg-brand p-12 text-white lg:flex">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15">
            <Sparkles size={20} />
          </div>
          <span className="text-2xl font-semibold tracking-tight">Promptly</span>
        </div>
        <div>
          <h2 className="max-w-md text-4xl font-semibold leading-tight tracking-tight">
            Des prompts qui font la différence.
          </h2>
          <p className="mt-4 max-w-md text-white/70">
            Explorez une bibliothèque de prompts, créez les vôtres et dialoguez avec l'IA.
          </p>
        </div>
        <p className="text-sm text-white/50">© Promptly</p>
        <div className="pointer-events-none absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-white/5" />
      </div>

      {/* Formulaire */}
      <div className="flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-md">
          <div className="mb-8 flex items-center gap-3 lg:hidden">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand text-white">
              <Sparkles size={20} />
            </div>
            <span className="text-2xl font-semibold tracking-tight">Promptly</span>
          </div>

          <h1 className="text-3xl font-semibold tracking-tight">{title}</h1>
          <p className="mt-1.5 text-ink/60">{subtitle}</p>

          <div className="mt-8">{children}</div>
          <div className="mt-6 text-center text-sm text-ink/60">{footer}</div>
        </div>
      </div>
    </div>
  )
}