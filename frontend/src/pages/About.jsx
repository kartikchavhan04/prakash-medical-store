import { Link } from 'react-router-dom'
import {
  HeartPulse, ShieldCheck, Users, MapPin, ArrowRight, Sparkles, Leaf, HandHeart,
  Clock, Phone, Pill, Baby, Cross, ShoppingBasket,
} from 'lucide-react'
import ShopPhoto from '../components/ShopPhoto'

const shopGallery = [
  { title: 'Shop exterior', description: 'A view of Prakash Medical and General Store from outside.', src: '/images/shop/shop-front.jpg', alt: 'Exterior of Prakash Medical and General Store' },
  { title: 'Interior and medicine shelves', description: 'The shop interior and medicine shelves.', src: '/images/shop/shop-interior.jpg', alt: 'Interior and medicine shelves at Prakash Medical and General Store' },
  { title: 'Billing counter', description: 'The billing and customer-service counter.', src: '/images/shop/shop-counter.jpg', alt: 'Billing counter at Prakash Medical and General Store' },
  { title: 'General-store products', description: 'Everyday products available in the store.', src: '/images/shop/store-products.jpg', alt: 'General-store products at Prakash Medical and General Store' },
]

export default function About() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-emerald-50/40 via-white to-emerald-50/30 text-slate-800">

      {/* ================= HERO ================= */}
      <section className="relative overflow-hidden border-b border-emerald-100/70 bg-gradient-to-br from-white via-emerald-50/50 to-sky-50/40">
        {/* dotted pattern */}
        <div
          className="pointer-events-none absolute inset-0 opacity-50"
          style={{
            backgroundImage:
              'radial-gradient(circle at 1px 1px, rgba(15,157,118,0.12) 1px, transparent 0)',
            backgroundSize: '22px 22px',
          }}
        />
        {/* soft glows */}
        <div className="pointer-events-none absolute -top-32 -right-24 h-80 w-80 rounded-full bg-emerald-200/40 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 -left-24 h-80 w-80 rounded-full bg-sky-200/40 blur-3xl" />

        <div className="container relative mx-auto flex max-w-6xl flex-col items-start gap-8 px-4 py-12 sm:px-6 sm:py-16 md:flex-row md:items-center md:justify-between md:gap-16 md:py-20 lg:py-24">
          <div className="w-full md:max-w-2xl">
            <span className="mb-4 inline-block rounded-full bg-emerald-100 px-3 py-1.5 text-[0.68rem] font-bold uppercase tracking-[0.18em] text-emerald-700">
              About Prakash Medical
            </span>

            <h1 className="mb-4 text-3xl font-extrabold leading-tight tracking-tight text-emerald-950 sm:text-4xl md:text-5xl lg:text-6xl">
              Rooted in community.
              <br />
              <em className="italic text-emerald-600">Focused on care.</em>
            </h1>

            <p className="mb-6 max-w-xl text-base leading-relaxed text-slate-600 sm:text-lg">
              Your neighbourhood medical and general-store partner in Kumbhari — for the
              everyday health and household things you actually need.
            </p>

            {/* info chips */}
            <div className="mb-7 flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-100 bg-white px-3 py-1.5 text-xs font-semibold text-emerald-900 shadow-sm sm:text-sm">
                <MapPin size={14} className="text-emerald-600" /> Hanuman Nagar, Kumbhari
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-100 bg-white px-3 py-1.5 text-xs font-semibold text-emerald-900 shadow-sm sm:text-sm">
                <Clock size={14} className="text-emerald-600" /> Visit or contact first
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-100 bg-white px-3 py-1.5 text-xs font-semibold text-emerald-900 shadow-sm sm:text-sm">
                <Sparkles size={14} className="text-emerald-600" /> Local &amp; family-run
              </span>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Link
                to="/contact"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-500/25 transition hover:-translate-y-0.5 hover:shadow-xl hover:shadow-emerald-500/35 sm:text-base"
              >
                Visit or contact us <ArrowRight size={17} />
              </Link>
              <Link
                to="/products"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-emerald-100 bg-white px-5 py-3 text-sm font-semibold text-emerald-900 transition hover:border-emerald-400 hover:bg-emerald-50 sm:text-base"
              >
                Browse catalogue
              </Link>
            </div>
          </div>

          {/* Hero icon (desktop only) */}
          <div className="hidden md:flex md:items-center md:justify-center">
            <div className="flex h-32 w-32 items-center justify-center rounded-3xl bg-gradient-to-br from-emerald-500 to-emerald-700 text-white shadow-2xl shadow-emerald-500/40">
              <HeartPulse size={52} />
            </div>
          </div>
        </div>
      </section>

      {/* ================= QUICK INFO STRIP ================= */}
      <section className="bg-emerald-950 py-5 text-white sm:py-6">
        <div className="container mx-auto grid max-w-6xl grid-cols-1 gap-4 px-4 sm:grid-cols-3 sm:gap-6 sm:px-6">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10 text-emerald-200">
              <MapPin size={18} />
            </span>
            <div>
              <b className="block text-sm font-semibold">Find us</b>
              <p className="text-xs leading-snug text-white/75">Hanuman Nagar, Kumbhari, Maharashtra</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10 text-emerald-200">
              <Phone size={18} />
            </span>
            <div>
              <b className="block text-sm font-semibold">Reach us</b>
              <p className="text-xs leading-snug text-white/75">Call or message before your visit</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10 text-emerald-200">
              <ShoppingBasket size={18} />
            </span>
            <div>
              <b className="block text-sm font-semibold">What we keep</b>
              <p className="text-xs leading-snug text-white/75">Medical, personal care &amp; general store</p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= SHOP PHOTO GALLERY ================= */}
      <section className="py-12 sm:py-14 md:py-16">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mb-7 max-w-2xl">
            <span className="mb-3 inline-block rounded-full bg-emerald-100 px-3 py-1.5 text-[0.68rem] font-bold uppercase tracking-[0.18em] text-emerald-700">
              Our shop
            </span>
            <h2 className="text-2xl font-extrabold tracking-tight text-emerald-950 sm:text-3xl md:text-4xl">
              Inside <em className="italic text-emerald-600">Prakash Medical and General Store.</em>
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-600 sm:text-base">
              Photos of our shop exterior, medicine shelves, billing counter and general-store products.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4">
            {shopGallery.map(({ title, description, src, alt }, index) => (
              <figure key={title} className="overflow-hidden rounded-2xl border border-emerald-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg hover:shadow-emerald-900/5">
                <ShopPhoto src={src} alt={alt} loading={index === 0 ? 'eager' : 'lazy'} />
                <figcaption className="p-4">
                  <strong className="block text-sm font-bold text-emerald-950">{title}</strong>
                  <span className="mt-1 block text-xs leading-relaxed text-slate-500">{description}</span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* ================= STORY ================= */}
      <section className="py-14 sm:py-16 md:py-20">
        <div className="container mx-auto grid max-w-6xl grid-cols-1 items-center gap-10 px-4 sm:px-6 md:grid-cols-2 md:gap-14">
          {/* illustration */}
          <div className="relative mx-auto aspect-square w-full max-w-sm overflow-hidden rounded-3xl border border-emerald-100 bg-gradient-to-br from-emerald-50 to-emerald-100/70 shadow-lg shadow-emerald-500/10 md:max-w-md">
            <div className="flex h-full items-center justify-center">
              <div className="flex h-36 w-36 items-center justify-center rounded-[2rem] bg-gradient-to-br from-emerald-500 to-emerald-700 text-white shadow-2xl shadow-emerald-500/40">
                <HeartPulse size={72} />
              </div>
            </div>

            <span className="absolute top-6 right-8 text-2xl text-orange-400">✦</span>
            <span className="absolute bottom-20 left-6 text-2xl text-blue-500">✳</span>

            <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-2 whitespace-nowrap rounded-full border border-emerald-100 bg-white px-3.5 py-2 text-[0.72rem] font-semibold text-emerald-900 shadow-md sm:text-xs">
              <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
              A familiar face, close to home
            </div>
          </div>

          {/* copy */}
          <div>
            <span className="mb-3 inline-block rounded-full bg-emerald-100 px-3 py-1.5 text-[0.68rem] font-bold uppercase tracking-[0.18em] text-emerald-700">
              Our story
            </span>
            <h2 className="mb-4 text-2xl font-extrabold leading-tight tracking-tight text-emerald-950 sm:text-3xl md:text-4xl">
              Small store. <em className="italic text-emerald-600">Big care.</em>
            </h2>
            <div className="space-y-3 text-sm leading-relaxed text-slate-600 sm:text-base">
              <p>
                Prakash Medical and General Store is here to make everyday health and
                household essentials easier to find for the people in our neighbourhood.
              </p>
              <p>
                We believe a local store should feel approachable: a place where customers
                can ask about product availability, get store information, and find a
                helpful point of contact.
              </p>
              <p>
                Visit us at Hanuman Nagar, Kumbhari, or get in touch before your visit. We
                look forward to serving our community with care.
              </p>
            </div>
            <Link
              to="/contact"
              className="mt-6 inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-500/25 transition hover:-translate-y-0.5 hover:shadow-xl hover:shadow-emerald-500/35 sm:text-base"
            >
              Visit or contact us <ArrowRight size={17} />
            </Link>
          </div>
        </div>
      </section>

      {/* ================= VALUES ================= */}
      <section className="border-y border-emerald-100 bg-white py-14 sm:py-16 md:py-20">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mx-auto mb-10 max-w-2xl text-center sm:mb-14">
            <span className="mb-3 inline-block rounded-full bg-emerald-100 px-3 py-1.5 text-[0.68rem] font-bold uppercase tracking-[0.18em] text-emerald-700">
              What matters to us
            </span>
            <h2 className="mb-2 text-2xl font-extrabold leading-tight tracking-tight text-emerald-950 sm:text-3xl md:text-4xl">
              Care in the <em className="italic text-emerald-600">little things.</em>
            </h2>
            <p className="text-sm text-slate-600 sm:text-base">
              Our approach to serving customers every day.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4">
            {[
              {
                icon: HandHeart, tone: 'green', title: 'A personal touch',
                text: 'Helpful, local service that treats every customer with respect.',
              },
              {
                icon: ShieldCheck, tone: 'blue', title: 'Health-minded',
                text: 'We take medical products seriously and encourage customers to follow qualified medical advice.',
              },
              {
                icon: Users, tone: 'orange', title: 'Community first',
                text: 'Here to support the everyday needs of families in and around Kumbhari.',
              },
              {
                icon: Leaf, tone: 'mint', title: 'Everyday essentials',
                text: 'A mix of medical, personal-care and general-store categories in one place.',
              },
            ].map(({ icon: Icon, tone, title, text }) => {
              const tones = {
                green: 'bg-emerald-100 text-emerald-600',
                blue: 'bg-blue-100 text-blue-600',
                orange: 'bg-orange-100 text-orange-500',
                mint: 'bg-teal-100 text-teal-600',
              }
              return (
                <div
                  key={title}
                  className="group rounded-2xl border border-emerald-100 bg-emerald-50/40 p-5 transition hover:-translate-y-1 hover:border-emerald-400 hover:bg-white hover:shadow-lg hover:shadow-emerald-500/10 sm:p-6"
                >
                  <span className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl ${tones[tone]}`}>
                    <Icon size={22} />
                  </span>
                  <h3 className="mb-1.5 text-base font-bold text-emerald-950 sm:text-lg">{title}</h3>
                  <p className="text-sm leading-relaxed text-slate-600">{text}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ================= CATALOGUE ================= */}
      <section className="py-14 sm:py-16 md:py-20">
        <div className="container mx-auto grid max-w-6xl grid-cols-1 items-start gap-10 px-4 sm:px-6 md:grid-cols-2 md:gap-14">
          <div>
            <span className="mb-3 inline-block rounded-full bg-emerald-100 px-3 py-1.5 text-[0.68rem] font-bold uppercase tracking-[0.18em] text-emerald-700">
              What you can find
            </span>
            <h2 className="mb-4 text-2xl font-extrabold leading-tight tracking-tight text-emerald-950 sm:text-3xl md:text-4xl">
              From health basics to <em className="italic text-emerald-600">daily needs.</em>
            </h2>
            <p className="text-sm leading-relaxed text-slate-600 sm:text-base">
              Our online catalogue helps you explore categories available at the store.
              Please confirm current stock and pricing with our team.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            {[
              { icon: Pill, label: 'Medical and wellness products', note: 'Everyday health basics' },
              { icon: Baby, label: 'Personal care and baby care', note: 'Daily-use essentials' },
              { icon: Cross, label: 'First aid and surgical items', note: 'For minor home needs' },
              { icon: ShoppingBasket, label: 'General-store essentials', note: 'Household picks' },
            ].map(({ icon: Icon, label, note }, i) => (
              <div
                key={label}
                className="grid grid-cols-[auto_auto_1fr] items-center gap-3.5 rounded-2xl border border-emerald-100 bg-white px-4 py-3.5 transition hover:translate-x-1 hover:border-emerald-400 hover:shadow-md hover:shadow-emerald-500/10"
              >
                <i className="rounded-lg bg-emerald-100 px-2 py-1 text-[0.7rem] font-extrabold not-italic tracking-wider text-emerald-700">
                  {String(i + 1).padStart(2, '0')}
                </i>
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                  <Icon size={18} />
                </span>
                <span className="flex flex-col">
                  <b className="text-sm font-semibold text-emerald-950 sm:text-[0.95rem]">{label}</b>
                  <small className="text-xs text-slate-500">{note}</small>
                </span>
              </div>
            ))}

            <Link
              to="/products"
              className="mt-1 inline-flex items-center gap-2 text-sm font-bold text-emerald-700 transition hover:gap-3 hover:text-emerald-500 sm:text-base"
            >
              Explore the catalogue <ArrowRight size={17} />
            </Link>
          </div>
        </div>
      </section>

      {/* ================= ADDRESS CTA ================= */}
      <div className="container mx-auto max-w-6xl px-4 pb-16 sm:px-6 sm:pb-20">
        <div className="relative flex flex-col items-start gap-4 overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-950 to-emerald-800 p-6 text-white shadow-2xl shadow-emerald-900/30 sm:flex-row sm:items-center sm:p-7 md:p-8">
          <div className="pointer-events-none absolute -top-16 -right-16 h-48 w-48 rounded-full bg-emerald-400/25 blur-3xl" />

          <span className="relative flex h-13 w-13 shrink-0 items-center justify-center rounded-2xl bg-white/15 p-3 text-emerald-200">
            <MapPin size={25} />
          </span>
          <div className="relative">
            <b className="block text-base font-bold sm:text-lg">Come say hello</b>
            <p className="text-sm text-white/75 sm:text-base">Hanuman Nagar, Kumbhari · Maharashtra</p>
          </div>
          <a
            href="https://www.google.com/maps/search/?api=1&query=Prakash+Medical+and+General+Store+Hanuman+Nagar+Kumbhari"
            target="_blank"
            rel="noreferrer"
            className="relative w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-900/40 transition hover:-translate-y-0.5 hover:shadow-xl sm:w-auto sm:ml-auto sm:text-base"
          >
            Open Google Maps <ArrowRight size={16} />
          </a>
        </div>
      </div>
    </main>
  )
}