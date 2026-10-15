import { useEffect, useId, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowUpRight, PackageCheck, AlertCircle, Phone, X } from 'lucide-react'
import { imageUrl } from '../api'
import ImageWithFallback from './ImageWithFallback'

const placeholder = 'https://images.unsplash.com/photo-1603398938378-e54eab446dde?auto=format&fit=crop&w=700&q=80'

export default function ProductCard({ product }) {
  const discount = Number(product.discount_percent || 0)
  const [orderDialogOpen, setOrderDialogOpen] = useState(false)
  const orderDialogRef = useRef(null)
  const dialogTitleId = useId()

  useEffect(() => {
    const dialog = orderDialogRef.current
    if (orderDialogOpen && dialog && !dialog.open) dialog.showModal()
    return () => {
      if (dialog?.open) dialog.close()
    }
  }, [orderDialogOpen])

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-emerald-100 bg-white shadow-sm transition hover:-translate-y-1 hover:border-emerald-300 hover:shadow-lg hover:shadow-emerald-500/10">

      {/* ================= IMAGE ================= */}
      <Link
        to={`/products/${product.id}`}
        className="relative block aspect-square w-full overflow-hidden bg-emerald-50"
      >
        <ImageWithFallback
          src={product.images?.[0] ? imageUrl(product.images[0]) : placeholder}
          alt={product.name || 'Medical supplies'}
          loading="lazy"
          FallbackIcon={PackageCheck}
          fallbackClassName="flex h-full w-full items-center justify-center bg-emerald-50 text-emerald-600"
          className="h-full w-full object-cover object-top transition duration-500 group-hover:scale-105"
        />

        {/* Category chip */}
        {product.category && (
          <span className="absolute top-3 left-3 rounded-full bg-white/95 px-2.5 py-1 text-[0.62rem] font-bold uppercase tracking-wide text-emerald-700 shadow-sm backdrop-blur">
            {product.category}
          </span>
        )}

        {/* Discount chip */}
        {discount > 0 && (
          <span className="absolute top-3 right-3 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 px-2.5 py-1 text-[0.68rem] font-extrabold text-white shadow-md">
            -{discount}%
          </span>
        )}

        {/* Rx chip */}
        {product.prescription_required && (
          <span className="absolute bottom-3 left-3 rounded-full border border-amber-200 bg-amber-50/95 px-2.5 py-1 text-[0.62rem] font-extrabold text-amber-700 shadow-sm backdrop-blur">
            Rx Required
          </span>
        )}
      </Link>

      {/* ================= BODY ================= */}
      <div className="flex flex-1 flex-col p-4">

        {/* Category small */}
        <div className="mb-1.5 text-[0.62rem] font-bold uppercase tracking-wide text-slate-500">
          {product.category}
        </div>

        {/* Name */}
        <Link
          to={`/products/${product.id}`}
          className="mb-3 line-clamp-2 text-sm font-bold leading-snug text-emerald-950 transition hover:text-emerald-600 sm:text-[0.95rem]"
        >
          {product.name}
        </Link>

        {/* Price */}
        <div className="mb-3 flex flex-wrap items-baseline gap-2">
          <strong className="text-base font-extrabold text-emerald-950 sm:text-lg">
            ₹{Number(product.price || 0).toLocaleString('en-IN', { maximumFractionDigits: 2 })}
          </strong>
          {Number(product.mrp) > Number(product.price) && (
            <del className="text-xs text-slate-400">
              ₹{Number(product.mrp).toLocaleString('en-IN', { maximumFractionDigits: 2 })}
            </del>
          )}
        </div>

        {/* Stock line */}
        {product.in_stock ? (
          <span className="mb-3 inline-flex items-center gap-1.5 self-start rounded-full bg-emerald-100 px-2.5 py-1 text-[0.68rem] font-bold text-emerald-700">
            <PackageCheck size={13} /> In stock
          </span>
        ) : (
          <span className="mb-3 inline-flex items-center gap-1.5 self-start rounded-full bg-red-100 px-2.5 py-1 text-[0.68rem] font-bold text-red-600">
            <AlertCircle size={13} /> Currently unavailable
          </span>
        )}

        {/* Actions */}
        <div className="mt-auto flex items-center justify-between gap-2 border-t border-emerald-100 pt-3">
          <Link
            to={`/products/${product.id}`}
            className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 transition hover:gap-2 hover:text-emerald-500 sm:text-sm"
          >
            View details <ArrowUpRight size={14} />
          </Link>
          <button
            type="button"
            onClick={() => setOrderDialogOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-700 px-3.5 py-2 text-[0.7rem] font-bold text-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md sm:text-xs"
          >
            Order Now
          </button>
        </div>
      </div>

      {/* ================= DIALOG ================= */}
      <dialog
        ref={orderDialogRef}
        aria-labelledby={dialogTitleId}
        onCancel={() => setOrderDialogOpen(false)}
        onClose={() => setOrderDialogOpen(false)}
        onClick={event => {
          if (event.target === orderDialogRef.current) orderDialogRef.current.close()
        }}
        className="m-auto w-[calc(100vw-2rem)] max-w-md overflow-hidden rounded-3xl border border-emerald-100 bg-white p-0 text-slate-800 shadow-2xl backdrop:bg-emerald-950/40 backdrop:backdrop-blur-sm open:block"
      >
        <div className="flex max-h-[90vh] flex-col overflow-y-auto p-5 sm:p-6">

          {/* Head */}
          <div className="mb-4 flex items-start justify-between gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
              <Phone size={20} />
            </span>
            <button
              type="button"
              aria-label="Close order options"
              onClick={() => orderDialogRef.current?.close()}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-emerald-100 bg-white text-emerald-700 transition hover:border-emerald-400 hover:bg-emerald-50"
            >
              <X size={17} />
            </button>
          </div>

          {/* Eyebrow */}
          <span className="mb-3 inline-block self-start rounded-full bg-emerald-100 px-3 py-1.5 text-[0.68rem] font-bold uppercase tracking-[0.18em] text-emerald-700">
            Call the store
          </span>

          {/* Title */}
          <h2
            id={dialogTitleId}
            className="mb-3 text-xl font-extrabold leading-tight tracking-tight text-emerald-950 sm:text-2xl"
          >
            Order <em className="italic text-emerald-600">{product.name}</em>
          </h2>

          <p className="mb-2 text-sm text-slate-600">
            Call the store to ask about this product:
          </p>

          {/* Phone number */}
          <a
            href="tel:+919765428720"
            className="mb-4 block text-2xl font-extrabold tracking-tight text-emerald-700 transition hover:text-emerald-500 sm:text-3xl"
          >
            9765428720
          </a>

          {/* Notices */}
          <div className="mb-4 flex flex-col gap-2">
            <p className="rounded-xl border border-emerald-100 bg-emerald-50/60 px-3.5 py-2.5 text-xs leading-relaxed text-slate-600">
              Calling connects you with the store; it does not guarantee stock
              availability or confirm an order.
            </p>

            {product.prescription_required && (
              <p className="rounded-xl border border-amber-100 bg-amber-50/60 px-3.5 py-2.5 text-xs leading-relaxed text-amber-900">
                Prescription-required medicine: supply is subject to a valid
                prescription and applicable rules.
              </p>
            )}

            {!product.in_stock && (
              <p className="rounded-xl border border-red-100 bg-red-50/60 px-3.5 py-2.5 text-xs leading-relaxed text-red-900">
                This product is currently marked unavailable. Calling does not confirm
                stock or an order; please ask the store about availability.
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-2.5 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={() => orderDialogRef.current?.close()}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-emerald-100 bg-white px-5 py-2.5 text-sm font-semibold text-emerald-900 transition hover:border-emerald-400 hover:bg-emerald-50"
            >
              Close
            </button>
            <a
              href="tel:+919765428720"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-emerald-500/25 transition hover:-translate-y-0.5 hover:shadow-xl"
            >
              <Phone size={16} /> Call to Order
            </a>
          </div>
        </div>
      </dialog>
    </article>
  )
}