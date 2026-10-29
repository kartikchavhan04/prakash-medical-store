import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import QRCode from 'qrcode'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export const DESTINATION_URL = 'https://prakash-medical-store.onrender.com/products'

export const QR_OPTIONS_PNG = {
  errorCorrectionLevel: 'M',
  type: 'image/png',
  width: 1200,
  margin: 4,
  color: {
    dark: '#000000',
    light: '#ffffff',
  },
}

export const QR_OPTIONS_SVG = {
  errorCorrectionLevel: 'M',
  type: 'svg',
  margin: 4,
  color: {
    dark: '#000000',
    light: '#ffffff',
  },
}

export async function generateQrAssets(publicDir = path.resolve(__dirname, '../public')) {
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true })
  }

  const pngPath = path.join(publicDir, 'website-qr.png')
  const svgPath = path.join(publicDir, 'website-qr.svg')

  console.log(`Generating QR code for destination: ${DESTINATION_URL}`)

  // Generate PNG (1200x1200)
  await QRCode.toFile(pngPath, DESTINATION_URL, QR_OPTIONS_PNG)
  console.log(`✓ PNG generated at: ${pngPath}`)

  // Generate SVG (vector, scalable)
  const svgString = await QRCode.toString(DESTINATION_URL, QR_OPTIONS_SVG)
  fs.writeFileSync(svgPath, svgString, 'utf8')
  console.log(`✓ SVG generated at: ${svgPath}`)

  return { pngPath, svgPath, destinationUrl: DESTINATION_URL }
}

// Execute if run directly
if (process.argv[1] === __filename) {
  generateQrAssets()
    .then(() => console.log('QR Code generation complete!'))
    .catch((err) => {
      console.error('Error generating QR code:', err)
      process.exit(1)
    })
}

