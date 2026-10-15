import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { ArrowRight, ArrowLeft, HeartPulse, Eye, EyeOff, ShieldCheck } from 'lucide-react'
import toast from 'react-hot-toast'
import api from '../api'
import { useAuth } from '../auth'

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const update = e => setForm({ ...form, [e.target.name]: e.target.value })

  const submit = async e => {
    e.preventDefault()
    setLoading(true)
    try {
      const { data } = await api.post('/auth/login', form)
      login(data.token, data.user)
      toast.success('Welcome back!')
      navigate(location.state?.from || '/dashboard', { replace: true })
    } catch (err) {
      toast.error(err.response?.data?.message || 'Unable to login. Please try again.')
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
              Welcome to Prakash Medical
            </span>

            <h1 className="mb-4 text-3xl font-extrabold leading-[1.15] tracking-tight sm:text-4xl xl:text-5xl text-white/80">
              Your health essentials,
              <br />
              <em className="italic text-emerald-300">closer to home.</em>
            </h1>

            <p className="mb-8 text-base leading-relaxed text-white/80">
              Sign in to view your customer profile and stay connected with your local
              store.
            </p>

            <div className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-200">
                <ShieldCheck size={20} />
              </span>
              <div className="min-w-0">
                <b className="block text-sm font-bold text-white">
                  Simple and secure access
                </b>
                <small className="block text-xs leading-relaxed text-white/70">
                  Your account is protected with password-based login.
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
              Customer account
            </span>

            <h2 className="text-2xl font-extrabold tracking-tight text-emerald-950 sm:text-3xl">
              Welcome back
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              Enter your details to sign in to your account.
            </p>

            <div className="mt-7 flex flex-col gap-4">

              {/* Email */}
              <label className="flex flex-col gap-1.5">
                <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Email address
                </span>
                <input
                  type="email"
                  name="email"
                  required
                  value={form.email}
                  onChange={update}
                  placeholder="you@example.com"
                  autoComplete="email"
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
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    required
                    value={form.password}
                    onChange={update}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    className="w-full rounded-xl border border-emerald-100 bg-emerald-50/40 py-3 pr-12 pl-4 text-sm text-emerald-950 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/15 sm:text-base"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    className="absolute top-1/2 right-3 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-emerald-600 transition hover:bg-emerald-50"
                  >
                    {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                  </button>
                </span>
              </label>

              {/* Submit */}
              <button
                disabled={loading}
                className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-emerald-500/25 transition hover:-translate-y-0.5 hover:shadow-xl hover:shadow-emerald-500/35 disabled:cursor-not-allowed disabled:opacity-70 sm:text-base"
              >
                {loading ? 'Signing in…' : 'Sign in'}
                <ArrowRight size={17} />
              </button>
            </div>

            {/* Switch to register */}
            <p className="mt-6 text-center text-sm text-slate-600">
              New to Prakash Medical?{' '}
              <Link
                to="/register"
                className="font-bold text-emerald-700 transition hover:text-emerald-500"
              >
                Create an account
              </Link>
            </p>

            {/* Admin note */}
            <div className="mt-5 flex items-start gap-2.5 rounded-2xl border border-emerald-100 bg-emerald-50/60 px-3.5 py-3">
              <ShieldCheck size={15} className="mt-0.5 shrink-0 text-emerald-600" />
              <p className="text-xs leading-relaxed text-emerald-900">
                This account is for the customer profile only.{' '}
                <Link
                  to="/admin/login"
                  className="font-bold underline decoration-emerald-300 decoration-2 underline-offset-2 transition hover:text-emerald-600"
                >
                  Store administrator login ↗
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </main>
  )
}