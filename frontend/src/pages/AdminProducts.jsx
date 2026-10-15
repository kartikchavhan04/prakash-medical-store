import { useEffect, useRef, useState } from 'react'
import {
  Plus, Search, Pencil, Trash2, X, Package, ImagePlus, RefreshCw,
  Camera, Upload,
} from 'lucide-react'
import toast from 'react-hot-toast'
import api, { imageUrl } from '../api'

const CATEGORIES = ['Tablets', 'Syrups', 'Capsules', 'Supplements', 'Ayurvedic', 'General Store', 'Surgical Items', 'Baby Care', 'Personal Care', 'First Aid']
const emptyForm = { name: '', description: '', price: '', mrp: '', category: 'Tablets', stock: '0', prescription_required: false }
const MAX_IMAGE_BYTES = 8 * 1024 * 1024
const ACCEPTED_IMAGE_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif'])
const ACCEPTED_IMAGE_EXTENSIONS = /\.(jpe?g|png|webp|gif)$/i

function CameraDialog({ onClose, onUsePhoto, onUseFallback }) {
  const videoRef = useRef(null)
  const streamRef = useRef(null)
  const previewUrlRef = useRef('')
  const mountedRef = useRef(false)
  const [status, setStatus] = useState('starting')
  const [error, setError] = useState('')
  const [capturedFile, setCapturedFile] = useState(null)
  const [capturedPreview, setCapturedPreview] = useState('')

  useEffect(() => {
    let cancelled = false
    mountedRef.current = true

    const startCamera = async () => {
      if (!navigator.mediaDevices?.getUserMedia) {
        setError('Live camera access is not supported by this browser or connection.')
        setStatus('error')
        return
      }

      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: false,
          video: { facingMode: { ideal: 'environment' } },
        })
        if (cancelled) {
          stream.getTracks().forEach(track => track.stop())
          return
        }
        streamRef.current = stream
        const video = videoRef.current
        if (video) {
          video.srcObject = stream
          await video.play()
        }
        setStatus('ready')
      } catch (cameraError) {
        if (cancelled) return
        streamRef.current?.getTracks().forEach(track => track.stop())
        streamRef.current = null
        const messages = {
          NotAllowedError: 'Camera permission was denied. Allow camera access or use the device photo picker.',
          NotFoundError: 'No camera was found. Use the device photo picker instead.',
          NotReadableError: 'The camera is busy or unavailable. Close other camera apps or use the photo picker.',
          SecurityError: 'Camera access requires HTTPS or a trusted local development origin.',
        }
        setError(messages[cameraError.name] || 'Could not start the camera. Use the device photo picker instead.')
        setStatus('error')
      }
    }

    startCamera()
    return () => {
      cancelled = true
      mountedRef.current = false
      streamRef.current?.getTracks().forEach(track => track.stop())
      streamRef.current = null
      if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current)
    }
  }, [])

  useEffect(() => {
    const onKeyDown = event => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [onClose])

  const capturePhoto = () => {
    const video = videoRef.current
    if (!video?.videoWidth || !video.videoHeight) {
      setError('The camera is not ready yet. Please wait and try again.')
      return
    }
    const canvas = document.createElement('canvas')
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    const context = canvas.getContext('2d')
    if (!context) {
      setError('Photo capture is not supported by this browser.')
      return
    }
    context.drawImage(video, 0, 0, canvas.width, canvas.height)
    canvas.toBlob(blob => {
      if (!mountedRef.current) return
      if (!blob) {
        setError('Could not capture the photo. Please try again.')
        return
      }
      const file = new File([blob], `camera-photo-${Date.now()}.jpg`, {
        type: 'image/jpeg',
        lastModified: Date.now(),
      })
      if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current)
      previewUrlRef.current = URL.createObjectURL(file)
      setCapturedFile(file)
      setCapturedPreview(previewUrlRef.current)
      setError('')
      setStatus('captured')
    }, 'image/jpeg', 0.9)
  }

  const retakePhoto = () => {
    if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current)
    previewUrlRef.current = ''
    setCapturedFile(null)
    setCapturedPreview('')
    setError('')
    setStatus('ready')
  }

  return (
    <div
      className="fixed inset-0 z-[60] flex items-end justify-center bg-emerald-950/60 p-0 backdrop-blur-sm sm:items-center sm:p-4"
      onMouseDown={event => { if (event.target === event.currentTarget) onClose() }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="camera-dialog-title"
        className="w-full max-w-xl overflow-hidden rounded-t-3xl border border-emerald-100 bg-white shadow-2xl sm:rounded-3xl"
      >
        <header className="flex items-center justify-between border-b border-emerald-100 px-5 py-4">
          <h2 id="camera-dialog-title" className="flex items-center gap-2 font-bold text-emerald-950">
            <Camera size={18} className="text-emerald-600" />
            Take a product photo
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close camera"
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-emerald-100 text-emerald-700 hover:bg-emerald-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-600"
          >
            <X size={17} />
          </button>
        </header>
        <div className="space-y-4 p-4 sm:p-5">
          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            aria-label="Live camera preview"
            className={`max-h-[55vh] w-full rounded-2xl bg-slate-950 object-contain ${status === 'error' || capturedFile ? 'hidden' : ''}`}
          />
          {capturedFile && (
            <img src={capturedPreview} alt="Captured product preview" className="max-h-[55vh] w-full rounded-2xl bg-slate-950 object-contain" />
          )}
          {status === 'starting' && <p role="status" className="text-sm text-slate-600">Starting camera…</p>}
          {error && <p role="alert" className="rounded-xl bg-amber-50 p-3 text-sm text-amber-800">{error}</p>}
          {status === 'error' && (
            <button
              type="button"
              onClick={() => { onUseFallback(); onClose() }}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-emerald-200 px-4 py-3 text-sm font-semibold text-emerald-800 hover:bg-emerald-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-600"
            >
              <Upload size={16} />
              Use device camera / photo picker
            </button>
          )}
          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-emerald-100 px-4 py-2.5 text-sm font-semibold text-emerald-900 hover:bg-emerald-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-600"
            >
              Cancel
            </button>
            {capturedFile ? (
              <>
                <button
                  type="button"
                  onClick={retakePhoto}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-emerald-200 px-4 py-2.5 text-sm font-semibold text-emerald-800 hover:bg-emerald-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-600"
                >
                  <RefreshCw size={15} /> Retake Photo
                </button>
                <button
                  type="button"
                  onClick={() => onUsePhoto(capturedFile)}
                  className="rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 px-4 py-2.5 text-sm font-semibold text-white hover:shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700"
                >
                  Use Photo
                </button>
              </>
            ) : (
              <button
                type="button"
                disabled={status !== 'ready'}
                onClick={capturePhoto}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 px-4 py-2.5 text-sm font-semibold text-white hover:shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700 disabled:cursor-wait disabled:opacity-60"
              >
                <Camera size={16} /> Capture Photo
              </button>
            )}
          </div>
          <p className="text-xs text-slate-500">Live camera access needs HTTPS, except on localhost.</p>
        </div>
      </section>
    </div>
  )
}

export default function AdminProducts() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [modal, setModal] = useState(false)
  const [editId, setEditId] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [existingImages, setExistingImages] = useState([])
  const [pendingImages, setPendingImages] = useState([])
  const pendingImagesRef = useRef([])
  const objectUrlsRef = useRef(new Set())
  const galleryInputRef = useRef(null)
  const cameraInputRef = useRef(null)
  const [cameraOpen, setCameraOpen] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => () => {
    objectUrlsRef.current.forEach(url => URL.revokeObjectURL(url))
    objectUrlsRef.current.clear()
  }, [])

  const load = () => {
    setLoading(true)
    api.get('/products')
      .then(({ data }) => setProducts(data.products || []))
      .catch(err => toast.error(err.response?.data?.message || 'Could not load products.'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const clearPendingImages = () => {
    pendingImagesRef.current.forEach(image => {
      URL.revokeObjectURL(image.previewUrl)
      objectUrlsRef.current.delete(image.previewUrl)
    })
    pendingImagesRef.current = []
    setPendingImages([])
  }

  const closeProductModal = () => {
    setModal(false)
    setCameraOpen(false)
    setExistingImages([])
    clearPendingImages()
  }

  const openAdd = () => {
    clearPendingImages()
    setEditId(null)
    setForm(emptyForm)
    setExistingImages([])
    setModal(true)
  }

  const openEdit = product => {
    clearPendingImages()
    setEditId(product.id)
    setForm({
      name: product.name || '',
      description: product.description || '',
      price: String(product.price ?? ''),
      mrp: String(product.mrp ?? ''),
      category: product.category || 'Tablets',
      stock: String(product.stock ?? 0),
      prescription_required: Boolean(product.prescription_required),
    })
    setExistingImages(Array.isArray(product.images) ? product.images : [])
    setModal(true)
  }

  const update = e => setForm(prev => ({
    ...prev,
    [e.target.name]: e.target.type === 'checkbox' ? e.target.checked : e.target.value,
  }))

  const fingerprintFile = async file => {
    if (globalThis.crypto?.subtle) {
      try {
        const digest = await globalThis.crypto.subtle.digest('SHA-256', await file.arrayBuffer())
        return Array.from(new Uint8Array(digest), byte => byte.toString(16).padStart(2, '0')).join('')
      } catch {
        // Use stable file metadata when hashing is unavailable in the current browser context.
      }
    }
    return `${file.name}:${file.size}:${file.type}:${file.lastModified}`
  }

  const addPendingFiles = async (selectedFiles, source) => {
    const validFiles = []
    for (const file of selectedFiles) {
      const extensionIsAllowed = ACCEPTED_IMAGE_EXTENSIONS.test(file.name)
      if ((!ACCEPTED_IMAGE_TYPES.has(file.type) && file.type !== '') || !extensionIsAllowed) {
        toast.error(`${file.name || 'Selected file'} is not a supported JPG, PNG, WEBP or GIF image.`)
        continue
      }
      if (file.size === 0 || file.size > MAX_IMAGE_BYTES) {
        toast.error(`${file.name || 'Selected image'} must be larger than 0 bytes and no more than 8 MB.`)
        continue
      }
      validFiles.push(file)
    }
    if (!validFiles.length) return

    const candidates = []
    for (const file of validFiles) {
      candidates.push({ file, source, fingerprint: await fingerprintFile(file) })
    }

    const fingerprints = new Set(pendingImagesRef.current.map(image => image.fingerprint))
    let totalBytes = pendingImagesRef.current.reduce((total, image) => total + image.file.size, 0)
    const additions = []
    for (const candidate of candidates) {
      if (fingerprints.has(candidate.fingerprint)) {
        toast.error(`${candidate.file.name || 'Image'} is already selected.`)
        continue
      }
      if (totalBytes + candidate.file.size > MAX_IMAGE_BYTES) {
        toast.error('Selected image files must total no more than 8 MB per save.')
        continue
      }
      fingerprints.add(candidate.fingerprint)
      totalBytes += candidate.file.size
      additions.push({
        ...candidate,
        previewUrl: URL.createObjectURL(candidate.file),
      })
    }
    additions.forEach(image => objectUrlsRef.current.add(image.previewUrl))
    const next = [...pendingImagesRef.current, ...additions]
    pendingImagesRef.current = next
    setPendingImages(next)
  }

  const removePendingImage = id => {
    const image = pendingImagesRef.current.find(item => item.fingerprint === id)
    if (image) {
      URL.revokeObjectURL(image.previewUrl)
      objectUrlsRef.current.delete(image.previewUrl)
    }
    const next = pendingImagesRef.current.filter(item => item.fingerprint !== id)
    pendingImagesRef.current = next
    setPendingImages(next)
  }

  const submit = async e => {
    e.preventDefault()
    if (Number(form.price) > Number(form.mrp)) return toast.error('Selling price cannot be greater than MRP.')
    const pendingTotal = pendingImages.reduce((total, image) => total + image.file.size, 0)
    if (pendingTotal > MAX_IMAGE_BYTES) return toast.error('Selected image files must total no more than 8 MB per save.')
    const body = new FormData()
    Object.entries(form).forEach(([key, value]) => body.append(key, String(value)))
    pendingImages.forEach(image => body.append('images', image.file))
    if (editId) {
      body.append('existing_images_present', 'true')
      existingImages.forEach(image => body.append('existing_images', image))
    }
    setSaving(true)
    try {
      if (editId) await api.put(`/products/${editId}`, body)
      else await api.post('/products', body)
      toast.success(editId ? 'Product updated.' : 'Product added.')
      closeProductModal()
      load()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not save product.')
    } finally {
      setSaving(false)
    }
  }

  const remove = async product => {
    if (!window.confirm(`Delete "${product.name}" from the catalogue?`)) return
    try {
      await api.delete(`/products/${product.id}`)
      toast.success('Product deleted.')
      load()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not delete product.')
    }
  }

  const visible = products.filter(p =>
    `${p.name} ${p.category}`.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50/40 via-white to-emerald-50/30 px-4 py-8 text-slate-800 sm:px-6 sm:py-10 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-6">

        {/* ================= PAGE HEADING ================= */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <span className="mb-3 inline-block rounded-full bg-emerald-100 px-3 py-1.5 text-[0.68rem] font-bold uppercase tracking-[0.18em] text-emerald-700">
              Catalogue management
            </span>
            <h1 className="text-2xl font-extrabold leading-tight tracking-tight text-emerald-950 sm:text-3xl md:text-4xl">
              Products <em className="italic text-emerald-600">library.</em>
            </h1>
            <p className="mt-1 text-sm text-slate-600 sm:text-base">
              Add and maintain the products customers see on your website.
            </p>
          </div>

          <button
            onClick={openAdd}
            className="inline-flex items-center justify-center gap-2 self-start rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-500/25 transition hover:-translate-y-0.5 hover:shadow-xl hover:shadow-emerald-500/35 sm:self-auto sm:text-base"
          >
            <Plus size={17} /> Add product
          </button>
        </div>

        {/* ================= PRODUCTS PANEL ================= */}
        <section className="overflow-hidden rounded-3xl border border-emerald-100 bg-white shadow-lg shadow-emerald-500/5">

          {/* ---- Toolbar ---- */}
          <div className="flex flex-col gap-4 border-b border-emerald-100 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
            <div>
              <h3 className="flex items-center gap-2 text-base font-bold text-emerald-950 sm:text-lg">
                All products
                <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-700">
                  {products.length}
                </span>
              </h3>
              <p className="mt-0.5 text-xs text-slate-500 sm:text-sm">
                Prices, MRP, discounts, stock and prescription labels.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <label className="relative flex-1 sm:flex-initial">
                <Search size={15} className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-emerald-500" />
                <input
                  placeholder="Search products…"
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
              Loading product catalogue…
            </div>
          ) : !visible.length ? (
            <div className="flex flex-col items-center px-4 py-16 text-center">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
                <Package size={26} />
              </div>
              <h3 className="text-base font-bold text-emerald-950 sm:text-lg">
                {products.length ? 'No matching products' : 'Your catalogue is empty'}
              </h3>
              <p className="mt-1 max-w-sm text-sm text-slate-500">
                {products.length
                  ? 'Try a different search.'
                  : 'Add your first product to make it visible to customers.'}
              </p>
              {!products.length && (
                <button
                  onClick={openAdd}
                  className="mt-5 inline-flex items-center gap-2 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-emerald-500/25 transition hover:-translate-y-0.5 hover:shadow-xl"
                >
                  <Plus size={16} /> Add product
                </button>
              )}
            </div>
          ) : (
            <>
              {/* ---- Mobile: card list ---- */}
              <div className="flex flex-col gap-4 p-4 md:hidden">
                {visible.map(product => (
                  <div
                    key={product.id}
                    className="flex flex-col gap-4 rounded-2xl border border-emerald-100 bg-white p-4 shadow-sm transition hover:border-emerald-300 hover:shadow-md"
                  >
                    {/* Top: image + name + category */}
                    <div className="flex items-start gap-3">
                      <span className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-emerald-100 bg-emerald-50 text-emerald-700">
                        {product.images?.[0]
                          ? (
                            <img
                              src={imageUrl(product.images[0])}
                              alt=""
                              className="h-full w-full object-cover object-top"
                            />
                          )
                          : <Package size={24} />}
                      </span>
                      <div className="min-w-0 flex-1">
                        <b className="block truncate text-[0.95rem] font-bold text-emerald-950">
                          {product.name}
                        </b>
                        <small className="mt-0.5 line-clamp-2 block text-xs text-slate-500">
                          {product.description || 'No description added'}
                        </small>
                        <span className="mt-2 inline-block rounded-full bg-emerald-100 px-2.5 py-0.5 text-[0.68rem] font-bold text-emerald-700">
                          {product.category}
                        </span>
                      </div>
                    </div>

                    {/* Price + stock */}
                    <div className="grid grid-cols-2 gap-2">
                      <div className="rounded-xl border border-emerald-100 bg-emerald-50/40 px-3 py-2">
                        <span className="block text-[0.65rem] font-bold uppercase tracking-wide text-slate-500">
                          Price
                        </span>
                        <b className="block text-sm font-extrabold text-emerald-950">
                          ₹{Number(product.price).toLocaleString('en-IN')}
                        </b>
                        <small className="block text-[0.68rem] text-slate-500">
                          MRP ₹{Number(product.mrp).toLocaleString('en-IN')}
                        </small>
                      </div>
                      <div className="rounded-xl border border-emerald-100 bg-emerald-50/40 px-3 py-2">
                        <span className="block text-[0.65rem] font-bold uppercase tracking-wide text-slate-500">
                          Stock
                        </span>
                        <span className={`mt-1 inline-block rounded-full px-2 py-0.5 text-[0.68rem] font-bold ${
                          product.stock > 0
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-red-100 text-red-600'
                        }`}>
                          {product.stock > 0 ? `${product.stock} units` : 'Out of stock'}
                        </span>
                      </div>
                    </div>

                    {/* Rx + actions */}
                    <div className="flex items-center justify-between border-t border-emerald-100 pt-3">
                      {product.prescription_required ? (
                        <span className="rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-[0.68rem] font-bold text-amber-700">
                          Rx required
                        </span>
                      ) : (
                        <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[0.68rem] font-bold text-slate-600">
                          Not required
                        </span>
                      )}

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openEdit(product)}
                          aria-label={`Edit ${product.name}`}
                          title="Edit"
                          className="flex h-9 w-9 items-center justify-center rounded-lg border border-emerald-100 bg-white text-emerald-700 transition hover:border-emerald-400 hover:bg-emerald-50"
                        >
                          <Pencil size={15} />
                        </button>
                        <button
                          onClick={() => remove(product)}
                          aria-label={`Delete ${product.name}`}
                          title="Delete"
                          className="flex h-9 w-9 items-center justify-center rounded-lg border border-red-100 bg-white text-red-600 transition hover:border-red-300 hover:bg-red-50"
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
                <table className="w-full min-w-[820px] border-collapse text-left">
                  <thead>
                    <tr className="border-b border-emerald-100 bg-emerald-50/60 text-xs uppercase tracking-wide text-emerald-900">
                      <th className="px-5 py-3 font-bold">Product</th>
                      <th className="px-5 py-3 font-bold">Category</th>
                      <th className="px-5 py-3 font-bold">Price / MRP</th>
                      <th className="px-5 py-3 font-bold">Stock</th>
                      <th className="px-5 py-3 font-bold">Prescription</th>
                      <th className="px-5 py-3 text-right font-bold">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-emerald-100">
                    {visible.map(product => (
                      <tr key={product.id} className="transition hover:bg-emerald-50/40">
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <span className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-emerald-100 bg-emerald-50 text-emerald-700">
                              {product.images?.[0]
                                ? (
                                  <img
                                    src={imageUrl(product.images[0])}
                                    alt=""
                                    className="h-full w-full object-cover object-top"
                                  />
                                )
                                : <Package size={18} />}
                            </span>
                            <span className="min-w-0">
                              <b className="block truncate text-sm font-bold text-emerald-950">
                                {product.name}
                              </b>
                              <small className="line-clamp-1 block text-xs text-slate-500">
                                {product.description || 'No description added'}
                              </small>
                            </span>
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <span className="inline-block rounded-full bg-emerald-100 px-2.5 py-1 text-[0.68rem] font-bold text-emerald-700">
                            {product.category}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <b className="block text-sm font-extrabold text-emerald-950">
                            ₹{Number(product.price).toLocaleString('en-IN')}
                          </b>
                          <small className="block text-xs text-slate-500">
                            MRP ₹{Number(product.mrp).toLocaleString('en-IN')}
                          </small>
                        </td>
                        <td className="px-5 py-4">
                          <span className={`inline-block rounded-full px-2.5 py-1 text-[0.68rem] font-bold ${
                            product.stock > 0
                              ? 'bg-emerald-100 text-emerald-700'
                              : 'bg-red-100 text-red-600'
                          }`}>
                            {product.stock > 0 ? `${product.stock} units` : 'Out of stock'}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          {product.prescription_required ? (
                            <span className="inline-block rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-[0.68rem] font-bold text-amber-700">
                              Rx required
                            </span>
                          ) : (
                            <span className="inline-block rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[0.68rem] font-bold text-slate-600">
                              Not required
                            </span>
                          )}
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex justify-end gap-1.5">
                            <button
                              onClick={() => openEdit(product)}
                              aria-label={`Edit ${product.name}`}
                              title="Edit"
                              className="flex h-8 w-8 items-center justify-center rounded-lg border border-emerald-100 bg-white text-emerald-700 transition hover:border-emerald-400 hover:bg-emerald-50"
                            >
                              <Pencil size={15} />
                            </button>
                            <button
                              onClick={() => remove(product)}
                              aria-label={`Delete ${product.name}`}
                              title="Delete"
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
      {modal && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-emerald-950/40 p-0 backdrop-blur-sm sm:items-center sm:p-4"
          onMouseDown={e => { if (e.target === e.currentTarget) closeProductModal() }}
        >
          <section className="flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-t-3xl border border-emerald-100 bg-white shadow-2xl sm:rounded-3xl">

            {/* Modal head */}
            <div className="flex items-start justify-between gap-3 border-b border-emerald-100 p-5 sm:p-6">
              <div>
                <span className="mb-2 inline-block rounded-full bg-emerald-100 px-2.5 py-1 text-[0.65rem] font-bold uppercase tracking-[0.18em] text-emerald-700">
                  Product details
                </span>
                <h2 className="text-lg font-extrabold text-emerald-950 sm:text-xl">
                  {editId ? 'Edit product' : 'Add a product'}
                </h2>
                <p className="mt-0.5 text-xs text-slate-500 sm:text-sm">
                  Fields with * are required.
                </p>
              </div>
              <button
                type="button"
                onClick={closeProductModal}
                aria-label="Close dialog"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-emerald-100 bg-white text-emerald-700 transition hover:border-emerald-400 hover:bg-emerald-50"
              >
                <X size={17} />
              </button>
            </div>

            {/* Modal form */}
            <form onSubmit={submit} className="flex flex-1 flex-col overflow-hidden">
              <div className="flex-1 space-y-4 overflow-y-auto p-5 sm:p-6">

                <label className="flex flex-col gap-1.5">
                  <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Product name *
                  </span>
                  <input
                    required
                    name="name"
                    value={form.name}
                    onChange={update}
                    placeholder="e.g. Product name"
                    className="w-full rounded-xl border border-emerald-100 bg-emerald-50/40 px-4 py-3 text-sm text-emerald-950 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/15 sm:text-base"
                  />
                </label>

                <label className="flex flex-col gap-1.5">
                  <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Category *
                  </span>
                  <select
                    required
                    name="category"
                    value={form.category}
                    onChange={update}
                    className="w-full rounded-xl border border-emerald-100 bg-emerald-50/40 px-4 py-3 text-sm text-emerald-950 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/15 sm:text-base"
                  >
                    {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                  </select>
                </label>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <label className="flex flex-col gap-1.5">
                    <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Selling price (₹) *
                    </span>
                    <input
                      required
                      type="number"
                      min="0"
                      step="0.01"
                      name="price"
                      value={form.price}
                      onChange={update}
                      className="w-full rounded-xl border border-emerald-100 bg-emerald-50/40 px-4 py-3 text-sm text-emerald-950 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/15 sm:text-base"
                    />
                  </label>
                  <label className="flex flex-col gap-1.5">
                    <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                      MRP (₹) *
                    </span>
                    <input
                      required
                      type="number"
                      min="0"
                      step="0.01"
                      name="mrp"
                      value={form.mrp}
                      onChange={update}
                      className="w-full rounded-xl border border-emerald-100 bg-emerald-50/40 px-4 py-3 text-sm text-emerald-950 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/15 sm:text-base"
                    />
                  </label>
                </div>

                <label className="flex flex-col gap-1.5">
                  <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Stock quantity *
                  </span>
                  <input
                    required
                    type="number"
                    min="0"
                    step="1"
                    name="stock"
                    value={form.stock}
                    onChange={update}
                    className="w-full rounded-xl border border-emerald-100 bg-emerald-50/40 px-4 py-3 text-sm text-emerald-950 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/15 sm:text-base"
                  />
                </label>

                <label className="flex flex-col gap-1.5">
                  <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Description
                  </span>
                  <textarea
                    name="description"
                    rows="3"
                    value={form.description}
                    onChange={update}
                    placeholder="Product information"
                    className="w-full resize-none rounded-xl border border-emerald-100 bg-emerald-50/40 px-4 py-3 text-sm text-emerald-950 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/15 sm:text-base"
                  />
                </label>

                <section className="space-y-3 rounded-2xl border border-emerald-100 bg-emerald-50/30 p-4">
                  <div>
                    <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-600">Product images</h3>
                    <p className="mt-1 text-xs text-slate-500">
                      JPG, PNG, WEBP or GIF. Selected files must total no more than 8 MB per save.
                    </p>
                  </div>
                  <input
                    ref={galleryInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    multiple
                    onChange={event => {
                      addPendingFiles(Array.from(event.target.files || []), 'device')
                      event.target.value = ''
                    }}
                    className="sr-only"
                    aria-label="Choose product photos from device"
                  />
                  <input
                    ref={cameraInputRef}
                    type="file"
                    accept="image/*"
                    capture="environment"
                    onChange={event => {
                      addPendingFiles(Array.from(event.target.files || []), 'camera')
                      event.target.value = ''
                    }}
                    className="sr-only"
                    aria-label="Take or choose a product photo"
                  />
                  <div className="flex flex-col gap-2 sm:flex-row">
                    <button
                      type="button"
                      onClick={() => galleryInputRef.current?.click()}
                      className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-emerald-200 bg-white px-3 py-2.5 text-sm font-semibold text-emerald-900 transition hover:border-emerald-400 hover:bg-emerald-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-600"
                    >
                      <ImagePlus size={17} /> Choose Photos from Device
                    </button>
                    <button
                      type="button"
                      onClick={() => setCameraOpen(true)}
                      className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 px-3 py-2.5 text-sm font-semibold text-white transition hover:shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700"
                    >
                      <Camera size={17} /> Open Camera / Take Photo
                    </button>
                  </div>

                  {!!existingImages.length && (
                    <div className="space-y-2">
                      <h4 className="text-sm font-semibold text-emerald-950">Saved images</h4>
                      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                        {existingImages.map((image, index) => (
                          <div key={`${image}-${index}`} className="relative overflow-hidden rounded-xl border border-emerald-100 bg-white">
                            <img src={imageUrl(image)} alt={`Saved product image ${index + 1}`} className="h-28 w-full object-cover" />
                            <button
                              type="button"
                              onClick={() => setExistingImages(current => current.filter((_, imageIndex) => imageIndex !== index))}
                              aria-label={`Remove saved image ${index + 1}`}
                              className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-white/95 text-red-600 shadow hover:bg-red-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-red-600"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {!!pendingImages.length && (
                    <div className="space-y-2">
                      <h4 className="text-sm font-semibold text-emerald-950">Newly selected photos</h4>
                      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                        {pendingImages.map((image, index) => (
                          <div key={image.fingerprint} className="relative overflow-hidden rounded-xl border border-emerald-100 bg-white">
                            <img src={image.previewUrl} alt={`New ${image.source === 'camera' ? 'camera' : 'device'} photo ${index + 1}`} className="h-28 w-full object-cover" />
                            <span className="absolute bottom-2 left-2 rounded-full bg-white/95 px-2 py-1 text-[0.65rem] font-semibold text-emerald-900">
                              {image.source === 'camera' ? 'Camera' : 'Device'}
                            </span>
                            <button
                              type="button"
                              onClick={() => removePendingImage(image.fingerprint)}
                              aria-label={`Remove new image ${index + 1}`}
                              className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-white/95 text-red-600 shadow hover:bg-red-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-red-600"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {!existingImages.length && !pendingImages.length && (
                    <p className="rounded-xl border border-dashed border-emerald-200 bg-white px-3 py-4 text-center text-sm text-slate-500">
                      No product photos selected.
                    </p>
                  )}
                </section>

                <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-emerald-100 bg-emerald-50/40 p-4 transition hover:border-emerald-300 hover:bg-emerald-50">
                  <input
                    type="checkbox"
                    name="prescription_required"
                    checked={form.prescription_required}
                    onChange={update}
                    className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer accent-emerald-600"
                  />
                  <span className="flex flex-col">
                    <b className="text-sm font-semibold text-emerald-950">Prescription required</b>
                    <small className="text-xs text-slate-500">Show an Rx warning badge on the product.</small>
                  </span>
                </label>
              </div>

              <div className="flex flex-col gap-2.5 border-t border-emerald-100 p-5 sm:flex-row sm:justify-end sm:p-6">
                <button
                  type="button"
                  onClick={closeProductModal}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-emerald-100 bg-white px-5 py-2.5 text-sm font-semibold text-emerald-900 transition hover:border-emerald-400 hover:bg-emerald-50"
                >
                  Cancel
                </button>
                <button
                  disabled={saving}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-emerald-500/25 transition hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {saving ? 'Saving…' : editId ? 'Save changes' : 'Add product'}
                  <Plus size={16} />
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
      {cameraOpen && (
        <CameraDialog
          onClose={() => setCameraOpen(false)}
          onUsePhoto={file => {
            addPendingFiles([file], 'camera')
            setCameraOpen(false)
          }}
          onUseFallback={() => cameraInputRef.current?.click()}
        />
      )}
    </div>
  )
}