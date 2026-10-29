import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import test from 'node:test'
import { fileURLToPath } from 'node:url'
import { PNG } from 'pngjs'
import jsQR from 'jsqr'
import { DESTINATION_URL } from '../scripts/generate-qr.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const EXPECTED_URL = 'https://prakash-medical-store.onrender.com/products'
const PUBLIC_DIR = path.resolve(__dirname, '../public')
const DIST_DIR = path.resolve(__dirname, '../dist')
const SRC_DIR = path.resolve(__dirname, '../src')
const PNG_PATH = path.join(PUBLIC_DIR, 'website-qr.png')
const SVG_PATH = path.join(PUBLIC_DIR, 'website-qr.svg')
const DIST_PNG_PATH = path.join(DIST_DIR, 'website-qr.png')
const DIST_SVG_PATH = path.join(DIST_DIR, 'website-qr.svg')
const COMPONENT_PATH = path.join(SRC_DIR, 'components/StoreQrCode.jsx')

test('DESTINATION_URL matches exact production products URL', () => {
  assert.equal(DESTINATION_URL, EXPECTED_URL)
  assert.doesNotMatch(DESTINATION_URL, /localhost|127\.0\.0\.1|vercel\.app/)
})

test('StoreQrCode component file exists and configures the exact destination URL', () => {
  assert.ok(fs.existsSync(COMPONENT_PATH), 'StoreQrCode.jsx must exist')
  const componentContent = fs.readFileSync(COMPONENT_PATH, 'utf8')
  assert.ok(componentContent.includes(EXPECTED_URL), 'Component must reference exact production destination URL')
  assert.doesNotMatch(componentContent, /localhost|127\.0\.0\.1|vercel\.app/)
  assert.ok(componentContent.includes('Scan to Visit'), 'Component must include "Scan to Visit" heading')
  assert.ok(componentContent.includes('Prakash Medical and General Store'), 'Component must include store name')
  assert.ok(componentContent.includes('handleDownloadPng'), 'Component must have PNG download handler')
  assert.ok(componentContent.includes('handleDownloadSvg'), 'Component must have SVG download handler')
  assert.ok(componentContent.includes('handleCopyLink'), 'Component must have copy link handler')
  assert.ok(componentContent.includes('handlePrint'), 'Component must have print handler')
})

test('QR code asset files exist in public directory', () => {
  assert.ok(fs.existsSync(PNG_PATH), 'website-qr.png should exist in public directory')
  assert.ok(fs.existsSync(SVG_PATH), 'website-qr.svg should exist in public directory')
})

test('website-qr.png has dimensions of 1200x1200 and decodes to exact products URL', async () => {
  const pngBuffer = fs.readFileSync(PNG_PATH)
  const png = PNG.sync.read(pngBuffer)

  assert.equal(png.width, 1200, 'PNG width should be 1200 pixels')
  assert.equal(png.height, 1200, 'PNG height should be 1200 pixels')

  // Convert buffer to Uint8ClampedArray for jsQR
  const rgbaData = new Uint8ClampedArray(png.data.buffer, png.data.byteOffset, png.data.byteLength)
  const code = jsQR(rgbaData, png.width, png.height)

  assert.ok(code, 'jsQR should successfully detect and decode the QR code')
  assert.equal(code.data, EXPECTED_URL, `Decoded QR code data must be exactly "${EXPECTED_URL}"`)
})

test('website-qr.svg is valid, well-formed SVG with quiet zone and scalable viewBox', () => {
  const svgContent = fs.readFileSync(SVG_PATH, 'utf8')

  assert.ok(svgContent.startsWith('<svg'), 'SVG file must start with <svg')
  assert.ok(svgContent.includes('xmlns="http://www.w3.org/2000/svg"'), 'SVG must have valid xmlns')
  assert.ok(svgContent.includes('viewBox="0 0 41 41"'), 'SVG must have viewBox including quiet zone (41x41 modules)')
  assert.ok(svgContent.includes('fill="#ffffff"'), 'SVG must have white background')
  assert.ok(svgContent.includes('stroke="#000000"'), 'SVG must have high-contrast black QR modules')
})

test('production build dist directory contains valid QR code assets', () => {
  if (fs.existsSync(DIST_DIR)) {
    assert.ok(fs.existsSync(DIST_PNG_PATH), 'website-qr.png should exist in dist directory')
    assert.ok(fs.existsSync(DIST_SVG_PATH), 'website-qr.svg should exist in dist directory')

    const distPngBuffer = fs.readFileSync(DIST_PNG_PATH)
    const distPng = PNG.sync.read(distPngBuffer)
    assert.equal(distPng.width, 1200)
    assert.equal(distPng.height, 1200)

    const rgbaData = new Uint8ClampedArray(distPng.data.buffer, distPng.data.byteOffset, distPng.data.byteLength)
    const decoded = jsQR(rgbaData, distPng.width, distPng.height)
    assert.ok(decoded)
    assert.equal(decoded.data, EXPECTED_URL)
  }
})
