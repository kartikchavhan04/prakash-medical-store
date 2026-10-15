import { useState } from 'react'
import { ImageOff } from 'lucide-react'

export default function ImageWithFallback({
  src,
  alt,
  className = '',
  fallbackClassName = 'flex items-center justify-center bg-emerald-50 text-emerald-600',
  FallbackIcon = ImageOff,
  loading,
}) {
  const [failedSrc, setFailedSrc] = useState('')

  if (!src || failedSrc === src) {
    return (
      <span
        role="img"
        aria-label={alt ? `${alt} unavailable` : 'Image unavailable'}
        className={fallbackClassName}
      >
        <FallbackIcon size={24} aria-hidden="true" />
      </span>
    )
  }

  return (
    <img
      src={src}
      alt={alt}
      loading={loading}
      onError={() => setFailedSrc(src)}
      className={className}
    />
  )
}
