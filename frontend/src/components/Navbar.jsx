import { Link, NavLink, useNavigate } from 'react-router-dom'
import {
  Phone, UserRound, LogOut, LayoutDashboard, ShieldCheck,
} from 'lucide-react'
import { useAuth } from '../auth'

const links = [
  ['Home', '/home'],
  ['Products', '/products'],
  ['About us', '/about'],
  ['Contact', '/contact'],
]

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const onLogout = () => {
    logout()
    navigate('/')
  }

  const navLinkClass = ({ isActive }) =>
    `whitespace-nowrap rounded-full px-3.5 py-1.5 text-xs font-semibold transition sm:text-sm sm:px-4 sm:py-2 ${
      isActive
        ? 'bg-emerald-100 text-emerald-900 shadow-sm'
        : 'text-slate-600 hover:bg-emerald-50 hover:text-emerald-900'
    }`

  return (
    <>
      {/* ================= TOP STRIP ================= */}
      <div className="bg-emerald-950 text-white">
        <div className="container mx-auto flex max-w-6xl flex-nowrap items-center justify-between gap-2 px-3 py-2 sm:px-6 sm:text-xs">
          <span className="flex min-w-0 items-center gap-1.5 text-[0.62rem] font-medium leading-tight sm:text-xs">
            <span className="truncate">
              आपल्या आरोग्याची काळजी, आपल्या जवळच
            </span>
            <span className="shrink-0 text-red-400">❤</span>
          </span>

          <a
            href="tel:9765428720"
            className="inline-flex shrink-0 items-center gap-1 rounded-full bg-white/10 px-2.5 py-1 text-[0.62rem] font-semibold text-emerald-100 transition hover:bg-white/20 sm:gap-1.5 sm:text-xs"
          >
            <Phone size={11} className="sm:size-[12px]" />
            9765428720
          </a>
        </div>
      </div>

      {/* ================= HEADER ================= */}
      <header className="sticky top-0 z-40 border-b border-emerald-100/70 bg-white/90 backdrop-blur-md">
        <div className="container mx-auto max-w-6xl px-3 sm:px-6">

          {/* =====================================================
              MOBILE/TABLET: 2-row layout (brand+actions | links)
              LAPTOP: single row (brand | links | actions)
             ===================================================== */}
          <div className="flex flex-wrap items-center lg:flex-nowrap lg:justify-between lg:gap-4 lg:py-3">

            {/* -------- Brand -------- */}
            {/* MOBILE: row 1, left   |   DESKTOP: left side (order 1) */}
            <Link
              to="/"
              className="flex min-w-0 shrink items-center gap-2 py-2.5 lg:order-1 lg:py-0"
            >
              <img
                src="/images/shop/logo.jpg"
                alt="Prakash Medical and General Store logo"
                className="h-10 w-8 shrink-0 rounded-lg object-contain sm:h-11 sm:w-9 lg:h-12 lg:w-10"
              />
              <span className="flex min-w-0 flex-col leading-tight">
                <strong className="truncate text-[0.82rem] font-extrabold tracking-tight text-emerald-950 sm:text-sm lg:text-base">
                  Prakash Medical
                </strong>
                <small className="truncate text-[0.52rem] font-bold tracking-[0.08em] text-emerald-700 sm:text-[0.58rem] sm:tracking-[0.14em] lg:text-[0.62rem]">
                  and General Store
                </small>
              </span>
            </Link>

            {/* -------- Actions -------- */}
            {/* MOBILE: row 1, right   |   DESKTOP: right side (order 3) */}
            <div className="ml-auto flex shrink-0 items-center gap-1 py-2.5 sm:gap-1.5 lg:order-3 lg:ml-0 lg:gap-2 lg:py-0">
              {user ? (
                <>
                  <Link
                    to="/dashboard"
                    className="inline-flex items-center gap-1 rounded-lg border border-emerald-100 bg-white px-2 py-1.5 text-[0.68rem] font-semibold text-emerald-900 transition hover:border-emerald-400 hover:bg-emerald-50 sm:gap-1.5 sm:rounded-xl sm:px-3 sm:py-2 sm:text-xs lg:px-4 lg:text-sm"
                  >
                    <UserRound size={12} className="text-emerald-600 sm:size-[14px]" />
                    <span className="max-w-[55px] truncate sm:max-w-[80px] lg:max-w-none">
                      {user.name?.split(' ')[0] || 'You'}
                    </span>
                  </Link>
                  <button
                    onClick={onLogout}
                    aria-label="Logout"
                    title="Logout"
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-emerald-100 bg-white text-emerald-700 transition hover:border-red-300 hover:bg-red-50 hover:text-red-600 sm:h-9 sm:w-9 sm:rounded-xl lg:h-10 lg:w-10"
                  >
                    <LogOut size={14} className="sm:size-[16px]" />
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="inline-flex items-center gap-1 rounded-lg border border-emerald-100 bg-white px-2 py-1.5 text-[0.68rem] font-semibold text-emerald-900 transition hover:border-emerald-400 hover:bg-emerald-50 sm:gap-1.5 sm:rounded-xl sm:px-3 sm:py-2 sm:text-xs lg:px-4 lg:py-2.5 lg:text-sm"
                  >
                    <UserRound size={12} className="text-emerald-600 sm:size-[13px]" />
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="inline-flex items-center rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-700 px-2.5 py-1.5 text-[0.68rem] font-semibold text-white shadow-md shadow-emerald-500/25 transition hover:-translate-y-0.5 hover:shadow-lg sm:rounded-xl sm:px-3 sm:py-2 sm:text-xs lg:px-4 lg:py-2.5 lg:text-sm"
                  >
                    Register
                  </Link>
                </>
              )}
            </div>

            {/* -------- Links -------- */}
            {/* MOBILE: full-width row 2 (order last)  |  DESKTOP: center (order 2) */}
            <nav
              className="
                order-last flex w-full items-center gap-1.5 overflow-x-auto border-t border-emerald-100/70 py-2
                lg:order-2 lg:w-auto lg:flex-1 lg:justify-center lg:gap-1 lg:border-0 lg:py-0 lg:overflow-visible
                [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden
              "
            >
              {links.map(([label, to]) => (
                <NavLink key={to} to={to} end={to === '/'} className={navLinkClass}>
                  {label}
                </NavLink>
              ))}

              <NavLink to="/admin/login" className={navLinkClass}>
                <span className="inline-flex items-center gap-1">
                  <ShieldCheck size={12} className="sm:size-[13px]" />
                  Admin Login
                </span>
              </NavLink>

              {user && (
                <NavLink
                  to="/dashboard"
                  className={`${navLinkClass({ isActive: false })} lg:hidden`}
                >
                  <span className="inline-flex items-center gap-1">
                    <LayoutDashboard size={12} />
                    Dashboard
                  </span>
                </NavLink>
              )}
            </nav>
          </div>
        </div>
      </header>
    </>
  )
}