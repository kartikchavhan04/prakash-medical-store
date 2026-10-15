export default function ShopPhoto({
  src,
  alt,
  loading = 'lazy',
  className = '',
  imageClassName = '',
}) {
  return (
    <div className={`aspect-[4/3] overflow-hidden bg-emerald-950 ${className}`}>
      <img
        src={src}
        alt={alt}
        loading={loading}
        className={`h-full w-full object-cover ${imageClassName}`}
      />
    </div>
  )
}
