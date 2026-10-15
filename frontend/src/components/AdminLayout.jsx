import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import {
  HeartPulse, LayoutDashboard, Package, Users, Mail,
  ExternalLink, LogOut,
} from 'lucide-react'

const nav = [
  ['Overview', '/admin', LayoutDashboard],
  ['Products', '/admin/products', Package],
  ['Staff cards', '/admin/staff', Users],
  ['Messages', '/admin/messages', Mail],
]

export default function AdminLayout() {
  const navigate = useNavigate()

  const logout = () => {
    localStorage.removeItem('admin_token')
    localStorage.removeItem('admin')
    navigate('/admin/login')
  }

  const adminNavClass = ({ isActive }) =>
    `flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold transition ${
      isActive
        ? 'bg-gradient-to-br from-emerald-500 to-emerald-700 text-white shadow-md shadow-emerald-500/25'
        : 'text-slate-600 hover:bg-emerald-50 hover:text-emerald-900'
    }`

  const mobileNavClass = ({ isActive }) =>
    `inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full px-3.5 py-1.5 text-xs font-semibold transition ${
      isActive
        ? 'bg-emerald-100 text-emerald-900 shadow-sm'
        : 'text-slate-600 hover:bg-emerald-50 hover:text-emerald-900'
    }`

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50/40 via-white to-emerald-50/30 text-slate-800">

      {/* ============ ADMIN HEADER ============ */}
      <header className="sticky top-0 z-40 border-b border-emerald-100 bg-white">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6">

          {/* Row 1: Brand + Buttons */}
          <div className="flex items-center justify-between gap-3 py-3 sm:py-3.5">

            {/* Brand */}
            <div className="flex min-w-0 shrink items-center gap-2.5">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 text-white shadow-sm">
                <HeartPulse size={20} />
              </span>
              <span className="flex min-w-0 flex-col leading-tight">
                <strong className="truncate text-sm font-extrabold tracking-tight text-emerald-950 sm:text-base">
                  Prakash Medical
                </strong>
                <small className="truncate text-[0.6rem] font-bold tracking-[0.14em] text-emerald-700 sm:text-[0.62rem]">
                  STORE ADMIN
                </small>
              </span>
            </div>

            {/* Buttons */}
            <div className="flex shrink-0 items-center gap-2">
              {/* View store — subtle outline */}
              <a
                href="/"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-200 bg-white px-3 py-1.5 text-xs font-semibold text-emerald-800 transition hover:border-emerald-400 hover:bg-emerald-50 sm:px-3.5 sm:py-2 sm:text-sm"
              >
                <ExternalLink size={13} />
                View store
              </a>

              {/* Sign out — solid emerald, no glow */}
              <button
                onClick={logout}
                className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-emerald-700 sm:px-3.5 sm:py-2 sm:text-sm"
              >
                <LogOut size={13} />
                Sign out
              </button>
            </div>
          </div>

          {/* Row 2: Admin nav pills — mobile + tablet */}
          <nav
            className="
              flex items-center gap-1.5 overflow-x-auto border-t border-emerald-100/70 py-2.5
              lg:hidden
              [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden
            "
          >
            {nav.map(([label, to, Icon]) => (
              <NavLink
                key={to}
                end={to === '/admin'}
                to={to}
                className={mobileNavClass}
              >
                <Icon size={13} />
                {label}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>

      {/* ============ LAYOUT ============ */}
      <div className="flex">

        {/* ============ DESKTOP SIDEBAR ============ */}
        <aside className="hidden w-64 shrink-0 border-r border-emerald-100 bg-white/60 lg:block">
          <div className="sticky top-[73px] flex h-[calc(100vh-4.5rem)] flex-col p-4">

            <div className="mb-2 px-3 text-[0.6rem] font-bold uppercase tracking-[0.18em] text-emerald-700">
              Management
            </div>

            <nav className="flex flex-col gap-1">
              {nav.map(([label, to, Icon]) => (
                <NavLink
                  key={to}
                  end={to === '/admin'}
                  to={to}
                  className={adminNavClass}
                >
                  <Icon size={17} />
                  {label}
                </NavLink>
              ))}
            </nav>

            {/* Bottom: profile + storefront */}
            <div className="mt-auto border-t border-emerald-100 pt-4">
              <div className="mb-3 flex items-center gap-3 rounded-xl border border-emerald-100 bg-white p-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 text-sm font-bold text-white">
                  P
                </span>
                <div className="min-w-0">
                  <b className="block truncate text-xs font-bold text-emerald-950">
                    Store Administrator
                  </b>
                  <small className="block text-[0.65rem] text-emerald-700">
                    Full access
                  </small>
                </div>
              </div>

              <a
                href="/"
                target="_blank"
                rel="noreferrer"
                className="flex w-full items-center justify-center gap-2 rounded-lg border border-emerald-200 bg-white px-3 py-2 text-xs font-semibold text-emerald-800 transition hover:border-emerald-400 hover:bg-emerald-50"
              >
                <ExternalLink size={13} /> View storefront
              </a>
            </div>
          </div>
        </aside>

        {/* ============ MAIN CONTENT ============ */}
        <main className="min-w-0 flex-1">
          <div className="container mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}