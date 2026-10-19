import { useEffect, useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import {
  Search, SlidersHorizontal, X, PackageOpen, ArrowRight, AlertCircle,
} from 'lucide-react'
import api from '../api'
import ProductCard from '../components/ProductCard'
import { fetchProducts } from '../productsRequest'

export default function Products() {
  const [params, setParams] = useSearchParams()
  const [search, setSearch] = useState(params.get('search') || '')
  const [category, setCategory] = useState(params.get('category') || 'All')
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([
    'Tablets', 'Syrups', 'Capsules', 'Supplements', 'Ayurvedic',
    'General Store', 'Surgical Items', 'Baby Care', 'Personal Care', 'First Aid',
  ])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [retryCount, setRetryCount] = useState(0)

  useEffect(() => {
    const controller = new AbortController()
    setLoading(true)
    setError('')

    Promise.resolve()
      .then(() => {
        if (controller.signal.aborted) return null
        return fetchProducts(api, {
          search: params.get('search') || '',
          category: params.get('category') || 'All',
        }, controller.signal)
      })
      .then(response => {
        if (controller.signal.aborted) return
        const data = response?.data
        if (!Array.isArray(data?.products)) {
          throw new Error('The products response did not contain a product list.')
        }
        setProducts(data.products)
        if (data.categories?.length) setCategories(data.categories)
      })
      .catch(() => {
        if (!controller.signal.aborted) {
          setError('We could not load products right now. Please try again in a moment.')
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false)
      })

    return () => controller.abort()
  }, [params, retryCount])

  const submitSearch = (event) => {
    event.preventDefault()
    const next = {}
    if (search.trim()) next.search = search.trim()
    if (category !== 'All') next.category = category
    setParams(next)
  }

  const clear = () => {
    setSearch('')
    setCategory('All')
    setParams({})
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-emerald-50/40 via-white to-emerald-50/30 text-slate-800">

      {/* ================= HERO ================= */}
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

        <div className="container relative mx-auto flex max-w-6xl flex-col items-start gap-8 px-4 py-12 sm:px-6 sm:py-16 md:flex-row md:items-center md:justify-between md:gap-16 md:py-20">
          <div className="w-full md:max-w-2xl">
            <span className="mb-4 inline-block rounded-full bg-emerald-100 px-3 py-1.5 text-[0.68rem] font-bold uppercase tracking-[0.18em] text-emerald-700">
              The store catalogue
            </span>
            <h1 className="mb-4 text-3xl font-extrabold leading-tight tracking-tight text-emerald-950 sm:text-4xl md:text-5xl lg:text-6xl">
              Browse our <em className="italic text-emerald-600">products.</em>
            </h1>
            <p className="max-w-xl text-base leading-relaxed text-slate-600 sm:text-lg">
              Medical essentials and general-store favourites in one place.
            </p>
          </div>

          <div className="hidden md:flex md:items-center md:justify-center">
            <div className="flex h-32 w-32 items-center justify-center rounded-3xl bg-gradient-to-br from-emerald-500 to-emerald-700 text-white shadow-2xl shadow-emerald-500/40">
              <PackageOpen size={50} />
            </div>
          </div>
        </div>
      </section>

      {/* ================= CONTENT ================= */}
      <div className="container mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-12">

        {/* ---------- TOOLBAR ---------- */}
        <form
          onSubmit={submitSearch}
          className="mb-4 flex flex-col gap-3 rounded-3xl border border-emerald-100 bg-white p-4 shadow-lg shadow-emerald-500/5 sm:p-5 lg:flex-row lg:items-center"
        >
          {/* Search */}
          <label className="relative flex-1">
            <Search size={18} className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-emerald-500" />
            <input
              aria-label="Search products"
              placeholder="Search by product name..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full rounded-xl border border-emerald-100 bg-emerald-50/40 py-3 pr-10 pl-10 text-sm text-emerald-950 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/15 sm:text-base"
            />
            {search && (
              <button
                type="button"
                aria-label="Clear search"
                onClick={() => setSearch('')}
                className="absolute top-1/2 right-3 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-lg text-emerald-600 transition hover:bg-emerald-50"
              >
                <X size={15} />
              </button>
            )}
          </label>

          {/* Category */}
          <label className="relative flex-1 sm:flex-initial">
            <SlidersHorizontal size={16} className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-emerald-500" />
            <select
              value={category}
              onChange={e => setCategory(e.target.value)}
              className="w-full appearance-none rounded-xl border border-emerald-100 bg-emerald-50/40 py-3 pr-9 pl-10 text-sm text-emerald-950 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/15 sm:w-56 sm:text-base"
            >
              <option>All</option>
              {categories.map(c => <option key={c}>{c}</option>)}
            </select>
            <svg
              className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-emerald-600"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </label>

          {/* Submit */}
          <button
            type="submit"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-500/25 transition hover:-translate-y-0.5 hover:shadow-xl hover:shadow-emerald-500/35 sm:text-base"
          >
            Search <Search size={16} />
          </button>
        </form>

        {/* ---------- RESULT ROW ---------- */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3 px-1">
          {!error && (
            <span className="text-sm text-slate-600 sm:text-base">
              {loading
                ? 'Loading catalogue…'
                : `${products.length} ${products.length === 1 ? 'product' : 'products'} found`}
            </span>
          )}
          {(params.get('search') || params.get('category')) && (
            <button
              onClick={clear}
              className="inline-flex items-center gap-1.5 rounded-full border border-emerald-100 bg-white px-3.5 py-1.5 text-xs font-bold text-emerald-700 transition hover:border-emerald-400 hover:bg-emerald-50 sm:text-sm"
            >
              Clear filters <X size={13} />
            </button>
          )}
        </div>

        {/* ---------- CONTENT STATES ---------- */}
        {loading ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4">
            {[1, 2, 3, 4].map(n => (
              <div
                key={n}
                className="aspect-[3/4] w-full animate-pulse rounded-2xl bg-emerald-100/60"
              />
            ))}
          </div>
        ) : error ? (
          <div className="flex flex-col items-center rounded-3xl border border-red-100 bg-white p-8 text-center shadow-sm sm:p-10">
            <span className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-100 text-red-600">
              <AlertCircle size={26} />
            </span>
            <h3 className="mb-2 text-lg font-bold text-emerald-950 sm:text-xl">
              Products are temporarily unavailable
            </h3>
            <p className="mb-6 max-w-md text-sm leading-relaxed text-slate-600 sm:text-base">
              {error}
            </p>
            <button
              onClick={() => setRetryCount(count => count + 1)}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-500/25 transition hover:-translate-y-0.5 hover:shadow-xl sm:text-base"
            >
              Try again
            </button>
          </div>
        ) : products.length ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4">
            {products.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center rounded-3xl border border-emerald-100 bg-white p-8 text-center shadow-sm sm:p-10">
            <span className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
              <Search size={26} />
            </span>
            <h3 className="mb-2 text-lg font-bold text-emerald-950 sm:text-xl">
              No products found
            </h3>
            <p className="mb-6 max-w-md text-sm leading-relaxed text-slate-600 sm:text-base">
              Try another search term or clear the filters to browse all available
              products.
            </p>
            <button
              onClick={clear}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-500/25 transition hover:-translate-y-0.5 hover:shadow-xl sm:text-base"
            >
              Show all products <ArrowRight size={16} />
            </button>
          </div>
        )}

        {/* ---------- PRESCRIPTION NOTE ---------- */}
        <div className="mt-8 flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50/60 p-4 sm:p-5">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-lg font-bold text-amber-700">
            ℞
          </span>
          <p className="text-xs leading-relaxed text-amber-900 sm:text-sm">
            <b className="font-bold">Need a prescription medicine?</b> Prescription-required
            items are marked with an Rx badge. Please follow your doctor's guidance and
            applicable pharmacy rules.
          </p>
        </div>

        {/* ---------- DISCLAIMER ---------- */}
        <p className="mt-4 text-center text-xs leading-relaxed text-slate-500 sm:text-sm">
          Product availability and prices may change. Please contact the store to confirm
          before visiting.
        </p>
      </div>
    </main>
  )
}