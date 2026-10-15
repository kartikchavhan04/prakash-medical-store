import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowUpRight, Package, Users, Mail, UserRound, TrendingUp,
  Plus, ArrowRight, RefreshCw,
} from 'lucide-react'
import api from '../api'
import toast from 'react-hot-toast'

const tiles = [
  { key: 'products', title: 'Products listed', icon: Package, note: 'In your product catalogue', tone: 'green', to: '/admin/products' },
  { key: 'staff', title: 'Staff cards', icon: Users, note: 'Shown on the contact page', tone: 'blue', to: '/admin/staff' },
  { key: 'customers', title: 'Customer accounts', icon: UserRound, note: 'Registered on your website', tone: 'violet', to: null },
  { key: 'unread_messages', title: 'Unread messages', icon: Mail, note: 'Customer enquiries to review', tone: 'orange', to: '/admin/messages' },
]

const toneMap = {
  green:  'bg-emerald-100 text-emerald-700',
  blue:   'bg-blue-100 text-blue-700',
  violet: 'bg-violet-100 text-violet-700',
  orange: 'bg-orange-100 text-orange-600',
}

const quickToneMap = {
  green:  'bg-emerald-100 text-emerald-700',
  blue:   'bg-blue-100 text-blue-700',
  orange: 'bg-orange-100 text-orange-600',
}

export default function AdminDashboard() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  const load = () => {
    setLoading(true)
    api.get('/admin/stats')
      .then(({ data }) => setStats(data))
      .catch(err => toast.error(err.response?.data?.message || 'Could not load dashboard metrics.'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50/40 via-white to-emerald-50/30 px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-8">

        {/* ================= PAGE HEADING ================= */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <span className="mb-3 inline-block rounded-full bg-emerald-100 px-3 py-1.5 text-[0.68rem] font-bold uppercase tracking-[0.18em] text-emerald-700">
              Overview
            </span>
            <h1 className="text-2xl font-extrabold leading-tight tracking-tight text-emerald-950 sm:text-3xl md:text-4xl">
              Good day, <em className="italic text-emerald-600">Admin.</em>
            </h1>
            <p className="mt-1 text-sm text-slate-600 sm:text-base">
              Here's what's happening at your store.
            </p>
          </div>

          <button
            onClick={load}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 self-start rounded-xl border border-emerald-100 bg-white px-5 py-2.5 text-sm font-semibold text-emerald-900 transition hover:border-emerald-400 hover:bg-emerald-50 disabled:cursor-not-allowed disabled:opacity-60 sm:self-auto"
          >
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
            Refresh
          </button>
        </div>

        {/* ================= STATS GRID ================= */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {tiles.map(({ key, title, icon: Icon, note, tone, to }) => (
            <div
              key={key}
              className="group rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-emerald-400 hover:shadow-lg hover:shadow-emerald-500/10"
            >
              <div className={`mb-4 inline-flex h-11 w-11 items-center justify-center rounded-2xl ${toneMap[tone]}`}>
                <Icon size={21} />
              </div>
              <span className="block text-[0.78rem] font-semibold uppercase tracking-wide text-slate-500">
                {title}
              </span>
              <strong className="mt-1 block text-3xl font-extrabold text-emerald-950">
                {loading ? '—' : (stats?.[key] ?? 0)}
              </strong>
              <small className="mt-1 block text-xs leading-relaxed text-slate-500">
                {note}
              </small>
              {to && (
                <Link
                  to={to}
                  className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 transition hover:gap-2.5 hover:text-emerald-500 sm:text-sm"
                >
                  Manage <ArrowUpRight size={14} />
                </Link>
              )}
            </div>
          ))}
        </div>

        {/* ================= WELCOME PANEL ================= */}
        <section className="relative overflow-hidden rounded-3xl border border-emerald-100 bg-gradient-to-br from-emerald-950 via-emerald-900 to-emerald-800 p-6 text-white shadow-2xl shadow-emerald-900/20 sm:p-8 md:p-10">
          <div className="pointer-events-none absolute -top-20 -right-16 h-64 w-64 rounded-full bg-emerald-400/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -left-20 h-64 w-64 rounded-full bg-sky-400/10 blur-3xl" />

          <div className="relative grid grid-cols-1 items-center gap-8 md:grid-cols-[1.3fr_1fr] md:gap-12">
            <div>
              <span className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-[0.68rem] font-bold uppercase tracking-[0.18em] text-emerald-200">
                <TrendingUp size={14} /> Store control centre
              </span>
              <h2 className="text-2xl font-extrabold leading-tight tracking-tight sm:text-3xl md:text-4xl text-white/80">
                Your store. Your control.
              </h2>
              <p className="mt-3 max-w-xl text-sm leading-relaxed text-white/80 sm:text-base">
                Keep your public catalogue up to date, manage the people shown on your
                contact page, and respond to customer enquiries from one place.
              </p>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <Link
                  to="/admin/products"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-500 px-5 py-3 text-sm font-semibold text-emerald-950 shadow-lg shadow-emerald-500/30 transition hover:-translate-y-0.5 hover:shadow-xl sm:text-base"
                >
                  <Plus size={17} /> Add a product
                </Link>
                <Link
                  to="/admin/messages"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/25 bg-white/10 px-5 py-3 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/20 sm:text-base"
                >
                  View messages <ArrowRight size={16} />
                </Link>
              </div>
            </div>

            {/* Art (desktop) */}
            <div className="relative hidden items-center justify-center md:flex">
              <div className="flex h-40 w-40 items-center justify-center rounded-[2.5rem] bg-gradient-to-br from-emerald-400 to-emerald-600 text-white shadow-2xl shadow-emerald-500/40">
                <Package size={57} />
              </div>
              <span className="absolute -bottom-2 inline-flex items-center gap-2 whitespace-nowrap rounded-full border border-white/20 bg-emerald-950/70 px-3.5 py-2 text-xs font-semibold text-emerald-100 shadow-lg backdrop-blur">
                <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
                Dashboard active
              </span>
            </div>
          </div>
        </section>

        {/* ================= BOTTOM GRID ================= */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.5fr_1fr]">

          {/* Quick links */}
          <section className="rounded-3xl border border-emerald-100 bg-white p-5 shadow-sm sm:p-6">
            <div className="mb-5">
              <h3 className="text-lg font-bold text-emerald-950 sm:text-xl">Manage your store</h3>
              <p className="mt-0.5 text-sm text-slate-600">Quick access to everyday tasks.</p>
            </div>

            <div className="flex flex-col gap-3">
              {[
                { to: '/admin/products', tone: 'green',  icon: Package, title: 'Product catalogue', note: 'Add, edit prices, stock and images' },
                { to: '/admin/staff',    tone: 'blue',   icon: Users,   title: 'Team & staff cards', note: 'Maintain contact-page staff profiles' },
                { to: '/admin/messages', tone: 'orange', icon: Mail,    title: 'Customer messages', note: 'Review and respond to enquiries' },
              ].map(({ to, tone, icon: Icon, title, note }) => (
                <Link
                  key={to}
                  to={to}
                  className="group grid grid-cols-[auto_1fr_auto] items-center gap-4 rounded-2xl border border-emerald-100 bg-emerald-50/40 px-4 py-3.5 transition hover:-translate-y-0.5 hover:border-emerald-400 hover:bg-white hover:shadow-md hover:shadow-emerald-500/10"
                >
                  <span className={`flex h-11 w-11 items-center justify-center rounded-2xl ${quickToneMap[tone]}`}>
                    <Icon size={19} />
                  </span>
                  <span className="flex flex-col min-w-0">
                    <b className="text-sm font-semibold text-emerald-950 sm:text-[0.95rem]">{title}</b>
                    <small className="truncate text-xs text-slate-500">{note}</small>
                  </span>
                  <ArrowRight size={16} className="text-emerald-600 transition group-hover:translate-x-1" />
                </Link>
              ))}
            </div>
          </section>

          {/* Reminder panel */}
          <section className="relative flex flex-col overflow-hidden rounded-3xl border border-orange-100 bg-gradient-to-br from-orange-50 via-white to-orange-50/60 p-5 shadow-sm sm:p-6">
            <div className="pointer-events-none absolute -top-16 -right-16 h-48 w-48 rounded-full bg-orange-200/40 blur-3xl" />

            <span className="relative mb-4 inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-orange-100 text-orange-600">
              <Mail size={20} />
            </span>

            <h3 className="relative text-lg font-bold text-emerald-950 sm:text-xl">
              Stay on top of enquiries
            </h3>
            <p className="relative mt-2 text-sm leading-relaxed text-slate-600">
              New messages from the Contact page are stored here for you to review.
            </p>

            <div className="relative mt-5 flex items-baseline gap-2 rounded-2xl border border-orange-100 bg-white px-4 py-3">
              <strong className="text-3xl font-extrabold text-orange-600">
                {loading ? '—' : (stats?.unread_messages ?? 0)}
              </strong>
              <span className="text-sm font-medium text-slate-500">unread messages</span>
            </div>

            <Link
              to="/admin/messages"
              className="relative mt-5 inline-flex items-center gap-2 text-sm font-bold text-emerald-700 transition hover:gap-3 hover:text-emerald-500 sm:text-base"
            >
              Open message inbox <ArrowRight size={16} />
            </Link>
          </section>
        </div>

        {/* ================= SECURE NOTE ================= */}
        <p className="rounded-2xl border border-emerald-100 bg-emerald-50/60 px-4 py-3 text-center text-xs leading-relaxed text-emerald-900/80 sm:text-sm">
          Access is restricted to the administrator account configured on the backend.
          Keep the admin password private.
        </p>
      </div>
    </div>
  )
}