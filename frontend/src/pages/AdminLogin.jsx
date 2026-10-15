import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  ArrowRight, ArrowLeft, HeartPulse, LockKeyhole, Eye, EyeOff, Shield,
} from 'lucide-react'
import toast from 'react-hot-toast'
import api from '../api'
import Navbar from '../components/Navbar'   // ← tumcha existing Navbar
import Footer from '../components/Footer'   // ← tumcha existing Footer

export default function AdminLogin() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [show, setShow] = useState(false)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const update = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const { data } = await api.post('/admin/auth/login', form)
      localStorage.setItem('admin_token', data.token)
      localStorage.setItem('admin', JSON.stringify(data.admin))
      toast.success('Admin signed in.')
      navigate('/admin', { replace: true })
    } catch (err) {
      toast.error(err.response?.data?.message || 'Unable to sign in.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-emerald-50/40 via-white to-emerald-50/30 text-slate-800">

      {/* ============ NAVBAR (tumcha existing) ============ */}
      <Navbar />

      

      {/* ============ LOGIN SECTION ============ */}
      <main className="relative flex-1 overflow-hidden px-4 py-10 sm:px-6 sm:py-14">
        {/* soft glows */}
        <div className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-emerald-200/40 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-sky-200/30 blur-3xl" />

        <div className="relative mx-auto flex max-w-md flex-col">

          {/* Store pill */}
          <Link
            to="/"
            className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-white px-4 py-2 text-xs font-semibold text-emerald-900 shadow-sm transition hover:border-emerald-400 hover:bg-emerald-50 sm:text-sm"
          >
            <HeartPulse size={16} className="text-emerald-600" />
            <b>Prakash Medical</b>
            <span className="text-slate-400">· Storefront</span>
          </Link>

          {/* Login card */}
          <form
            onSubmit={submit}
            className="relative rounded-3xl border border-emerald-100 bg-white p-6 shadow-2xl shadow-emerald-500/10 sm:p-8"
          >
            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-700 text-white shadow-lg shadow-emerald-500/30">
              <LockKeyhole size={25} />
            </div>

            <div className="text-center">
              <span className="mb-3 inline-block rounded-full bg-emerald-100 px-3 py-1.5 text-[0.68rem] font-bold uppercase tracking-[0.18em] text-emerald-700">
                Private access
              </span>
              <h1 className="text-2xl font-extrabold tracking-tight text-emerald-950 sm:text-3xl">
                Admin sign in
              </h1>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                Sign in to manage products, staff cards and customer enquiries.
              </p>
            </div>

            <div className="mt-7 flex flex-col gap-4">
              {/* Email */}
              <label className="flex flex-col gap-1.5">
                <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Administrator email
                </span>
                <input
                  required
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={update}
                  placeholder="admin@example.com"
                  autoComplete="username"
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
                    type={show ? 'text' : 'password'}
                    name="password"
                    value={form.password}
                    onChange={update}
                    placeholder="Your admin password"
                    autoComplete="current-password"
                    className="w-full rounded-xl border border-emerald-100 bg-emerald-50/40 py-3 pr-12 pl-4 text-sm text-emerald-950 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/15 sm:text-base"
                  />
                  <button
                    type="button"
                    onClick={() => setShow(!show)}
                    aria-label="Toggle password"
                    className="absolute top-1/2 right-3 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-emerald-600 transition hover:bg-emerald-50"
                  >
                    {show ? <EyeOff size={17} /> : <Eye size={17} />}
                  </button>
                </span>
              </label>

              {/* Submit */}
              <button
                disabled={loading}
                className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-emerald-500/25 transition hover:-translate-y-0.5 hover:shadow-xl hover:shadow-emerald-500/35 disabled:cursor-not-allowed disabled:opacity-70 sm:text-base"
              >
                {loading ? 'Signing in…' : 'Enter admin dashboard'}
                <ArrowRight size={17} />
              </button>
            </div>

            {/* Warning */}
            <div className="mt-6 flex items-start gap-2.5 rounded-2xl border border-amber-100 bg-amber-50/60 px-3.5 py-3">
              <Shield size={16} className="mt-0.5 shrink-0 text-amber-600" />
              <p className="text-xs leading-relaxed text-amber-900">
                Admin access is created using the backend setup command. Customer
                registration does not grant administrator access.
              </p>
            </div>
          </form>

          <span className="mt-6 text-center text-xs text-slate-500 sm:text-sm">
            Prakash Medical and General Store · Secure management
          </span>
        </div>
      </main>

      {/* ============ FOOTER (tumcha existing) ============ */}
      <Footer />
    </div>
  )
}