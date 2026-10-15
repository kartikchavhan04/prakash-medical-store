import { useEffect, useState } from 'react'
import {
  Plus, Search, Pencil, Trash2, X, Users, Mail, Phone, RefreshCw, ImagePlus,
} from 'lucide-react'
import toast from 'react-hot-toast'
import api, { imageUrl } from '../api'

const emptyForm = { name: '', title: '', description: '', phone: '', email: '' }

export default function AdminStaff() {
  const [staff, setStaff] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [modal, setModal] = useState(false)
  const [editId, setEditId] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [file, setFile] = useState(null)
  const [saving, setSaving] = useState(false)

  const load = () => {
    setLoading(true)
    api.get('/staff')
      .then(({ data }) => setStaff(data.staff || []))
      .catch(err => toast.error(err.response?.data?.message || 'Could not load staff cards.'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const openAdd = () => {
    setEditId(null); setForm(emptyForm); setFile(null); setModal(true)
  }

  const openEdit = item => {
    setEditId(item.id)
    setForm({
      name: item.name || '',
      title: item.title || '',
      description: item.description || '',
      phone: item.phone || '',
      email: item.email || '',
    })
    setFile(null); setModal(true)
  }

  const update = e => setForm({ ...form, [e.target.name]: e.target.value })

  const submit = async e => {
    e.preventDefault()
    const body = new FormData()
    Object.entries(form).forEach(([k, v]) => body.append(k, v))
    if (file) body.append('image', file)
    setSaving(true)
    try {
      if (editId) await api.put(`/staff/${editId}`, body)
      else await api.post('/staff', body)
      toast.success(editId ? 'Staff card updated.' : 'Staff card created.')
      setModal(false); load()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not save staff card.')
    } finally {
      setSaving(false)
    }
  }

  const remove = async item => {
    if (!window.confirm(`Delete the staff card for ${item.name}?`)) return
    try {
      await api.delete(`/staff/${item.id}`)
      toast.success('Staff card deleted.')
      load()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not delete staff card.')
    }
  }

  const visible = staff.filter(item =>
    `${item.name} ${item.title} ${item.email}`.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50/40 via-white to-emerald-50/30 px-4 py-8 text-slate-800 sm:px-6 sm:py-10 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-6">

        {/* ================= PAGE HEADING ================= */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <span className="mb-3 inline-block rounded-full bg-emerald-100 px-3 py-1.5 text-[0.68rem] font-bold uppercase tracking-[0.18em] text-emerald-700">
              Contact page content
            </span>
            <h1 className="text-2xl font-extrabold leading-tight tracking-tight text-emerald-950 sm:text-3xl md:text-4xl">
              People &amp; <em className="italic text-emerald-600">staff cards.</em>
            </h1>
            <p className="mt-1 text-sm text-slate-600 sm:text-base">
              Manage the owner, doctor and staff details displayed to customers.
            </p>
          </div>

          <button
            onClick={openAdd}
            className="inline-flex items-center justify-center gap-2 self-start rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-500/25 transition hover:-translate-y-0.5 hover:shadow-xl hover:shadow-emerald-500/35 sm:self-auto sm:text-base"
          >
            <Plus size={17} /> Add staff card
          </button>
        </div>

        {/* ================= INFO NOTE ================= */}
        <div className="flex items-start gap-3 rounded-2xl border border-emerald-100 bg-gradient-to-br from-emerald-50 via-white to-emerald-50/60 p-4 sm:p-5">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
            <Users size={18} />
          </span>
          <p className="text-sm leading-relaxed text-slate-600 sm:text-base">
            Every card you add here is published in the{' '}
            <b className="font-bold text-emerald-950">Meet the team</b> section of the
            public Contact page. Add only information that is approved to be displayed
            publicly.
          </p>
        </div>

        {/* ================= STAFF PANEL ================= */}
        <section className="overflow-hidden rounded-3xl border border-emerald-100 bg-white shadow-lg shadow-emerald-500/5">

          {/* ---- Toolbar ---- */}
          <div className="flex flex-col gap-4 border-b border-emerald-100 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
            <div>
              <h3 className="flex items-center gap-2 text-base font-bold text-emerald-950 sm:text-lg">
                Staff directory
                <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-700">
                  {staff.length}
                </span>
              </h3>
              <p className="mt-0.5 text-xs text-slate-500 sm:text-sm">
                All staff cards are managed here.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <label className="relative flex-1 sm:flex-initial">
                <Search size={15} className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-emerald-500" />
                <input
                  placeholder="Search staff…"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="w-full rounded-xl border border-emerald-100 bg-emerald-50/40 py-2.5 pr-3 pl-9 text-sm text-emerald-950 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/15 sm:w-64"
                />
              </label>
              <button
                title="Refresh list"
                onClick={load}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-emerald-100 bg-white text-emerald-700 transition hover:border-emerald-400 hover:bg-emerald-50"
              >
                <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
              </button>
            </div>
          </div>

          {/* ---- Content ---- */}
          {loading ? (
            <div className="px-4 py-16 text-center text-sm text-slate-500">
              Loading staff cards…
            </div>
          ) : !visible.length ? (
            <div className="flex flex-col items-center px-4 py-16 text-center">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
                <Users size={26} />
              </div>
              <h3 className="text-base font-bold text-emerald-950 sm:text-lg">
                {staff.length ? 'No matching staff' : 'No staff cards yet'}
              </h3>
              <p className="mt-1 max-w-sm text-sm text-slate-500">
                {staff.length
                  ? 'Try another search.'
                  : 'Add the first card to introduce your team on the Contact page.'}
              </p>
              {!staff.length && (
                <button
                  onClick={openAdd}
                  className="mt-5 inline-flex items-center gap-2 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-emerald-500/25 transition hover:-translate-y-0.5 hover:shadow-xl"
                >
                  <Plus size={16} /> Add staff card
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2 sm:gap-5 sm:p-5 lg:grid-cols-3">

              {visible.map(item => (
                <article
                  key={item.id}
                  className="group flex flex-col gap-4 rounded-2xl border border-emerald-100 bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:border-emerald-300 hover:shadow-lg hover:shadow-emerald-500/10 sm:p-5"
                >
                  {/* ---- Head: avatar + name + actions ---- */}
                  <div className="flex items-start gap-3">
                    <span className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-emerald-100 bg-emerald-50 text-emerald-700 sm:h-16 sm:w-16">
                      {item.image
                        ? (
                          <img
                            src={imageUrl(item.image)}
                            alt={item.name}
                            className="h-full w-full object-cover object-top"
                          />
                        )
                        : <Users size={26} />}
                    </span>

                    <div className="min-w-0 flex-1">
                      <b className="block truncate text-[0.95rem] font-bold text-emerald-950 sm:text-base">
                        {item.name}
                      </b>
                      <span className="mt-0.5 inline-block rounded-full bg-emerald-100 px-2.5 py-0.5 text-[0.68rem] font-bold text-emerald-700">
                        {item.title}
                      </span>
                    </div>

                    <div className="flex shrink-0 items-center gap-1.5">
                      <button
                        onClick={() => openEdit(item)}
                        title="Edit"
                        aria-label={`Edit ${item.name}`}
                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-emerald-100 bg-white text-emerald-700 transition hover:border-emerald-400 hover:bg-emerald-50"
                      >
                        <Pencil size={15} />
                      </button>
                      <button
                        onClick={() => remove(item)}
                        title="Delete"
                        aria-label={`Delete ${item.name}`}
                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-red-100 bg-white text-red-600 transition hover:border-red-300 hover:bg-red-50"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>

                  {/* ---- Description ---- */}
                  {item.description && (
                    <p className="line-clamp-3 text-sm leading-relaxed text-slate-600">
                      {item.description}
                    </p>
                  )}

                  {/* ---- Contact info ---- */}
                  {(item.phone || item.email) && (
                    <div className="mt-auto flex flex-col gap-2 border-t border-emerald-100 pt-3">
                      {item.phone && (
                        <span className="flex items-center gap-2 text-xs text-slate-600 sm:text-sm">
                          <Phone size={14} className="shrink-0 text-emerald-600" />
                          <span className="truncate">{item.phone}</span>
                        </span>
                      )}
                      {item.email && (
                        <span className="flex items-center gap-2 text-xs text-slate-600 sm:text-sm">
                          <Mail size={14} className="shrink-0 text-emerald-600" />
                          <span className="truncate">{item.email}</span>
                        </span>
                      )}
                    </div>
                  )}
                </article>
              ))}
            </div>
          )}
        </section>
      </div>

      {/* ================= MODAL ================= */}
      {modal && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-emerald-950/40 p-0 backdrop-blur-sm sm:items-center sm:p-4"
          onMouseDown={e => { if (e.target === e.currentTarget) setModal(false) }}
        >
          <section className="flex max-h-[92vh] w-full max-w-lg flex-col overflow-hidden rounded-t-3xl border border-emerald-100 bg-white shadow-2xl sm:rounded-3xl">

            {/* Modal head */}
            <div className="flex items-start justify-between gap-3 border-b border-emerald-100 p-5 sm:p-6">
              <div>
                <span className="mb-2 inline-block rounded-full bg-emerald-100 px-2.5 py-1 text-[0.65rem] font-bold uppercase tracking-[0.18em] text-emerald-700">
                  Team profile
                </span>
                <h2 className="text-lg font-extrabold text-emerald-950 sm:text-xl">
                  {editId ? 'Edit staff card' : 'Add staff card'}
                </h2>
                <p className="mt-0.5 text-xs text-slate-500 sm:text-sm">
                  This information will be public on your Contact page.
                </p>
              </div>
              <button
                onClick={() => setModal(false)}
                aria-label="Close dialog"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-emerald-100 bg-white text-emerald-700 transition hover:border-emerald-400 hover:bg-emerald-50"
              >
                <X size={17} />
              </button>
            </div>

            {/* Modal form */}
            <form onSubmit={submit} className="flex flex-1 flex-col overflow-hidden">
              <div className="flex-1 space-y-4 overflow-y-auto p-5 sm:p-6">

                {/* Name */}
                <label className="flex flex-col gap-1.5">
                  <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Full name *
                  </span>
                  <input
                    required
                    name="name"
                    value={form.name}
                    onChange={update}
                    placeholder="e.g. Staff member name"
                    className="w-full rounded-xl border border-emerald-100 bg-emerald-50/40 px-4 py-3 text-sm text-emerald-950 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/15 sm:text-base"
                  />
                </label>

                {/* Title */}
                <label className="flex flex-col gap-1.5">
                  <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Role / title *
                  </span>
                  <input
                    required
                    name="title"
                    value={form.title}
                    onChange={update}
                    placeholder="Owner, Pharmacist, Store assistant…"
                    className="w-full rounded-xl border border-emerald-100 bg-emerald-50/40 px-4 py-3 text-sm text-emerald-950 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/15 sm:text-base"
                  />
                </label>

                {/* Description */}
                <label className="flex flex-col gap-1.5">
                  <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Description
                  </span>
                  <textarea
                    rows="3"
                    name="description"
                    value={form.description}
                    onChange={update}
                    placeholder="Optional short introduction"
                    className="w-full resize-none rounded-xl border border-emerald-100 bg-emerald-50/40 px-4 py-3 text-sm text-emerald-950 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/15 sm:text-base"
                  />
                </label>

                {/* Phone + Email */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <label className="flex flex-col gap-1.5">
                    <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Phone number
                    </span>
                    <input
                      name="phone"
                      value={form.phone}
                      onChange={update}
                      placeholder="Contact number"
                      className="w-full rounded-xl border border-emerald-100 bg-emerald-50/40 px-4 py-3 text-sm text-emerald-950 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/15 sm:text-base"
                    />
                  </label>
                  <label className="flex flex-col gap-1.5">
                    <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Email address
                    </span>
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={update}
                      placeholder="name@example.com"
                      className="w-full rounded-xl border border-emerald-100 bg-emerald-50/40 px-4 py-3 text-sm text-emerald-950 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/15 sm:text-base"
                    />
                  </label>
                </div>

                {/* Upload */}
                <label className="flex flex-col gap-1.5">
                  <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Profile image
                  </span>
                  <span className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-emerald-200 bg-emerald-50/40 px-4 py-6 text-center transition hover:border-emerald-400 hover:bg-emerald-50">
                    <ImagePlus size={22} className="text-emerald-600" />
                    <span className="text-sm font-semibold text-emerald-900">
                      Click to choose an image
                    </span>
                    <input
                      type="file"
                      accept="image/png,image/jpeg,image/webp,image/gif"
                      onChange={e => setFile(e.target.files?.[0] || null)}
                      className="hidden"
                    />
                    <small className="text-xs text-slate-500">
                      {editId
                        ? 'Select a new image to replace the existing one.'
                        : 'Optional. JPG, PNG, WEBP or GIF.'}
                    </small>
                    {file && (
                      <span className="mt-1 inline-block max-w-full truncate rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700">
                        {file.name}
                      </span>
                    )}
                  </span>
                </label>
              </div>

              {/* Modal actions */}
              <div className="flex flex-col gap-2.5 border-t border-emerald-100 p-5 sm:flex-row sm:justify-end sm:p-6">
                <button
                  type="button"
                  onClick={() => setModal(false)}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-emerald-100 bg-white px-5 py-2.5 text-sm font-semibold text-emerald-900 transition hover:border-emerald-400 hover:bg-emerald-50"
                >
                  Cancel
                </button>
                <button
                  disabled={saving}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-emerald-500/25 transition hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {saving ? 'Saving…' : editId ? 'Save changes' : 'Add staff card'}
                  <Plus size={16} />
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </div>
  )
}