import { Link } from 'react-router-dom'
import { HeartPulse, MapPin, Phone, Mail, Clock, ArrowUpRight } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-gradient-to-br from-emerald-950 via-emerald-900 to-emerald-950 text-white">

      {/* dotted pattern */}
      <div
        className="pointer-events-none absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.25) 1px, transparent 0)',
          backgroundSize: '22px 22px',
        }}
      />

      {/* glow blobs */}
      <div className="pointer-events-none absolute -top-32 -right-24 h-80 w-80 rounded-full bg-emerald-400/15 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -left-24 h-80 w-80 rounded-full bg-sky-400/10 blur-3xl" />

      {/* emerald top accent line */}
      <div className="h-1 w-full bg-gradient-to-r from-transparent via-emerald-400 to-transparent" />

      {/* ================= MAIN GRID ================= */}
      <div className="container relative mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-14">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1.2fr] lg:gap-12">

          {/* ---------- BRAND ---------- */}
          <div>
            <Link to="/" className="inline-flex items-center gap-2.5">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 text-emerald-950 shadow-lg shadow-emerald-500/30">
                <HeartPulse size={22} />
              </span>
              <span className="flex flex-col leading-tight">
                <strong className="text-base font-extrabold tracking-tight text-white">
                  Prakash Medical
                </strong>
                <small className="text-[0.62rem] font-bold tracking-[0.14em] text-emerald-300">
                  AND GENERAL STORE
                </small>
              </span>
            </Link>

            <p className="mt-4 max-w-sm text-sm leading-relaxed text-emerald-50/75">
              तुमच्या कुटुंबाच्या आरोग्यासाठी आणि रोजच्या गरजांसाठी विश्वासार्ह दुकान.
            </p>

            <span className="mt-5 inline-flex items-center gap-2 rounded-full border border-emerald-700/50 bg-emerald-900/50 px-3.5 py-2 text-xs font-semibold text-emerald-100 backdrop-blur sm:text-sm">
              <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.9)]" />
              Your neighbourhood care partner
            </span>
          </div>

          {/* ---------- EXPLORE ---------- */}
          <div>
            <h4 className="mb-4 text-xs font-bold uppercase tracking-[0.18em] text-emerald-300 sm:text-sm">
              Explore
            </h4>
            <ul className="flex flex-col gap-3">
              <li>
                <Link
                  to="/products"
                  className="group inline-flex items-center gap-1.5 text-sm text-emerald-50/80 transition hover:gap-2.5 hover:text-white"
                >
                  Browse products
                  <ArrowUpRight size={14} className="text-emerald-400 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="text-sm text-emerald-50/80 transition hover:text-white"
                >
                  About our store
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="text-sm text-emerald-50/80 transition hover:text-white"
                >
                  Contact us
                </Link>
              </li>
              <li>
                <Link
                  to="/login"
                  className="text-sm text-emerald-50/80 transition hover:text-white"
                >
                  My account
                </Link>
              </li>
            </ul>
          </div>

          {/* ---------- CONTACT ---------- */}
          <div>
            <h4 className="mb-4 text-xs font-bold uppercase tracking-[0.18em] text-emerald-300 sm:text-sm">
              Visit our store
            </h4>
            <ul className="flex flex-col gap-3 text-sm">
              <li className="flex items-start gap-2.5 text-emerald-50/80">
                <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-emerald-800/60 text-emerald-300 ring-1 ring-emerald-700/50">
                  <MapPin size={14} />
                </span>
                <span className="leading-relaxed">Hanuman Nagar, Kumbhari</span>
              </li>

              <li className="flex items-start gap-2.5 text-emerald-50/80">
                <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-emerald-800/60 text-emerald-300 ring-1 ring-emerald-700/50">
                  <Phone size={14} />
                </span>
                <a
                  href="tel:9765428720"
                  className="leading-relaxed transition hover:text-white"
                >
                  9765428720
                </a>
              </li>

              <li className="flex items-start gap-2.5 text-emerald-50/80">
                <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-emerald-800/60 text-emerald-300 ring-1 ring-emerald-700/50">
                  <Mail size={14} />
                </span>
                <a
                  href="mailto:dp0088238@gmail.com"
                  className="break-all leading-relaxed transition hover:text-white"
                >
                  dp0088238@gmail.com
                </a>
              </li>

              <li className="flex items-start gap-2.5 text-emerald-50/80">
                <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-emerald-800/60 text-emerald-300 ring-1 ring-emerald-700/50">
                  <Clock size={14} />
                </span>
                <span className="leading-relaxed">Store hours may vary</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* ================= BOTTOM BAR ================= */}
      <div className="relative border-t border-emerald-800/60 bg-emerald-950/60">
        <div className="container mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-4 py-5 text-center text-xs text-emerald-100/70 sm:flex-row sm:px-6 sm:text-left sm:text-sm">
          <span>
            © {new Date().getFullYear()} Prakash Medical and General Store
          </span>
          <span className="inline-flex items-center gap-1.5">
            Made with care
            <HeartPulse size={14} className="text-red-400" />
          </span>
        </div>
      </div>
    </footer>
  )
}