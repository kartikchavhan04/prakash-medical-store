import { useEffect, useState } from 'react'
import {
  Mail, Search, Trash2, Check, Clock, UserRound, Phone,
  MailOpen, RefreshCw, X,
} from 'lucide-react'
import toast from 'react-hot-toast'
import api from '../api'

export default function AdminMessages() {
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState(null)

  const load = () => {
    setLoading(true)
    api.get('/contact/messages')
      .then(({ data }) => setMessages(data.messages || []))
      .catch(err => toast.error(err.response?.data?.message || 'Could not load messages.'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const markRead = async (item) => {
    try {
      await api.patch(`/contact/messages/${item.id}/read`)
      setMessages(prev => prev.map(m => m.id === item.id ? { ...m, status: 'read' } : m))
      if (selected?.id === item.id) setSelected({ ...selected, status: 'read' })
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not update message.')
    }
  }

  const remove = async (item) => {
    if (!window.confirm(`Delete the message from ${item.name}?`)) return
    try {
      await api.delete(`/contact/messages/${item.id}`)
      setMessages(prev => prev.filter(m => m.id !== item.id))
      if (selected?.id === item.id) setSelected(null)
      toast.success('Message deleted.')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not delete message.')
    }
  }

  const open = (item) => {
    setSelected(item)
    if (item.status !== 'read') markRead(item)
  }

  const visible = messages.filter(m =>
    `${m.name} ${m.email} ${m.mobile} ${m.message}`.toLowerCase().includes(search.toLowerCase())
  )

  const unreadCount = messages.filter(m => m.status !== 'read').length

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50/40 via-white to-emerald-50/30 px-4 py-8 text-slate-800 sm:px-6 sm:py-10 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-6">

        {/* ================= PAGE HEADING ================= */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <span className="mb-3 inline-block rounded-full bg-emerald-100 px-3 py-1.5 text-[0.68rem] font-bold uppercase tracking-[0.18em] text-emerald-700">
              Customer enquiries
            </span>
            <h1 className="text-2xl font-extrabold leading-tight tracking-tight text-emerald-950 sm:text-3xl md:text-4xl">
              Message <em className="italic text-emerald-600">inbox.</em>
            </h1>
            <p className="mt-1 text-sm text-slate-600 sm:text-base">
              Contact form messages submitted by visitors to your website.
            </p>
          </div>

          <button
            onClick={load}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 self-start rounded-xl border border-emerald-100 bg-white px-5 py-2.5 text-sm font-semibold text-emerald-900 transition hover:border-emerald-400 hover:bg-emerald-50 disabled:cursor-not-allowed disabled:opacity-60 sm:self-auto"
          >
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
            Refresh inbox
          </button>
        </div>

        {/* ================= OVERVIEW STRIP ================= */}
        <div className="flex flex-col items-start gap-4 rounded-2xl border border-emerald-100 bg-gradient-to-br from-emerald-50 via-white to-emerald-50/60 p-4 sm:flex-row sm:items-center sm:p-5">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
            <Mail size={20} />
          </span>
          <div className="min-w-0 flex-1">
            <b className="block text-sm font-bold text-emerald-950 sm:text-base">
              {messages.length} total messages
            </b>
            <small className="block text-xs text-slate-500 sm:text-sm">
              {unreadCount} unread · Messages are saved to your database
            </small>
          </div>
          <span className="hidden rounded-full border border-emerald-100 bg-white px-3 py-1.5 text-[0.68rem] font-bold uppercase tracking-wide text-emerald-700 sm:inline-block">
            Private admin inbox
          </span>
        </div>

        {/* ================= MESSAGES PANEL ================= */}
        <section className="overflow-hidden rounded-3xl border border-emerald-100 bg-white shadow-lg shadow-emerald-500/5">

          {/* ---- Toolbar ---- */}
          <div className="flex flex-col gap-4 border-b border-emerald-100 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
            <div>
              <h3 className="flex items-center gap-2 text-base font-bold text-emerald-950 sm:text-lg">
                All enquiries
                <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-700">
                  {messages.length}
                </span>
              </h3>
              <p className="mt-0.5 text-xs text-slate-500 sm:text-sm">
                Select a message to read its full details.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <label className="relative flex-1 sm:flex-initial">
                <Search size={15} className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-emerald-500" />
                <input
                  placeholder="Search inbox…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full rounded-xl border border-emerald-100 bg-emerald-50/40 py-2.5 pr-3 pl-9 text-sm text-emerald-950 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/15 sm:w-64"
                />
              </label>
              <button
                onClick={load}
                title="Refresh"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-emerald-100 bg-white text-emerald-700 transition hover:border-emerald-400 hover:bg-emerald-50"
              >
                <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
              </button>
            </div>
          </div>

          {/* ---- Content ---- */}
          {loading ? (
            <div className="px-4 py-16 text-center text-sm text-slate-500">
              Loading messages…
            </div>
          ) : !visible.length ? (
            <div className="flex flex-col items-center px-4 py-16 text-center">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
                <MailOpen size={26} />
              </div>
              <h3 className="text-base font-bold text-emerald-950 sm:text-lg">
                {messages.length ? 'No matching messages' : 'Your inbox is clear'}
              </h3>
              <p className="mt-1 max-w-sm text-sm text-slate-500">
                {messages.length
                  ? 'Try another search term.'
                  : 'Contact form enquiries will show here when customers send them.'}
              </p>
            </div>
          ) : (
            <>
              {/* ---- Mobile: card list ---- */}
              <div className="flex flex-col divide-y divide-emerald-100 md:hidden">
                {visible.map(item => (
                  <div
                    key={item.id}
                    className={`flex flex-col gap-3 p-4 transition ${item.status !== 'read' ? 'bg-emerald-50/50' : ''}`}
                  >
                    <button
                      onClick={() => open(item)}
                      className="flex items-center gap-3 text-left"
                    >
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
                        <UserRound size={17} />
                      </span>
                      <span className="min-w-0 flex-1">
                        <b className="block truncate text-sm font-bold text-emerald-950">{item.name}</b>
                        <small className="block truncate text-xs text-slate-500">{item.email}</small>
                      </span>
                      {item.status === 'read' ? (
                        <span className="shrink-0 rounded-full bg-slate-100 px-2.5 py-1 text-[0.68rem] font-bold text-slate-600">
                          Read
                        </span>
                      ) : (
                        <span className="shrink-0 rounded-full bg-emerald-100 px-2.5 py-1 text-[0.68rem] font-bold text-emerald-700">
                          New
                        </span>
                      )}
                    </button>

                    <button
                      onClick={() => open(item)}
                      className="line-clamp-2 text-left text-sm text-slate-600"
                    >
                      {item.message}
                    </button>

                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5 text-xs text-slate-500">
                        <Clock size={13} />
                        {item.created_at
                          ? new Date(item.created_at).toLocaleString('en-IN', {
                              day: '2-digit', month: 'short',
                              hour: '2-digit', minute: '2-digit',
                            })
                          : '—'}
                      </span>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => open(item)}
                          title="Read message"
                          className="flex h-8 w-8 items-center justify-center rounded-lg border border-emerald-100 bg-white text-emerald-700 transition hover:border-emerald-400 hover:bg-emerald-50"
                        >
                          <MailOpen size={15} />
                        </button>
                        {item.status !== 'read' && (
                          <button
                            onClick={() => markRead(item)}
                            title="Mark as read"
                            className="flex h-8 w-8 items-center justify-center rounded-lg border border-emerald-100 bg-white text-emerald-700 transition hover:border-emerald-400 hover:bg-emerald-50"
                          >
                            <Check size={15} />
                          </button>
                        )}
                        <button
                          onClick={() => remove(item)}
                          title="Delete message"
                          className="flex h-8 w-8 items-center justify-center rounded-lg border border-red-100 bg-white text-red-600 transition hover:border-red-300 hover:bg-red-50"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* ---- Desktop: table ---- */}
              <div className="hidden overflow-x-auto md:block">
                <table className="w-full min-w-[720px] border-collapse text-left">
                  <thead>
                    <tr className="border-b border-emerald-100 bg-emerald-50/60 text-xs uppercase tracking-wide text-emerald-900">
                      <th className="px-5 py-3 font-bold">Sender</th>
                      <th className="px-5 py-3 font-bold">Message preview</th>
                      <th className="px-5 py-3 font-bold">Received</th>
                      <th className="px-5 py-3 font-bold">Status</th>
                      <th className="px-5 py-3 text-right font-bold">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-emerald-100">
                    {visible.map(item => (
                      <tr
                        key={item.id}
                        className={`transition hover:bg-emerald-50/40 ${item.status !== 'read' ? 'bg-emerald-50/30' : ''}`}
                      >
                        <td className="px-5 py-3.5">
                          <button
                            onClick={() => open(item)}
                            className="flex items-center gap-3 text-left"
                          >
                            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
                              <UserRound size={16} />
                            </span>
                            <span className="min-w-0">
                              <b className="block text-sm font-bold text-emerald-950">{item.name}</b>
                              <small className="block text-xs text-slate-500">{item.email}</small>
                            </span>
                          </button>
                        </td>
                        <td className="max-w-xs px-5 py-3.5">
                          <button
                            onClick={() => open(item)}
                            className="line-clamp-1 text-left text-sm text-slate-600 hover:text-emerald-700"
                          >
                            {item.message}
                          </button>
                        </td>
                        <td className="px-5 py-3.5">
                          <span className="flex items-center gap-1.5 text-xs text-slate-500">
                            <Clock size={13} />
                            {item.created_at
                              ? new Date(item.created_at).toLocaleString('en-IN', {
                                  day: '2-digit', month: 'short', year: 'numeric',
                                  hour: '2-digit', minute: '2-digit',
                                })
                              : '—'}
                          </span>
                        </td>
                        <td className="px-5 py-3.5">
                          {item.status === 'read' ? (
                            <span className="inline-block rounded-full bg-slate-100 px-2.5 py-1 text-[0.68rem] font-bold text-slate-600">
                              Read
                            </span>
                          ) : (
                            <span className="inline-block rounded-full bg-emerald-100 px-2.5 py-1 text-[0.68rem] font-bold text-emerald-700">
                              New
                            </span>
                          )}
                        </td>
                        <td className="px-5 py-3.5">
                          <div className="flex justify-end gap-1.5">
                            <button
                              onClick={() => open(item)}
                              title="Read message"
                              className="flex h-8 w-8 items-center justify-center rounded-lg border border-emerald-100 bg-white text-emerald-700 transition hover:border-emerald-400 hover:bg-emerald-50"
                            >
                              <MailOpen size={15} />
                            </button>
                            {item.status !== 'read' && (
                              <button
                                onClick={() => markRead(item)}
                                title="Mark as read"
                                className="flex h-8 w-8 items-center justify-center rounded-lg border border-emerald-100 bg-white text-emerald-700 transition hover:border-emerald-400 hover:bg-emerald-50"
                              >
                                <Check size={15} />
                              </button>
                            )}
                            <button
                              onClick={() => remove(item)}
                              title="Delete message"
                              className="flex h-8 w-8 items-center justify-center rounded-lg border border-red-100 bg-white text-red-600 transition hover:border-red-300 hover:bg-red-50"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </section>
      </div>

      {/* ================= MODAL ================= */}
      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-emerald-950/40 p-0 backdrop-blur-sm sm:items-center sm:p-4"
          onMouseDown={(e) => { if (e.target === e.currentTarget) setSelected(null) }}
        >
          <section className="flex max-h-[92vh] w-full max-w-lg flex-col overflow-hidden rounded-t-3xl border border-emerald-100 bg-white shadow-2xl sm:rounded-3xl">

            {/* Modal head */}
            <div className="flex items-start justify-between gap-3 border-b border-emerald-100 p-5 sm:p-6">
              <div>
                <span className="mb-2 inline-block rounded-full bg-emerald-100 px-2.5 py-1 text-[0.65rem] font-bold uppercase tracking-[0.18em] text-emerald-700">
                  Customer message
                </span>
                <h2 className="text-lg font-extrabold text-emerald-950 sm:text-xl">
                  Enquiry details
                </h2>
                <p className="mt-0.5 text-xs text-slate-500 sm:text-sm">
                  Received {selected.created_at
                    ? new Date(selected.created_at).toLocaleString('en-IN')
                    : 'date not available'}
                </p>
              </div>
              <button
                onClick={() => setSelected(null)}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-emerald-100 bg-white text-emerald-700 transition hover:border-emerald-400 hover:bg-emerald-50"
              >
                <X size={17} />
              </button>
            </div>

            {/* Sender info */}
            <div className="flex items-start gap-3 border-b border-emerald-100 bg-emerald-50/40 p-5 sm:p-6">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
                <UserRound size={20} />
              </span>
              <div className="min-w-0">
                <b className="block text-sm font-bold text-emerald-950 sm:text-base">
                  {selected.name}
                </b>
                <span className="mt-1 flex items-center gap-1.5 text-xs text-slate-600 sm:text-sm">
                  <Mail size={13} className="text-emerald-600" /> {selected.email}
                </span>
                <span className="mt-0.5 flex items-center gap-1.5 text-xs text-slate-600 sm:text-sm">
                  <Phone size={13} className="text-emerald-600" /> {selected.mobile}
                </span>
              </div>
            </div>

            {/* Message body */}
            <div className="flex-1 overflow-y-auto p-5 sm:p-6">
              <div className="whitespace-pre-wrap rounded-2xl border border-emerald-100 bg-emerald-50/40 p-4 text-sm leading-relaxed text-slate-700">
                {selected.message}
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-2.5 border-t border-emerald-100 p-5 sm:flex-row sm:flex-wrap sm:p-6">
              <a
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-emerald-500/25 transition hover:-translate-y-0.5 hover:shadow-xl"
                href={`mailto:${selected.email}?subject=${encodeURIComponent('Re: Prakash Medical enquiry')}`}
              >
                Reply by email <Mail size={16} />
              </a>
              <button
                onClick={() => setSelected(null)}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-emerald-100 bg-white px-5 py-2.5 text-sm font-semibold text-emerald-900 transition hover:border-emerald-400 hover:bg-emerald-50"
              >
                Close
              </button>
              <button
                onClick={() => remove(selected)}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-100 bg-white px-5 py-2.5 text-sm font-semibold text-red-600 transition hover:border-red-300 hover:bg-red-50 sm:ml-auto"
              >
                <Trash2 size={16} /> Delete
              </button>
            </div>
          </section>
        </div>
      )}
    </div>
  )
}