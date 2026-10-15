import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight, ArrowUpRight, ShieldCheck, HeartPulse, MapPin,
  Stethoscope, PackageCheck, Headphones, BadgeCheck,
} from 'lucide-react'
import api from '../api'
import ProductCard from '../components/ProductCard'
import ShopPhoto from '../components/ShopPhoto'

const categories = [
  { name: 'Tablets', subtitle: 'Everyday essentials', icon: '💊', tint: 'mint' },
  { name: 'Syrups', subtitle: 'Liquid care', icon: '🧴', tint: 'blue' },
  { name: 'Ayurvedic', subtitle: 'Traditional wellness', icon: '🌿', tint: 'sand' },
  { name: 'Baby Care', subtitle: 'Little one essentials', icon: '🍼', tint: 'pink' },
  { name: 'First Aid', subtitle: 'Ready for the basics', icon: '🩹', tint: 'lavender' },
  { name: 'General Store', subtitle: 'Daily needs', icon: '🧺', tint: 'lemon' },
]

const tintMap = {
  mint:     'from-emerald-50 to-emerald-100/60 border-emerald-100',
  blue:     'from-sky-50 to-sky-100/60 border-sky-100',
  sand:     'from-amber-50 to-amber-100/60 border-amber-100',
  pink:     'from-pink-50 to-pink-100/60 border-pink-100',
  lavender: 'from-violet-50 to-violet-100/60 border-violet-100',
  lemon:    'from-yellow-50 to-yellow-100/60 border-yellow-100',
}

const shopPhotos = [
  { title: 'Shop interior', note: 'Interior and medicine shelves', image: '/images/shop/shop-interior.jpg', alt: 'Interior and medicine shelves at Prakash Medical and General Store' },
  { title: 'Billing counter', note: 'The store billing counter', image: '/images/shop/shop-counter.jpg', alt: 'Billing counter at Prakash Medical and General Store' },
  { title: 'General-store section', note: 'Everyday products in the shop', image: '/images/shop/store-products.jpg', alt: 'General-store products at Prakash Medical and General Store' },
]

export default function Home() {
  const [products, setProducts] = useState([])

  useEffect(() => {
    api.get('/products')
      .then(({ data }) => setProducts((data.products || []).slice(0, 4)))
      .catch(() => {})
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50/40 via-white to-emerald-50/30 text-slate-800">

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

        <div className="container relative mx-auto flex max-w-6xl flex-col gap-10 px-4 py-12 sm:px-6 sm:py-16 md:flex-row md:items-center md:gap-16 md:py-20 lg:py-24">

          <div className="flex-1">
            <span className="mb-4 inline-flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-1.5 text-[0.68rem] font-bold uppercase tracking-[0.18em] text-emerald-700">
              <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
              Your local health &amp; wellness store
            </span>

            <h1 className="mb-4 text-3xl font-extrabold leading-[1.1] tracking-tight text-emerald-950 sm:text-4xl md:text-5xl lg:text-6xl">
              Care for your
              <br />
              <em className="italic text-emerald-600">health,</em> close to home.
            </h1>

            <p className="mb-7 max-w-xl text-base leading-relaxed text-slate-600 sm:text-lg">
              Medical essentials आणि रोजच्या गरजेच्या वस्तू — विश्वासाने, काळजीने
              आणि तुमच्या जवळ.
            </p>

            <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
              <Link
                to="/products"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-emerald-500/25 transition hover:-translate-y-0.5 hover:shadow-xl hover:shadow-emerald-500/35 sm:text-base"
              >
                Explore products <ArrowRight size={18} />
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-emerald-100 bg-white px-5 py-3.5 text-sm font-semibold text-emerald-900 transition hover:border-emerald-400 hover:bg-emerald-50 sm:text-base"
              >
                Get in touch <ArrowUpRight size={17} />
              </Link>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex">
                <span className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-white bg-gradient-to-br from-emerald-500 to-emerald-700 text-sm font-bold text-white shadow-md">P</span>
                <span className="-ml-3 flex h-10 w-10 items-center justify-center rounded-full border-2 border-white bg-gradient-to-br from-blue-500 to-blue-700 text-sm font-bold text-white shadow-md">+</span>
                <span className="-ml-3 flex h-10 w-10 items-center justify-center rounded-full border-2 border-white bg-gradient-to-br from-pink-500 to-pink-700 text-sm text-white shadow-md">♥</span>
              </div>
              <div>
                <strong className="block text-sm font-bold text-emerald-950">Your neighbourhood care partner</strong>
                <small className="block text-xs text-slate-500">Serving Hanuman Nagar, Kumbhari</small>
              </div>
            </div>
          </div>

          <div className="w-full flex-1 px-2 py-6 sm:px-6 md:px-0">
            <figure className="w-full max-w-lg overflow-hidden rounded-[2rem] border border-emerald-100 bg-white p-2 shadow-2xl shadow-emerald-900/10">
              <ShopPhoto
                src="/images/shop/shop-front.jpg"
                alt="Exterior of Prakash Medical and General Store"
                loading="eager"
                className="rounded-[1.5rem]"
                imageClassName="object-[center_40%]"
              />
              <figcaption className="px-3 pb-2 pt-3">
                <strong className="block text-sm font-extrabold text-emerald-950 sm:text-base">Prakash Medical and General Store</strong>
                <span className="mt-0.5 block text-xs text-slate-600">Shop exterior · Hanuman Nagar, Kumbhari</span>
              </figcaption>
            </figure>

            <div className="mt-3 grid max-w-lg grid-cols-1 gap-2 sm:grid-cols-2">
              <div className="flex min-w-0 items-center gap-3 rounded-2xl border border-emerald-100 bg-white/95 p-3 shadow-md">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                  <ShieldCheck size={18} />
                </span>
                <div className="min-w-0">
                  <strong className="block text-xs font-bold text-emerald-950 sm:text-sm">Care you can trust</strong>
                  <small className="block text-[0.68rem] text-slate-500">Health comes first</small>
                </div>
              </div>

              <div className="flex min-w-0 items-center gap-3 rounded-2xl border border-emerald-100 bg-white/95 p-3 shadow-md">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
                  <PackageCheck size={18} />
                </span>
                <div className="min-w-0">
                  <strong className="block text-xs font-bold text-emerald-950 sm:text-sm">Medical + General</strong>
                  <small className="block text-[0.68rem] text-slate-500">Your everyday essentials</small>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="container relative mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-6 gap-y-2 border-t border-emerald-100/60 px-4 py-4 text-xs text-slate-600 sm:gap-x-8 sm:px-6 sm:text-sm md:justify-start">
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 transition hover:text-emerald-700"
          >
            <MapPin size={15} className="text-emerald-600" />
            Hanuman Nagar, Kumbhari · Find Our Store
            <ArrowUpRight size={13} className="text-emerald-600" />
          </Link>
          <span className="inline-flex items-center gap-2">
            <span className="text-emerald-600">☎</span> 9765428720
          </span>
          <span className="inline-flex items-center gap-2">
            <ShieldCheck size={15} className="text-emerald-600" /> A local store you can rely on
          </span>
        </div>
      </section>

      {/* ================= TRUST STRIP ================= */}
      <section className="bg-emerald-950 py-6 text-white sm:py-7">
        <div className="container mx-auto grid max-w-6xl grid-cols-1 gap-4 px-4 sm:grid-cols-2 sm:gap-6 sm:px-6 lg:grid-cols-4">
          {[
            { icon: ShieldCheck, title: 'Care-first service', note: 'Friendly local support' },
            { icon: PackageCheck, title: 'Medical essentials', note: 'Browse store categories' },
            { icon: Headphones, title: 'Here to help', note: 'Contact our store directly' },
            { icon: MapPin, title: 'Right around you', note: 'In Hanuman Nagar, Kumbhari' },
          ].map(({ icon: Icon, title, note }) => (
            <div key={title} className="flex items-center gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10 text-emerald-200">
                <Icon size={18} />
              </span>
              <div className="min-w-0">
                <b className="block text-sm font-semibold">{title}</b>
                <small className="block text-xs leading-snug text-white/75">{note}</small>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ================= SHOP PHOTOS ================= */}
      <section className="py-12 sm:py-14">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mb-6">
            <span className="mb-3 inline-block rounded-full bg-emerald-100 px-3 py-1.5 text-[0.68rem] font-bold uppercase tracking-[0.18em] text-emerald-700">
              A look inside our store
            </span>
            <h2 className="text-2xl font-extrabold tracking-tight text-emerald-950 sm:text-3xl">
              Inside <em className="italic text-emerald-600">our store.</em>
            </h2>
            <p className="mt-1 text-sm text-slate-600 sm:text-base">
              Photos of our medicine shelves, billing counter and general-store products.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {shopPhotos.map(({ title, note, image, alt }) => (
              <figure key={title} className="overflow-hidden rounded-2xl border border-emerald-100 bg-white shadow-sm">
                <ShopPhoto src={image} alt={alt} />
                <figcaption className="p-4">
                  <strong className="block text-sm font-bold text-emerald-950">{title}</strong>
                  <span className="mt-0.5 block text-xs text-slate-500">{note}</span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* ================= CATEGORIES ================= */}
      <section className="py-14 sm:py-16 md:py-20">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mb-8 flex flex-col gap-4 sm:mb-10 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <span className="mb-3 inline-block rounded-full bg-emerald-100 px-3 py-1.5 text-[0.68rem] font-bold uppercase tracking-[0.18em] text-emerald-700">
                Shop by category
              </span>
              <h2 className="text-2xl font-extrabold leading-tight tracking-tight text-emerald-950 sm:text-3xl md:text-4xl">
                Everyday care, <em className="italic text-emerald-600">made simple.</em>
              </h2>
              <p className="mt-1 text-sm text-slate-600 sm:text-base">
                Find the category you need to get started.
              </p>
            </div>
            <Link
              to="/products"
              className="inline-flex items-center gap-1.5 text-sm font-bold text-emerald-700 transition hover:gap-3 hover:text-emerald-500 sm:text-base"
            >
              View all products <ArrowUpRight size={17} />
            </Link>
          </div>

          {/* Category grid — mobile: vertical cards, desktop: horizontal */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-3">
            {categories.map(c => (
              <Link
                key={c.name}
                to={`/products?category=${encodeURIComponent(c.name)}`}
                className={`group relative flex flex-col items-start gap-2 rounded-2xl border bg-gradient-to-br p-3.5 transition hover:-translate-y-1 hover:shadow-lg hover:shadow-emerald-500/10 sm:flex-row sm:items-center sm:gap-3 sm:p-5 ${tintMap[c.tint]}`}
              >
                {/* Top row: icon + arrow */}
                <div className="flex w-full items-center justify-between sm:w-auto sm:justify-start sm:gap-3">
                  <span className="text-2xl sm:text-3xl">{c.icon}</span>
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/80 text-emerald-700 transition group-hover:bg-white sm:ml-auto sm:order-3">
                    <ArrowUpRight size={14} />
                  </span>
                </div>

                {/* Text block */}
                <div className="min-w-0 sm:order-2">
                  <strong className="block text-[0.82rem] font-bold leading-tight text-emerald-950 sm:text-base">
                    {c.name}
                  </strong>
                  <small className="mt-0.5 block text-[0.62rem] leading-tight text-slate-600 sm:text-xs">
                    {c.subtitle}
                  </small>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ================= FEATURED ================= */}
      <section className="border-y border-emerald-100 bg-white py-14 sm:py-16 md:py-20">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mb-8 flex flex-col gap-4 sm:mb-10 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <span className="mb-3 inline-block rounded-full bg-emerald-100 px-3 py-1.5 text-[0.68rem] font-bold uppercase tracking-[0.18em] text-emerald-700">
                From our store
              </span>
              <h2 className="text-2xl font-extrabold leading-tight tracking-tight text-emerald-950 sm:text-3xl md:text-4xl">
                Popular <em className="italic text-emerald-600">essentials.</em>
              </h2>
              <p className="mt-1 text-sm text-slate-600 sm:text-base">
                Products added by our store team appear here.
              </p>
            </div>
            <Link
              to="/products"
              className="inline-flex items-center gap-1.5 text-sm font-bold text-emerald-700 transition hover:gap-3 hover:text-emerald-500 sm:text-base"
            >
              Browse catalogue <ArrowUpRight size={17} />
            </Link>
          </div>

          {products.length ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4">
              {products.map(product => <ProductCard product={product} key={product.id} />)}
            </div>
          ) : (
            <div className="flex flex-col items-start gap-4 rounded-3xl border border-emerald-100 bg-gradient-to-br from-emerald-50 via-white to-emerald-50/60 p-5 sm:flex-row sm:items-center sm:p-6">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
                <PackageCheck size={22} />
              </span>
              <div className="min-w-0 flex-1">
                <strong className="block text-sm font-bold text-emerald-950 sm:text-base">
                  Our product catalogue is getting ready.
                </strong>
                <p className="mt-0.5 text-xs leading-relaxed text-slate-600 sm:text-sm">
                  Please contact the store for product availability, or check back soon.
                </p>
              </div>
              <Link
                to="/contact"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-emerald-100 bg-white px-5 py-2.5 text-sm font-semibold text-emerald-900 transition hover:border-emerald-400 hover:bg-emerald-50 sm:shrink-0"
              >
                Contact store <ArrowRight size={16} />
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* ================= ABOUT TEASER ================= */}
      <section className="py-14 sm:py-16 md:py-20">
        <div className="container mx-auto grid max-w-6xl grid-cols-1 items-center gap-10 px-4 sm:px-6 md:grid-cols-2 md:gap-14">

          <div className="relative mx-auto aspect-square w-full max-w-sm overflow-hidden rounded-3xl border border-emerald-100 bg-gradient-to-br from-emerald-50 to-emerald-100/70 shadow-lg shadow-emerald-500/10 md:max-w-md">
            <div className="flex h-full items-center justify-center">
              <div className="flex h-36 w-36 items-center justify-center rounded-[2rem] bg-gradient-to-br from-emerald-500 to-emerald-700 text-white shadow-2xl shadow-emerald-500/40">
                <Stethoscope size={72} />
              </div>
            </div>

            <div className="absolute top-4 left-4 flex items-center gap-2 rounded-2xl border border-emerald-100 bg-white/95 px-3 py-2 shadow-md backdrop-blur">
              <BadgeCheck size={16} className="text-emerald-600" />
              <div className="min-w-0">
                <b className="block text-[0.7rem] font-bold text-emerald-950">Local &amp; personal</b>
                <small className="block text-[0.62rem] text-slate-500">Care in your community</small>
              </div>
            </div>

            <span className="absolute right-6 bottom-6 text-2xl text-orange-400">✳</span>
          </div>

          <div>
            <span className="mb-3 inline-block rounded-full bg-emerald-100 px-3 py-1.5 text-[0.68rem] font-bold uppercase tracking-[0.18em] text-emerald-700">
              A little about us
            </span>
            <h2 className="mb-4 text-2xl font-extrabold leading-tight tracking-tight text-emerald-950 sm:text-3xl md:text-4xl">
              More than a store.
              <br />
              <em className="italic text-emerald-600">A familiar face when you need care.</em>
            </h2>
            <p className="mb-6 text-sm leading-relaxed text-slate-600 sm:text-base">
              At Prakash Medical and General Store, we want it to be easy for our
              neighbours to find everyday health essentials and general-store items.
              Visit us in Hanuman Nagar, Kumbhari, or contact us with your question.
            </p>

            <div className="mb-6 flex flex-wrap gap-3">
              <span className="inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-white px-3.5 py-2 text-xs font-semibold text-emerald-900 shadow-sm sm:text-sm">
                <ShieldCheck size={15} className="text-emerald-600" /> Customer-first approach
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-white px-3.5 py-2 text-xs font-semibold text-emerald-900 shadow-sm sm:text-sm">
                <HeartPulse size={15} className="text-emerald-600" /> Health and everyday needs
              </span>
            </div>

            <Link
              to="/about"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-500/25 transition hover:-translate-y-0.5 hover:shadow-xl hover:shadow-emerald-500/35 sm:text-base"
            >
              Get to know us <ArrowRight size={17} />
            </Link>
          </div>
        </div>
      </section>

      {/* ================= CONTACT BANNER ================= */}
      <div className="container mx-auto max-w-6xl px-4 pb-16 sm:px-6 sm:pb-20">
        <div className="relative flex flex-col items-start gap-4 overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-950 via-emerald-900 to-emerald-800 p-6 text-white shadow-2xl shadow-emerald-900/30 sm:flex-row sm:items-center sm:p-7 md:p-8">
          <div className="pointer-events-none absolute -top-20 -right-16 h-64 w-64 rounded-full bg-emerald-400/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -left-20 h-64 w-64 rounded-full bg-sky-400/10 blur-3xl" />

          <span className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/15 text-emerald-200">
            <HeartPulse size={26} />
          </span>

          <div className="relative min-w-0 flex-1">
            <span className="mb-1.5 block text-[0.68rem] font-bold uppercase tracking-[0.18em] text-emerald-200">
              Need help finding something?
            </span>
            <h2 className="text-xl font-extrabold leading-tight tracking-tight text-white sm:text-2xl md:text-3xl">
              We're just a call away.
            </h2>
            <p className="mt-1.5 text-sm leading-relaxed text-white/80 sm:text-base">
              For availability and store information, reach out to us directly.
            </p>
          </div>

          <a
            href="tel:9765428720"
            className="relative inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-500 px-5 py-3 text-sm font-semibold text-emerald-950 shadow-lg shadow-emerald-900/40 transition hover:-translate-y-0.5 hover:shadow-xl sm:w-auto sm:shrink-0 sm:text-base"
          >
            Call 9765428720 <ArrowUpRight size={17} />
          </a>
        </div>
      </div>
    </div>
  )
}