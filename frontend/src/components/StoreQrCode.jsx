import { useState } from 'react'
import {
  QrCode,
  Download,
  Copy,
  Check,
  Printer,
  ExternalLink,
  ShieldCheck,
  ShoppingBag,
  Store,
} from 'lucide-react'
import toast from 'react-hot-toast'

export const PRODUCTS_DESTINATION_URL = 'https://prakash-medical-store.onrender.com/products'

export default function StoreQrCode({ className = '' }) {
  const [copied, setCopied] = useState(false)

  const handleCopyLink = async () => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(PRODUCTS_DESTINATION_URL)
      } else {
        // Fallback for older browsers or restricted environments
        const textArea = document.createElement('textarea')
        textArea.value = PRODUCTS_DESTINATION_URL
        textArea.style.position = 'fixed'
        textArea.style.left = '-999999px'
        textArea.style.top = '-999999px'
        document.body.appendChild(textArea)
        textArea.focus()
        textArea.select()
        const successful = document.execCommand('copy')
        document.body.removeChild(textArea)
        if (!successful) throw new Error('Copy command failed')
      }

      setCopied(true)
      toast.success('Website link copied to clipboard!')
      setTimeout(() => setCopied(false), 2500)
    } catch (err) {
      toast.error('Could not copy link to clipboard. Please copy manually.')
    }
  }

  const handleDownloadPng = () => {
    try {
      const link = document.createElement('a')
      link.href = '/website-qr.png'
      link.download = 'prakash-medical-store-qr.png'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      toast.success('PNG QR code downloaded!')
    } catch (err) {
      toast.error('Failed to download PNG. You can right-click the QR code to save it.')
    }
  }

  const handleDownloadSvg = () => {
    try {
      const link = document.createElement('a')
      link.href = '/website-qr.svg'
      link.download = 'prakash-medical-store-qr.svg'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      toast.success('SVG QR code downloaded!')
    } catch (err) {
      toast.error('Failed to download SVG. You can right-click the QR code to save it.')
    }
  }

  const handlePrint = () => {
    window.print()
  }

  return (
    <section
      aria-labelledby="store-qr-heading"
      className={`relative overflow-hidden py-14 sm:py-16 md:py-20 ${className}`}
    >
      {/* Print-specific style to ensure clean, professional poster printing */}
      <style>{`
        @media print {
          @page {
            size: A4 portrait;
            margin: 12mm;
          }
          body * {
            visibility: hidden !important;
          }
          #printable-qr-poster,
          #printable-qr-poster * {
            visibility: visible !important;
          }
          #printable-qr-poster {
            position: fixed !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            height: 100% !important;
            margin: 0 !important;
            padding: 28px !important;
            background: #ffffff !important;
            color: #064e3b !important;
            display: flex !important;
            flex-direction: column !important;
            align-items: center !important;
            justify-content: center !important;
            box-shadow: none !important;
            border: 4px solid #059669 !important;
            border-radius: 24px !important;
            box-sizing: border-box !important;
          }
          .qr-web-only {
            display: none !important;
          }
        }
      `}</style>

      {/* Screen container */}
      <div className="container relative mx-auto max-w-6xl px-4 sm:px-6">
        <div className="overflow-hidden rounded-3xl border border-emerald-100 bg-white shadow-xl shadow-emerald-900/5">
          {/* Top subtle emerald bar */}
          <div className="h-1.5 w-full bg-gradient-to-r from-emerald-400 via-emerald-600 to-teal-500" />

          <div className="grid grid-cols-1 items-center gap-10 p-6 sm:p-8 md:grid-cols-12 md:gap-8 lg:p-12">
            {/* Left column: Information & Action buttons */}
            <div className="flex flex-col md:col-span-7">
              {/* Eyebrow badge */}
              <div className="mb-4 inline-flex items-center gap-2 self-start rounded-full bg-emerald-100 px-3.5 py-1.5 text-[0.68rem] font-bold uppercase tracking-[0.18em] text-emerald-800">
                <QrCode size={14} className="text-emerald-700" />
                <span>Instant Mobile Access</span>
              </div>

              {/* Main Heading */}
              <h2
                id="store-qr-heading"
                className="text-2xl font-extrabold leading-tight tracking-tight text-emerald-950 sm:text-3xl lg:text-4xl"
              >
                Scan to Visit <em className="italic text-emerald-600">Our Store.</em>
              </h2>

              {/* Store Name */}
              <p className="mt-2 text-base font-bold text-emerald-900 sm:text-lg">
                Prakash Medical and General Store
              </p>

              {/* Description */}
              <p className="mt-3 max-w-xl text-sm leading-relaxed text-slate-600 sm:text-base">
                Scan this QR code with any smartphone camera or QR scanner to open our live online
                product catalogue directly. Browse available medicines, baby care, daily essentials,
                and general store items right on your mobile screen without typing the web address.
              </p>

              {/* Store & Counter placement feature card */}
              <div className="mt-6 flex items-start gap-3 rounded-2xl border border-emerald-100 bg-emerald-50/50 p-4 sm:p-5">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                  <Store size={20} />
                </span>
                <div className="min-w-0">
                  <strong className="block text-xs font-bold text-emerald-950 sm:text-sm">
                    Print-Ready for Counter &amp; Entrance
                  </strong>
                  <p className="mt-0.5 text-xs leading-relaxed text-slate-600 sm:text-sm">
                    Keep a printed copy at the billing counter or shop entrance so customers can
                    browse products and verify availability instantly.
                  </p>
                </div>
              </div>

              {/* Action Buttons Grid */}
              <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {/* Download PNG */}
                <button
                  type="button"
                  onClick={handleDownloadPng}
                  aria-label="Download QR code as high-resolution 1200x1200 PNG"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-br from-emerald-600 to-emerald-700 px-4 py-3 text-sm font-semibold text-white shadow-md shadow-emerald-600/20 transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-emerald-600/30"
                >
                  <Download size={16} />
                  <span>Download PNG (1200px)</span>
                </button>

                {/* Download SVG */}
                <button
                  type="button"
                  onClick={handleDownloadSvg}
                  aria-label="Download QR code as scalable vector SVG"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-emerald-200 bg-white px-4 py-3 text-sm font-semibold text-emerald-900 shadow-sm transition hover:border-emerald-400 hover:bg-emerald-50 hover:-translate-y-0.5"
                >
                  <Download size={16} className="text-emerald-700" />
                  <span>Download SVG (Vector)</span>
                </button>

                {/* Copy Website Link */}
                <button
                  type="button"
                  onClick={handleCopyLink}
                  aria-label="Copy production products catalogue web link to clipboard"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-emerald-200 bg-white px-4 py-3 text-sm font-semibold text-emerald-900 shadow-sm transition hover:border-emerald-400 hover:bg-emerald-50 hover:-translate-y-0.5"
                >
                  {copied ? (
                    <>
                      <Check size={16} className="text-emerald-600" />
                      <span className="text-emerald-700 font-bold">Link Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy size={16} className="text-emerald-700" />
                      <span>Copy Website Link</span>
                    </>
                  )}
                </button>

                {/* Print QR Code */}
                <button
                  type="button"
                  onClick={handlePrint}
                  aria-label="Print shop counter poster layout for QR code"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-emerald-200 bg-white px-4 py-3 text-sm font-semibold text-emerald-900 shadow-sm transition hover:border-emerald-400 hover:bg-emerald-50 hover:-translate-y-0.5"
                >
                  <Printer size={16} className="text-emerald-700" />
                  <span>Print QR Code</span>
                </button>
              </div>

              {/* Direct visit link */}
              <div className="mt-4 flex items-center gap-2 text-xs text-slate-500">
                <span>Destination:</span>
                <a
                  href={PRODUCTS_DESTINATION_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 font-semibold text-emerald-700 underline decoration-emerald-300 underline-offset-2 transition hover:text-emerald-900"
                >
                  {PRODUCTS_DESTINATION_URL}
                  <ExternalLink size={12} />
                </a>
              </div>
            </div>

            {/* Right column: Interactive QR Code Card */}
            <div className="flex flex-col items-center justify-center md:col-span-5">
              <div className="relative w-full max-w-sm overflow-hidden rounded-3xl border-2 border-emerald-100 bg-gradient-to-b from-emerald-50/70 via-white to-emerald-50/30 p-6 text-center shadow-lg sm:p-7">
                {/* Decorative background circle */}
                <div className="pointer-events-none absolute -top-16 -right-16 h-40 w-40 rounded-full bg-emerald-200/40 blur-2xl" />

                {/* Badge above code */}
                <div className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-white px-3 py-1 text-[0.68rem] font-bold text-emerald-800 shadow-sm">
                  <ShieldCheck size={13} className="text-emerald-600" />
                  <span>Official Store QR Code</span>
                </div>

                {/* QR Code Graphic Frame (high contrast, white quiet zone, sharp SVG) */}
                <div className="mx-auto aspect-square w-60 max-w-full rounded-2xl border-4 border-white bg-white p-2 shadow-md sm:w-64">
                  <img
                    src="/website-qr.svg"
                    alt="QR code to open Prakash Medical and General Store products catalogue"
                    width={256}
                    height={256}
                    className="h-full w-full object-contain"
                    loading="eager"
                  />
                </div>

                {/* Subtext below QR preview */}
                <div className="mt-4">
                  <strong className="block text-sm font-extrabold text-emerald-950">
                    Prakash Medical and General Store
                  </strong>
                  <span className="mt-0.5 block text-xs font-medium text-emerald-700">
                    Online Product Catalogue
                  </span>
                  <p className="mt-2 text-[0.72rem] text-slate-500">
                    Hanuman Nagar, Kumbhari · Tel: 9765428720
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Hidden print-only poster element: formatted for clean print output */}
      <div id="printable-qr-poster" className="hidden" aria-hidden="true">
        <div style={{ maxWidth: '620px', width: '100%', margin: '0 auto', textAlign: 'center' }}>
          {/* Header */}
          <div style={{ borderBottom: '2px solid #059669', paddingBottom: '16px', marginBottom: '24px' }}>
            <h1
              style={{
                fontFamily: 'sans-serif',
                fontSize: '28px',
                fontWeight: '900',
                color: '#064e3b',
                margin: '0 0 6px 0',
                letterSpacing: '-0.02em',
              }}
            >
              Prakash Medical and General Store
            </h1>
            <p
              style={{
                fontSize: '14px',
                fontWeight: '600',
                color: '#047857',
                margin: '0 0 4px 0',
              }}
            >
              Hanuman Nagar, Kumbhari, Maharashtra · Contact: 9765428720
            </p>
            <p style={{ fontSize: '12px', color: '#475569', margin: 0 }}>
              Medicines · Healthcare Essentials · Daily Needs · Baby Care · First Aid
            </p>
          </div>

          {/* Poster Callout */}
          <div style={{ marginBottom: '20px' }}>
            <h2
              style={{
                fontSize: '22px',
                fontWeight: '800',
                color: '#065f46',
                margin: '0 0 8px 0',
              }}
            >
              Scan to Visit Our Store
            </h2>
            <p style={{ fontSize: '13px', color: '#334155', margin: 0, lineHeight: 1.5 }}>
              Point your smartphone camera at this QR code to view our live online product catalogue.
            </p>
          </div>

          {/* QR Code Container with guaranteed high contrast & quiet zone */}
          <div
            style={{
              display: 'inline-block',
              background: '#ffffff',
              padding: '16px',
              border: '3px solid #047857',
              borderRadius: '16px',
              margin: '12px 0 20px 0',
            }}
          >
            <img
              src="/website-qr.png"
              alt="QR Code for Prakash Medical and General Store"
              style={{ width: '280px', height: '280px', display: 'block' }}
            />
          </div>

          {/* Destination URL */}
          <div style={{ marginTop: '8px' }}>
            <p
              style={{
                fontSize: '14px',
                fontWeight: '700',
                color: '#065f46',
                margin: '0 0 4px 0',
                letterSpacing: '0.02em',
              }}
            >
              https://prakash-medical-store.onrender.com/products
            </p>
            <p style={{ fontSize: '11px', color: '#64748b', margin: '4px 0 0 0' }}>
              Free mobile browsing · No app download required
            </p>
          </div>

          {/* Footer note */}
          <div
            style={{
              borderTop: '1px solid #cbd5e1',
              marginTop: '28px',
              paddingTop: '12px',
              fontSize: '11px',
              color: '#64748b',
            }}
          >
            Prakash Medical and General Store · Your Trusted Neighbourhood Health Partner
          </div>
        </div>
      </div>
    </section>
  )
}

