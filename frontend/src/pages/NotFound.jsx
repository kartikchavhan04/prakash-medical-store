import { Link } from 'react-router-dom'
import { ArrowLeft, HeartPulse } from 'lucide-react'

export default function NotFound() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-emerald-50/40 via-white to-emerald-50/30 px-4 py-16 text-center text-slate-800 sm:px-6">

      {/* dotted pattern */}
      <div
        className="pointer-events-none absolute inset-0 opacity-50"
        style={{
          backgroundImage:
            'radial-gradient(circle at 1px 1px, rgba(15,157,118,0.12) 1px, transparent 0)',
          backgroundSize: '22px 22px',
        }}
      />

      {/* glow blobs */}
      <div className="pointer-events-none absolute -top-24 -right-24 h-80 w-80 rounded-full bg-emerald-200/40 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -left-24 h-80 w-80 rounded-full bg-sky-200/40 blur-3xl" />

      <div className="relative flex max-w-lg flex-col items-center">

        {/* Icon */}
        <span className="mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-emerald-500 to-emerald-700 text-white shadow-2xl shadow-emerald-500/40">
          <HeartPulse size={35} />
        </span>

        {/* Eyebrow */}
        <span className="mb-4 inline-block rounded-full bg-emerald-100 px-3 py-1.5 text-[0.68rem] font-bold uppercase tracking-[0.18em] text-emerald-700">
          404 · Page not found
        </span>

        {/* Heading */}
        <h1 className="mb-4 text-3xl font-extrabold leading-[1.15] tracking-tight text-emerald-950 sm:text-4xl md:text-5xl">
          This page took a
          <br />
          <em className="italic text-emerald-600">wrong turn.</em>
        </h1>

        {/* Subtitle */}
        <p className="mb-8 max-w-md text-sm leading-relaxed text-slate-600 sm:text-base">
          The page you are looking for doesn't exist or may have moved.
        </p>

        {/* Button */}
        <Link
          to="/"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-emerald-500/25 transition hover:-translate-y-0.5 hover:shadow-xl hover:shadow-emerald-500/35 sm:text-base"
        >
          <ArrowLeft size={17} /> Back to home
        </Link>
      </div>
    </main>
  )
}