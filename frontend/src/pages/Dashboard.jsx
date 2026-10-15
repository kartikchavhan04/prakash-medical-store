import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  HeartPulse, UserRound, Mail, Phone, CalendarDays,
  PackageSearch, ArrowRight, LogOut, ShieldCheck,
} from 'lucide-react'
import toast from 'react-hot-toast'
import api from '../api'
import { useAuth } from '../auth'

export default function Dashboard() {
  const { user, logout } = useAuth()
  const [profile, setProfile] = useState(user)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    api.get('/auth/me')
      .then(({ data }) => {
        setProfile(data.user)
        localStorage.setItem('user', JSON.stringify(data.user))
      })
      .catch(() => {
        toast.error('Please sign in again.')
        logout()
        navigate('/login')
      })
      .finally(() => setLoading(false))
  }, [])

  const signOut = () => {
    logout()
    toast.success('You have signed out.')
    navigate('/')
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-emerald-50/40 via-white to-emerald-50/30 text-slate-800">

      {/* ================= WELCOME ================= */}
      <section className="relative overflow-hidden border-b border-emerald-100/70 bg-gradient-to-br from-white via-emerald-50/50 to-sky-50/40">
        <div
          className="pointer-events-none absolute inset-0 opacity-50"
          style={{
            backgroundImage:
              'radial-gradient(circle at 1px 1px, rgba(15,157,118,0.12) 1px, transparent 0)',
            backgroundSize: '22px 22px',
          }}
        />
        <div className="pointer-events-none absolute -top-32 -right-24 h-80 w-80 rounded-full bg-emerald-200/40 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 -left-24 h-80 w-80 rounded-full bg-sky-200/40 blur-3xl" />

        <div className="container relative mx-auto flex max-w-6xl flex-col items-start gap-6 px-4 py-10 sm:px-6 sm:py-12 md:flex-row md:items-center md:justify-between md:gap-10 md:py-16">
          <div className="w-full">
            <span className="mb-4 inline-block rounded-full bg-emerald-100 px-3 py-1.5 text-[0.68rem] font-bold uppercase tracking-[0.18em] text-emerald-700">
              Your customer space
            </span>
            <h1 className="mb-3 text-3xl font-extrabold leading-tight tracking-tight text-emerald-950 sm:text-4xl md:text-5xl">
              Hello,{' '}
              <em className="italic text-emerald-600">
                {profile?.name?.split(' ')[0] || 'there'}.
              </em>
            </h1>
            <p className="max-w-xl text-base leading-relaxed text-slate-600 sm:text-lg">
              Welcome to your Prakash Medical account.
            </p>
          </div>

          <button
            onClick={signOut}
            className="inline-flex items-center justify-center gap-2 self-start rounded-xl border border-emerald-100 bg-white px-5 py-3 text-sm font-semibold text-emerald-900 shadow-sm transition hover:-translate-y-0.5 hover:border-emerald-400 hover:bg-emerald-50 hover:shadow-md sm:self-auto sm:text-base"
          >
            <LogOut size={16} /> Sign out
          </button>
        </div>
      </section>

      {/* ================= CONTENT ================= */}
      <div className="container mx-auto max-w-6xl space-y-6 px-4 py-10 sm:px-6 sm:py-12">

        {/* ---------- SUMMARY BANNER ---------- */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-950 via-emerald-900 to-emerald-800 p-6 text-white shadow-2xl shadow-emerald-900/20 sm:p-8 md:p-10">
          <div className="pointer-events-none absolute -top-20 -right-16 h-64 w-64 rounded-full bg-emerald-400/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -left-20 h-64 w-64 rounded-full bg-sky-400/10 blur-3xl" />

          <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:gap-6">
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/15 text-emerald-200 backdrop-blur">
              <HeartPulse size={26} />
            </span>

            <div className="min-w-0 flex-1">
              <span className="mb-1.5 inline-block text-[0.68rem] font-bold uppercase tracking-[0.18em] text-emerald-200">
                Account status
              </span>
              <h2 className="text-xl font-extrabold leading-tight tracking-tight sm:text-2xl md:text-3xl text-white/80">
                Your local store, just a little closer.
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-white/80 sm:text-base">
                Use this space to view your account details and find store information
                when you need it.
              </p>
            </div>

            <span className="hidden shrink-0 text-emerald-300/80 sm:block">
              <ShieldCheck size={27} />
            </span>
          </div>
        </div>

        {/* ---------- TWO COLUMN GRID ---------- */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">

          {/* ---------- PROFILE DETAILS ---------- */}
          <section className="rounded-3xl border border-emerald-100 bg-white p-5 shadow-lg shadow-emerald-500/5 sm:p-6 md:p-7">

            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <span className="mb-2 inline-block rounded-full bg-emerald-100 px-3 py-1.5 text-[0.68rem] font-bold uppercase tracking-[0.18em] text-emerald-700">
                  Profile details
                </span>
                <h3 className="text-lg font-extrabold tracking-tight text-emerald-950 sm:text-xl">
                  Your information
                </h3>
              </div>

              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
                <UserRound size={20} />
              </span>
            </div>

            {loading ? (
              <p className="py-6 text-center text-sm text-slate-500">
                Loading profile…
              </p>
            ) : (
              <div className="flex flex-col gap-3">

                {/* Full name */}
                <div className="rounded-2xl border border-emerald-100 bg-emerald-50/40 px-4 py-3">
                  <span className="block text-[0.68rem] font-bold uppercase tracking-wide text-slate-500">
                    Full name
                  </span>
                  <b className="mt-1 block break-words text-sm font-bold text-emerald-950 sm:text-base">
                    {profile?.name || '—'}
                  </b>
                </div>

                {/* Email */}
                <div className="rounded-2xl border border-emerald-100 bg-emerald-50/40 px-4 py-3">
                  <span className="block text-[0.68rem] font-bold uppercase tracking-wide text-slate-500">
                    Email address
                  </span>
                  <b className="mt-1 flex items-center gap-2 break-all text-sm font-bold text-emerald-950 sm:text-base">
                    <Mail size={15} className="shrink-0 text-emerald-600" />
                    {profile?.email || '—'}
                  </b>
                </div>

                {/* Mobile */}
                <div className="rounded-2xl border border-emerald-100 bg-emerald-50/40 px-4 py-3">
                  <span className="block text-[0.68rem] font-bold uppercase tracking-wide text-slate-500">
                    Mobile number
                  </span>
                  <b className="mt-1 flex items-center gap-2 break-words text-sm font-bold text-emerald-950 sm:text-base">
                    <Phone size={15} className="shrink-0 text-emerald-600" />
                    {profile?.mobile || '—'}
                  </b>
                </div>

                {/* Member since */}
                <div className="rounded-2xl border border-emerald-100 bg-emerald-50/40 px-4 py-3">
                  <span className="block text-[0.68rem] font-bold uppercase tracking-wide text-slate-500">
                    Member since
                  </span>
                  <b className="mt-1 flex items-center gap-2 text-sm font-bold text-emerald-950 sm:text-base">
                    <CalendarDays size={15} className="shrink-0 text-emerald-600" />
                    {profile?.created_at
                      ? new Date(profile.created_at).toLocaleDateString('en-IN', {
                          day: '2-digit', month: 'short', year: 'numeric',
                        })
                      : '—'}
                  </b>
                </div>
              </div>
            )}
          </section>

          {/* ---------- QUICK LINKS ---------- */}
          <section className="rounded-3xl border border-emerald-100 bg-white p-5 shadow-lg shadow-emerald-500/5 sm:p-6 md:p-7">
            <div className="mb-5">
              <span className="mb-2 inline-block rounded-full bg-emerald-100 px-3 py-1.5 text-[0.68rem] font-bold uppercase tracking-[0.18em] text-emerald-700">
                Quick links
              </span>
              <h3 className="text-lg font-extrabold tracking-tight text-emerald-950 sm:text-xl">
                What would you like to do?
              </h3>
            </div>

            <div className="flex flex-col gap-3">

              {/* Products */}
              <Link
                to="/products"
                className="group grid grid-cols-[auto_1fr_auto] items-center gap-4 rounded-2xl border border-emerald-100 bg-emerald-50/40 px-4 py-3.5 transition hover:-translate-y-0.5 hover:border-emerald-400 hover:bg-white hover:shadow-md hover:shadow-emerald-500/10"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
                  <PackageSearch size={19} />
                </span>
                <span className="flex min-w-0 flex-col">
                  <b className="text-sm font-semibold text-emerald-950 sm:text-[0.95rem]">
                    Browse product catalogue
                  </b>
                  <small className="truncate text-xs text-slate-500">
                    Explore medical and general products
                  </small>
                </span>
                <ArrowRight size={16} className="text-emerald-600 transition group-hover:translate-x-1" />
              </Link>

              {/* Contact */}
              <Link
                to="/contact"
                className="group grid grid-cols-[auto_1fr_auto] items-center gap-4 rounded-2xl border border-emerald-100 bg-emerald-50/40 px-4 py-3.5 transition hover:-translate-y-0.5 hover:border-emerald-400 hover:bg-white hover:shadow-md hover:shadow-emerald-500/10"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-100 text-blue-700">
                  <Phone size={19} />
                </span>
                <span className="flex min-w-0 flex-col">
                  <b className="text-sm font-semibold text-emerald-950 sm:text-[0.95rem]">
                    Contact the store
                  </b>
                  <small className="truncate text-xs text-slate-500">
                    Get directions or send a question
                  </small>
                </span>
                <ArrowRight size={16} className="text-emerald-600 transition group-hover:translate-x-1" />
              </Link>

              {/* Sign out */}
              <button
                onClick={signOut}
                className="mt-2 inline-flex items-center justify-center gap-2 rounded-2xl border border-red-100 bg-white px-4 py-3.5 text-sm font-semibold text-red-600 transition hover:-translate-y-0.5 hover:border-red-300 hover:bg-red-50"
              >
                <LogOut size={17} /> Sign out of your account
              </button>
            </div>
          </section>
        </div>

        {/* ---------- NOTE ---------- */}
        <div className="flex items-start gap-3 rounded-2xl border border-emerald-100 bg-gradient-to-br from-emerald-50 via-white to-emerald-50/60 p-4 sm:p-5">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
            <ShieldCheck size={18} />
          </span>
          <p className="text-sm leading-relaxed text-slate-600 sm:text-base">
            <b className="mr-1.5 font-bold text-emerald-950">Good to know.</b>
            This website currently supports product browsing and customer profile access.
            Cart, online orders, payments and delivery tracking are planned for a future
            phase.
          </p>
        </div>
      </div>
    </main>
  )
}