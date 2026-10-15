import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  ArrowLeft, ArrowUpRight, ShieldCheck, PackageCheck, AlertCircle,
  MapPin, PhoneCall,
} from 'lucide-react'
import api, { imageUrl } from '../api'
import ImageWithFallback from '../components/ImageWithFallback'

const placeholder = 'https://images.unsplash.com/photo-1603398938378-e54eab446dde?auto=format&fit=crop&w=1000&q=80'

export default function ProductDetail() {
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [error, setError] = useState('')
  const [selectedImage, setSelectedImage] = useState(0)

  useEffect(() => {
    api.get(`/products/${id}`)
      .then(({ data }) => setProduct(data.product))
      .catch(() => setError('This product could not be found. It may have been removed from the catalogue.'))
  }, [id])

  /* ---------- ERROR STATE ---------- */
  if (error) return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-b from-emerald-50/40 via-white to-emerald-50/30 px-4 py-16 sm:px-6">
      <div className="w-full max-w-md rounded-3xl border border-emerald-100 bg-white p-6 text-center shadow-lg shadow-emerald-500/5 sm:p-8">
        <span className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-100 text-red-600">
          <AlertCircle size={26} />
        </span>
        <h2 className="mb-2 text-xl font-extrabold tracking-tight text-emerald-950 sm:text-2xl">
          Product not found
        </h2>
        <p className="mb-6 text-sm leading-relaxed text-slate-600 sm:text-base">
          {error}
        </p>
        <Link
          to="/products"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-500/25 transition hover:-translate-y-0.5 hover:shadow-xl sm:text-base"
        >
          Back to products <ArrowLeft size={16} />
        </Link>
      </div>
    </main>
  )

  /* ---------- LOADING STATE ---------- */
  if (!product) return (
    <main className="container mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12">
        <div className="aspect-square w-full animate-pulse rounded-3xl bg-emerald-100/60" />
        <div className="flex flex-col gap-4">
          <div className="h-5 w-32 animate-pulse rounded-full bg-emerald-100/60" />
          <div className="h-9 w-3/4 animate-pulse rounded-xl bg-emerald-100/60" />
          <div className="h-7 w-1/3 animate-pulse rounded-xl bg-emerald-100/60" />
          <div className="h-24 w-full animate-pulse rounded-2xl bg-emerald-100/60" />
          <div className="h-12 w-full animate-pulse rounded-xl bg-emerald-100/60" />
        </div>
      </div>
    </main>
  )

  const imgs = product.images?.length ? product.images : [placeholder]

  return (
    <main className="min-h-screen bg-gradient-to-b from-emerald-50/40 via-white to-emerald-50/30 text-slate-800">
      <div className="container mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-10">

        {/* ---------- BACK LINK ---------- */}
        <Link
          to="/products"
          className="group mb-6 inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-700 transition hover:gap-2.5 hover:text-emerald-500 sm:mb-8 sm:text-base"
        >
          <ArrowLeft size={16} className="transition group-hover:-translate-x-0.5" />
          Back to all products
        </Link>

        {/* ---------- DETAIL GRID ---------- */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12">

          {/* ================= GALLERY ================= */}
          <div className="flex flex-col gap-4">

            {/* Main image */}
            <div className="relative aspect-square w-full overflow-hidden rounded-3xl border border-emerald-100 bg-emerald-50 shadow-lg shadow-emerald-500/5">
              <ImageWithFallback
                src={product.images?.[selectedImage] ? imageUrl(imgs[selectedImage]) : imgs[selectedImage]}
                alt={product.name}
                fallbackClassName="flex h-full w-full items-center justify-center bg-emerald-50 text-emerald-600"
                FallbackIcon={PackageCheck}
                className="h-full w-full object-cover object-top"
              />

              {/* Category chip */}
              {product.category && (
                <span className="absolute top-4 left-4 rounded-full bg-white/95 px-3 py-1.5 text-[0.68rem] font-bold uppercase tracking-wide text-emerald-700 shadow-md backdrop-blur">
                  {product.category}
                </span>
              )}
            </div>

            {/* Thumbnails */}
            {product.images?.length > 1 && (
              <div className="grid grid-cols-4 gap-2.5 sm:gap-3">
                {imgs.map((img, index) => (
                  <button
                    key={img}
                    onClick={() => setSelectedImage(index)}
                    className={`aspect-square overflow-hidden rounded-2xl border-2 transition ${
                      selectedImage === index
                        ? 'border-emerald-500 shadow-md shadow-emerald-500/20'
                        : 'border-emerald-100 opacity-70 hover:border-emerald-300 hover:opacity-100'
                    }`}
                  >
                    <ImageWithFallback
                      src={imageUrl(img)}
                      alt={`${product.name} ${index + 1}`}
                      className="h-full w-full object-cover object-top"
                      fallbackClassName="flex h-full w-full items-center justify-center bg-emerald-50 text-emerald-600"
                      FallbackIcon={PackageCheck}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ================= INFO ================= */}
          <div className="flex flex-col">

            <span className="mb-3 inline-block self-start rounded-full bg-emerald-100 px-3 py-1.5 text-[0.68rem] font-bold uppercase tracking-[0.18em] text-emerald-700">
              Prakash Medical Catalogue
            </span>

            <h1 className="mb-4 text-2xl font-extrabold leading-tight tracking-tight text-emerald-950 sm:text-3xl md:text-4xl">
              {product.name}
            </h1>

            {/* Price */}
            <div className="mb-5 flex flex-wrap items-baseline gap-3">
              <strong className="text-2xl font-extrabold text-emerald-950 sm:text-3xl">
                ₹{Number(product.price).toLocaleString('en-IN', { maximumFractionDigits: 2 })}
              </strong>
              {Number(product.mrp) > Number(product.price) && (
                <>
                  <del className="text-base text-slate-400 sm:text-lg">
                    ₹{Number(product.mrp).toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                  </del>
                  <span className="rounded-full bg-gradient-to-br from-orange-500 to-orange-600 px-2.5 py-1 text-[0.68rem] font-extrabold text-white shadow-sm">
                    Save {product.discount_percent}%
                  </span>
                </>
              )}
            </div>

            {/* Stock */}
            {product.in_stock ? (
              <span className="mb-5 inline-flex items-center gap-2 self-start rounded-full bg-emerald-100 px-3.5 py-1.5 text-sm font-bold text-emerald-700">
                <PackageCheck size={17} /> In stock · {product.stock} available
              </span>
            ) : (
              <span className="mb-5 inline-flex items-center gap-2 self-start rounded-full bg-red-100 px-3.5 py-1.5 text-sm font-bold text-red-600">
                <AlertCircle size={17} /> Currently unavailable
              </span>
            )}

            {/* Rx note */}
            {product.prescription_required && (
              <div className="mb-5 flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50/60 p-4">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-lg font-bold text-amber-700">
                  ℞
                </span>
                <div className="min-w-0">
                  <b className="block text-sm font-bold text-amber-900">
                    Prescription required
                  </b>
                  <small className="mt-0.5 block text-xs leading-relaxed text-amber-800">
                    Use this medicine only as advised by a registered medical
                    professional. Contact the store to confirm dispensing requirements.
                  </small>
                </div>
              </div>
            )}

            {/* Description */}
            <div className="mb-6 rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm">
              <h3 className="mb-2 text-sm font-bold uppercase tracking-wide text-emerald-900">
                Product information
              </h3>
              <p className="text-sm leading-relaxed text-slate-600">
                {product.description || 'For product information and availability, please contact Prakash Medical and General Store directly.'}
              </p>
            </div>

            {/* Call button */}
            <a
              href="tel:9765428720"
              className="mb-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-emerald-500/25 transition hover:-translate-y-0.5 hover:shadow-xl hover:shadow-emerald-500/35 sm:text-base"
            >
              <PhoneCall size={18} /> Call the store to enquire
            </a>

            {/* Reassurance */}
            <div className="mb-5 flex flex-wrap gap-3">
              <span className="inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-white px-3.5 py-2 text-xs font-semibold text-emerald-900 shadow-sm sm:text-sm">
                <ShieldCheck size={15} className="text-emerald-600" /> Care-first local service
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-white px-3.5 py-2 text-xs font-semibold text-emerald-900 shadow-sm sm:text-sm">
                <MapPin size={15} className="text-emerald-600" /> Hanuman Nagar, Kumbhari
              </span>
            </div>

            {/* Notice */}
            <div className="mb-5 rounded-2xl border border-emerald-100 bg-gradient-to-br from-emerald-50 via-white to-emerald-50/60 p-4">
              <strong className="mb-1 block text-sm font-bold text-emerald-950">
                Please note
              </strong>
              <p className="text-xs leading-relaxed text-slate-600 sm:text-sm">
                This website is a product catalogue only. It does not accept orders or
                payments. Product availability and prices may change; please confirm
                with the store.
              </p>
            </div>

            {/* Contact link */}
            <Link
              to="/contact"
              className="inline-flex items-center gap-1.5 text-sm font-bold text-emerald-700 transition hover:gap-2.5 hover:text-emerald-500 sm:text-base"
            >
              Other ways to contact us <ArrowUpRight size={17} />
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}