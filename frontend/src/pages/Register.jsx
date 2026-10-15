import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowRight, ArrowLeft, HeartPulse, Eye, EyeOff, ShieldCheck } from 'lucide-react'
import toast from 'react-hot-toast'
import api from '../api'
import { useAuth } from '../auth'

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', mobile: '', password: '', confirmPassword: '' })
  const [show, setShow] = useState(false)
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const update = e => setForm({ ...form, [e.target.name]: e.target.value })

  const submit = async e => {
    e.preventDefault()
    if (form.password !== form.confirmPassword) return toast.error('Passwords do not match.')
    if (form.password.length < 8) return toast.error('Use at least 8 characters for your password.')
    setLoading(true)
    try {
      const { confirmPassword, ...payload } = form
      const { data } = await api.post('/auth/register', payload)
      login(data.token, data.user)
      toast.success('Account created successfully!')
      navigate('/dashboard')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Unable to create account. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-emerald-50/40 via-white to-emerald-50/30 text-slate-800">
      <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2">

        {/* ================= VISUAL SIDE ================= */}
        <div className="relative hidden overflow-hidden bg-gradient-to-br from-emerald-950 via-emerald-900 to-emerald-800 p-10 text-white lg:flex lg:flex-col lg:justify-center xl:p-14">
          {/* glow blobs */}
          <div className="pointer-events-none absolute -top-24 -right-24 h-80 w-80 rounded-full bg-emerald-400/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -left-24 h-80 w-80 rounded-full bg-sky-400/15 blur-3xl" />

          {/* dotted pattern */}
          <div
            className="pointer-events-none absolute inset-0 opacity-30"
            style={{
              backgroundImage:
                'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)',
              backgroundSize: '22px 22px',
            }}
          />

          <div className="relative max-w-md">
            <div className="mb-8 flex h-20 w-20 items-center justify-center rounded-3xl bg-white/10 text-emerald-200 backdrop-blur">
              <HeartPulse size={44} />
            </div>

            <span className="mb-4 inline-block rounded-full bg-white/10 px-3 py-1.5 text-[0.68rem] font-bold uppercase tracking-[0.18em] text-emerald-200">
              Join our store community
            </span>

            <h1 className="mb-4 text-3xl font-extrabold leading-[1.15] tracking-tight sm:text-4xl xl:text-5xl text-white/80">
              Good care starts
              <br />
              <em className="italic text-emerald-300">with a connection.</em>
            </h1>

            <p className="mb-8 text-base leading-relaxed text-white/80">
              Create a customer account to see your profile and keep your store details
              close at hand.
            </p>

            <div className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-200">
                <ShieldCheck size={20} />
              </span>
              <div className="min-w-0">
                <b className="block text-sm font-bold text-white">No OTP required</b>
                <small className="block text-xs leading-relaxed text-white/70">
                  Register with your name, email, mobile and password.
                </small>
              </div>
            </div>
          </div>
        </div>

        {/* ================= FORM SIDE ================= */}
        <div className="relative flex items-center justify-center px-4 py-10 sm:px-6 sm:py-14 lg:px-10">
          {/* soft glows for mobile */}
          <div className="pointer-events-none absolute -top-24 -right-24 h-64 w-64 rounded-full bg-emerald-200/40 blur-3xl lg:hidden" />
          <div className="pointer-events-none absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-sky-200/30 blur-3xl lg:hidden" />

          <form
            onSubmit={submit}
            className="relative w-full max-w-md rounded-3xl border border-emerald-100 bg-white p-6 shadow-2xl shadow-emerald-500/10 sm:p-8"
          >

            <span className="mb-3 inline-block rounded-full bg-emerald-100 px-3 py-1.5 text-[0.68rem] font-bold uppercase tracking-[0.18em] text-emerald-700">
              Customer registration
            </span>

            <h2 className="text-2xl font-extrabold tracking-tight text-emerald-950 sm:text-3xl">
              Create your account
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              It only takes a minute to get started.
            </p>

            <div className="mt-7 flex flex-col gap-4">

              {/* Full name */}
              <label className="flex flex-col gap-1.5">
                <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Full name
                </span>
                <input
                  required
                  name="name"
                  value={form.name}
                  onChange={update}
                  placeholder="Your full name"
                  autoComplete="name"
                  className="w-full rounded-xl border border-emerald-100 bg-emerald-50/40 px-4 py-3 text-sm text-emerald-950 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/15 sm:text-base"
                />
              </label>

              {/* Email */}
              <label className="flex flex-col gap-1.5">
                <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Email address
                </span>
                <input
                  required
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={update}
                  placeholder="you@example.com"
                  autoComplete="email"
                  className="w-full rounded-xl border border-emerald-100 bg-emerald-50/40 px-4 py-3 text-sm text-emerald-950 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/15 sm:text-base"
                />
              </label>

              {/* Mobile */}
              <label className="flex flex-col gap-1.5">
                <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Mobile number
                </span>
                <input
                  required
                  type="tel"
                  name="mobile"
                  value={form.mobile}
                  onChange={update}
                  placeholder="Your mobile number"
                  autoComplete="tel"
                  className="w-full rounded-xl border border-emerald-100 bg-emerald-50/40 px-4 py-3 text-sm text-emerald-950 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/15 sm:text-base"
                />
              </label>

              {/* Password */}
              <label className="flex flex-col gap-1.5">
                <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Password
                </span>
                <span className="relative">
                  <input
                    required
                    minLength="8"
                    type={show ? 'text' : 'password'}
                    name="password"
                    value={form.password}
                    onChange={update}
                    placeholder="At least 8 characters"
                    autoComplete="new-password"
                    className="w-full rounded-xl border border-emerald-100 bg-emerald-50/40 py-3 pr-12 pl-4 text-sm text-emerald-950 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/15 sm:text-base"
                  />
                  <button
                    type="button"
                    onClick={() => setShow(!show)}
                    aria-label="Toggle password visibility"
                    className="absolute top-1/2 right-3 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-emerald-600 transition hover:bg-emerald-50"
                  >
                    {show ? <EyeOff size={17} /> : <Eye size={17} />}
                  </button>
                </span>
              </label>

              {/* Confirm password */}
              <label className="flex flex-col gap-1.5">
                <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Confirm password
                </span>
                <input
                  required
                  minLength="8"
                  type={show ? 'text' : 'password'}
                  name="confirmPassword"
                  value={form.confirmPassword}
                  onChange={update}
                  placeholder="Enter password again"
                  autoComplete="new-password"
                  className="w-full rounded-xl border border-emerald-100 bg-emerald-50/40 px-4 py-3 text-sm text-emerald-950 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/15 sm:text-base"
                />
              </label>

              {/* Submit */}
              <button
                disabled={loading}
                className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-emerald-500/25 transition hover:-translate-y-0.5 hover:shadow-xl hover:shadow-emerald-500/35 disabled:cursor-not-allowed disabled:opacity-70 sm:text-base"
              >
                {loading ? 'Creating account…' : 'Create account'}
                <ArrowRight size={17} />
              </button>
            </div>

            {/* Switch to login */}
            <p className="mt-6 text-center text-sm text-slate-600">
              Already registered?{' '}
              <Link
                to="/login"
                className="font-bold text-emerald-700 transition hover:text-emerald-500"
              >
                Sign in instead
              </Link>
            </p>

            {/* Info note */}
            <div className="mt-5 flex items-start gap-2.5 rounded-2xl border border-emerald-100 bg-emerald-50/60 px-3.5 py-3">
              <ShieldCheck size={15} className="mt-0.5 shrink-0 text-emerald-600" />
              <p className="text-xs leading-relaxed text-emerald-900">
                Your account is for profile access only. Online orders and payments are
                not available yet.
              </p>
            </div>
          </form>
        </div>
      </div>
    </main>
  )
}