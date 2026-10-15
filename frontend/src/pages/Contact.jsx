import { useEffect, useState } from 'react'
import {
  MapPin, Phone, Mail, Clock, Send, HeartPulse, UserRound,
  PhoneCall, ArrowUpRight, ArrowRight,
} from 'lucide-react'
import toast from 'react-hot-toast'
import api, { imageUrl } from '../api'

export default function Contact() {
  const [staff, setStaff] = useState([])
  const [form, setForm] = useState({ name: '', email: '', mobile: '', message: '' })
  const [sending, setSending] = useState(false)

  useEffect(() => {
    api.get('/staff')
      .then(({ data }) => setStaff(data.staff || []))
      .catch(() => {})
  }, [])

  const update = event => setForm({ ...form, [event.target.name]: event.target.value })

  const submit = async event => {
    event.preventDefault()
    setSending(true)
    try {
      const { data } = await api.post('/contact', form)
      toast.success(data.message)
      setForm({ name: '', email: '', mobile: '', message: '' })
    } catch (error) {
      toast.error(error.response?.data?.message || 'Message could not be sent. Please try again.')
    } finally {
      setSending(false)
    }
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
              We're here to help
            </span>
            <h1 className="mb-4 text-3xl font-extrabold leading-tight tracking-tight text-emerald-950 sm:text-4xl md:text-5xl lg:text-6xl">
              Let's talk <em className="italic text-emerald-600">care.</em>
            </h1>
            <p className="max-w-xl text-base leading-relaxed text-slate-600 sm:text-lg">
              Ask about store information, catalogue items, or how to reach us.
            </p>
          </div>

          <div className="hidden md:flex md:items-center md:justify-center">
            <div className="flex h-32 w-32 items-center justify-center rounded-3xl bg-gradient-to-br from-emerald-500 to-emerald-700 text-white shadow-2xl shadow-emerald-500/40">
              <HeartPulse size={52} />
            </div>
          </div>
        </div>
      </section>

      {/* ================= STORE DETAILS ================= */}
      <section className="py-14 sm:py-16 md:py-20">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mb-8 max-w-2xl">
            <span className="mb-3 inline-block rounded-full bg-emerald-100 px-3 py-1.5 text-[0.68rem] font-bold uppercase tracking-[0.18em] text-emerald-700">
              Find Our Store
            </span>
            <h2 className="mb-3 text-2xl font-extrabold leading-tight tracking-tight text-emerald-950 sm:text-3xl md:text-4xl">
              Visit <em className="italic text-emerald-600">our store.</em>
            </h2>
            <p className="text-sm leading-relaxed text-slate-600 sm:text-base">
              Prakash Medical and General Store · Hanuman Nagar, Kumbhari
            </p>
          </div>

          {/* Info cards + Map */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.05fr_1fr] lg:gap-8">

            {/* Info cards */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

              {/* Visit */}
              <div className="flex items-start gap-3 rounded-2xl border border-emerald-100 bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:border-emerald-300 hover:shadow-lg hover:shadow-emerald-500/10 sm:p-5">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
                  <MapPin size={19} />
                </span>
                <div className="min-w-0">
                  <small className="block text-[0.68rem] font-bold uppercase tracking-wide text-slate-500">
                    Visit us
                  </small>
                  <b className="mt-0.5 block break-words text-sm font-bold text-emerald-950 sm:text-base">
                    Hanuman Nagar, Kumbhari
                  </b>
                  <a
                    href="https://www.google.com/maps/dir/?api=1&destination=19.8816085%2C77.3493388"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-emerald-700 transition hover:gap-2 hover:text-emerald-500 sm:text-sm"
                  >
                    Get directions <ArrowUpRight size={13} />
                  </a>
                </div>
              </div>

              {/* Call */}
              <div className="flex items-start gap-3 rounded-2xl border border-emerald-100 bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:border-emerald-300 hover:shadow-lg hover:shadow-emerald-500/10 sm:p-5">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-blue-100 text-blue-700">
                  <Phone size={19} />
                </span>
                <div className="min-w-0">
                  <small className="block text-[0.68rem] font-bold uppercase tracking-wide text-slate-500">
                    Call us
                  </small>
                  <b className="mt-0.5 block break-words text-sm font-bold text-emerald-950 sm:text-base">
                    9322736544
                  </b>
                  <a
                    href="tel:+919322736544"
                    className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-emerald-700 transition hover:gap-2 hover:text-emerald-500 sm:text-sm"
                  >
                    Tap to call <ArrowUpRight size={13} />
                  </a>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start gap-3 rounded-2xl border border-emerald-100 bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:border-emerald-300 hover:shadow-lg hover:shadow-emerald-500/10 sm:p-5">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-orange-100 text-orange-600">
                  <Mail size={19} />
                </span>
                <div className="min-w-0">
                  <small className="block text-[0.68rem] font-bold uppercase tracking-wide text-slate-500">
                    Email us
                  </small>
                  <b className="mt-0.5 block break-words text-sm font-bold text-emerald-950 sm:text-base">
                    dp0088238@gmail.com
                  </b>
                  <a
                    href="mailto:dp0088238@gmail.com"
                    className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-emerald-700 transition hover:gap-2 hover:text-emerald-500 sm:text-sm"
                  >
                    Send an email <ArrowUpRight size={13} />
                  </a>
                </div>
              </div>

              {/* Timings */}
              <div className="flex items-start gap-3 rounded-2xl border border-emerald-100 bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:border-emerald-300 hover:shadow-lg hover:shadow-emerald-500/10 sm:p-5">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-violet-100 text-violet-700">
                  <Clock size={19} />
                </span>
                <div className="min-w-0">
                  <small className="block text-[0.68rem] font-bold uppercase tracking-wide text-slate-500">
                    Store timings
                  </small>
                  <b className="mt-0.5 block break-words text-sm font-bold text-emerald-950 sm:text-base">
                    Please call to confirm
                  </b>
                  <small className="mt-1 block text-xs text-slate-500">
                    Timings may vary on holidays.
                  </small>
                </div>
              </div>
            </div>

            {/* Map */}
            <div className="relative overflow-hidden rounded-3xl border border-emerald-100 bg-white shadow-lg shadow-emerald-500/10">
              <iframe
                title="Map to Prakash Medical and General Store"
                src="https://www.google.com/maps?q=19.8816085,77.3493388&z=18&output=embed"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="h-[280px] w-full sm:h-[340px] lg:h-full lg:min-h-[420px]"
                style={{ border: 0 }}
              />
              <a
                href="https://www.google.com/maps/dir/?api=1&destination=19.8816085%2C77.3493388"
                target="_blank"
                rel="noopener noreferrer"
                className="absolute bottom-4 left-1/2 inline-flex -translate-x-1/2 items-center gap-1.5 whitespace-nowrap rounded-full border border-emerald-100 bg-white/95 px-4 py-2 text-xs font-bold text-emerald-900 shadow-lg backdrop-blur transition hover:border-emerald-400 hover:bg-white sm:text-sm"
              >
                Get Directions <ArrowUpRight size={13} />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ================= STAFF SECTION ================= */}
      {staff.length > 0 && (
        <section className="border-y border-emerald-100 bg-white py-14 sm:py-16 md:py-20">
          <div className="container mx-auto max-w-6xl px-4 sm:px-6">
            <div className="mx-auto mb-10 max-w-2xl text-center sm:mb-14">
              <span className="mb-3 inline-block rounded-full bg-emerald-100 px-3 py-1.5 text-[0.68rem] font-bold uppercase tracking-[0.18em] text-emerald-700">
                Meet the team
              </span>
              <h2 className="mb-2 text-2xl font-extrabold leading-tight tracking-tight text-emerald-950 sm:text-3xl md:text-4xl">
                People behind <em className="italic text-emerald-600">the counter.</em>
              </h2>
              <p className="text-sm text-slate-600 sm:text-base">
                Store team details are maintained by the administrator.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {staff.map(person => (
                <article
                  key={person.id}
                  className="group flex flex-col overflow-hidden rounded-2xl border border-emerald-100 bg-white shadow-sm transition hover:-translate-y-1 hover:border-emerald-300 hover:shadow-lg hover:shadow-emerald-500/10"
                >
                  {/* Image */}
                  <div className="aspect-[16/10] w-full overflow-hidden bg-emerald-50">
                    {person.image
                      ? (
                        <img
                          src={imageUrl(person.image)}
                          alt={person.name}
                          loading="lazy"
                          className="h-full w-full object-cover object-top transition group-hover:scale-105"
                        />
                      )
                      : (
                        <span className="flex h-full w-full items-center justify-center bg-gradient-to-br from-emerald-50 to-emerald-100 text-emerald-600">
                          <UserRound size={42} />
                        </span>
                      )}
                  </div>

                  {/* Body */}
                  <div className="flex flex-1 flex-col p-5">
                    <b className="break-words text-base font-bold text-emerald-950 sm:text-[1.05rem]">
                      {person.name}
                    </b>
                    <small className="mt-1 inline-block self-start rounded-full bg-emerald-100 px-2.5 py-0.5 text-[0.68rem] font-bold text-emerald-700">
                      {person.title}
                    </small>

                    {person.description && (
                      <p className="mt-3 text-xs leading-relaxed text-slate-600 sm:text-sm">
                        {person.description}
                      </p>
                    )}

                    {(person.phone || person.email) && (
                      <div className="mt-auto flex flex-col gap-2 border-t border-emerald-100 pt-3"
                           style={{ marginTop: 'auto', paddingTop: '12px' }}>
                        {person.phone && (
                          <a
                            href={`tel:${person.phone}`}
                            className="flex items-start gap-2 text-xs text-slate-600 transition hover:text-emerald-700 sm:text-sm"
                          >
                            <PhoneCall size={14} className="mt-0.5 shrink-0 text-emerald-600" />
                            <span className="break-all">{person.phone}</span>
                          </a>
                        )}
                        {person.email && (
                          <a
                            href={`mailto:${person.email}`}
                            className="flex items-start gap-2 text-xs text-slate-600 transition hover:text-emerald-700 sm:text-sm"
                          >
                            <Mail size={14} className="mt-0.5 shrink-0 text-emerald-600" />
                            <span className="break-all">{person.email}</span>
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ================= CONTACT FORM ================= */}
      <section className="py-14 sm:py-16 md:py-20">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mx-auto max-w-2xl">

            {/* Form head */}
            <div className="mb-6 flex items-center gap-3 sm:mb-8 sm:gap-4">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-700 text-white shadow-lg shadow-emerald-500/30">
                <Send size={20} />
              </span>
              <div>
                <h2 className="text-xl font-extrabold leading-tight tracking-tight text-emerald-950 sm:text-2xl md:text-3xl">
                  Send us a message
                </h2>
                <p className="mt-0.5 text-sm text-slate-600 sm:text-base">
                  We'll get back to you as soon as we can.
                </p>
              </div>
            </div>

            {/* Form card */}
            <form
              onSubmit={submit}
              className="flex flex-col gap-4 rounded-3xl border border-emerald-100 bg-white p-5 shadow-lg shadow-emerald-500/5 sm:p-7 md:p-8"
            >
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
                  placeholder="Your name"
                  autoComplete="name"
                  className="w-full rounded-xl border border-emerald-100 bg-emerald-50/40 px-4 py-3 text-sm text-emerald-950 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/15 sm:text-base"
                />
              </label>

              {/* Email + Mobile */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <label className="flex flex-col gap-1.5">
                  <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Email address
                  </span>
                  <input
                    required
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={update}
                    placeholder="you@example.com"
                    autoComplete="email"
                    className="w-full rounded-xl border border-emerald-100 bg-emerald-50/40 px-4 py-3 text-sm text-emerald-950 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/15 sm:text-base"
                  />
                </label>
                <label className="flex flex-col gap-1.5">
                  <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Mobile number
                  </span>
                  <input
                    required
                    name="mobile"
                    value={form.mobile}
                    onChange={update}
                    placeholder="Your phone number"
                    autoComplete="tel"
                    className="w-full rounded-xl border border-emerald-100 bg-emerald-50/40 px-4 py-3 text-sm text-emerald-950 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/15 sm:text-base"
                  />
                </label>
              </div>

              {/* Message */}
              <label className="flex flex-col gap-1.5">
                <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Your message
                </span>
                <textarea
                  required
                  name="message"
                  value={form.message}
                  onChange={update}
                  placeholder="How can we help you?"
                  rows="5"
                  maxLength={5000}
                  className="w-full resize-none rounded-xl border border-emerald-100 bg-emerald-50/40 px-4 py-3 text-sm text-emerald-950 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/15 sm:text-base"
                />
              </label>

              {/* Submit */}
              <button
                disabled={sending}
                className="mt-1 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-emerald-500/25 transition hover:-translate-y-0.5 hover:shadow-xl hover:shadow-emerald-500/35 disabled:cursor-not-allowed disabled:opacity-70 sm:text-base"
              >
                {sending ? 'Sending…' : 'Send message'} <Send size={17} />
              </button>

              <p className="text-xs leading-relaxed text-slate-500 sm:text-sm">
                Your message will be saved for the store team. Please don't send urgent
                medical issues through this form.
              </p>
            </form>
          </div>
        </div>
      </section>
    </main>
  )
}