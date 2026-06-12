import { Trophy } from 'lucide-react'

interface WelcomeScreenProps {
  onEnter: () => void
}

export function WelcomeScreen({ onEnter }: WelcomeScreenProps) {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-gradient-to-b from-[#1a3a1a] via-[#0d2b0d] to-[#0a1f0a] p-8 text-center">
      <div className="mb-8 flex flex-col items-center gap-6">
        <div className="relative">
          <div className="absolute inset-0 blur-3xl opacity-30 bg-green-500" />
          <Trophy className="relative size-32 text-yellow-400 drop-shadow-[0_0_30px_rgba(250,204,21,0.3)]" strokeWidth={1} />
        </div>
        <div className="flex flex-col items-center gap-2">
          <h1 className="text-5xl font-black tracking-tight text-white">
            <span className="text-green-400">26</span>
          </h1>
          <p className="text-sm font-medium uppercase tracking-[0.3em] text-green-300/80">World Cup</p>
        </div>
      </div>
      <h2 className="mb-4 text-2xl font-bold text-white">FIFA World Cup</h2>
      <h3 className="mb-6 text-3xl font-black text-green-400">Mexico 2026</h3>
      <p className="mb-8 max-w-sm text-sm leading-relaxed text-green-100/60">
        The 104 matches of the FIFA World Cup 2026 tournament will be organized in 16 football stadiums in United States, Canada, Mexico.
      </p>
      <button
        onClick={onEnter}
        className="group flex size-16 items-center justify-center rounded-full bg-green-500 text-white shadow-lg shadow-green-500/30 transition-all hover:bg-green-400 hover:shadow-green-400/40 hover:scale-105"
      >
        <svg className="size-6 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
        </svg>
      </button>
    </div>
  )
}
