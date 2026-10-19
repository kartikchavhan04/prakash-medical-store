import assert from 'node:assert/strict'
import test from 'node:test'
import { fetchProducts, PRODUCTS_REQUEST_TIMEOUT_MS } from '../src/productsRequest.js'

const productResponse = {
  data: {
    products: [{ id: 'product-1', name: 'Test product' }],
    categories: ['Tablets'],
  },
}

test('returns products from a successful response with the extended request timeout', async () => {
  let requestConfig
  const api = {
    get: async (_url, config) => {
      requestConfig = config
      return productResponse
    },
  }

  const response = await fetchProducts(api, { search: '', category: 'All' })

  assert.deepEqual(response.data.products, productResponse.data.products)
  assert.equal(requestConfig.timeout, 60_000)
  assert.equal(PRODUCTS_REQUEST_TIMEOUT_MS, 60_000)
})

test('retries a transient failure once and returns the successful response', async () => {
  let attempts = 0
  const api = {
    get: async () => {
      attempts += 1
      if (attempts === 1) {
        const error = new Error('Service unavailable')
        error.response = { status: 503 }
        throw error
      }
      return productResponse
    },
  }

  const response = await fetchProducts(api, { search: '', category: 'All' })

  assert.deepEqual(response.data.products, productResponse.data.products)
  assert.equal(attempts, 2)
})

test('does not retry ordinary client errors', async () => {
  let attempts = 0
  const api = {
    get: async () => {
      attempts += 1
      const error = new Error('Bad request')
      error.response = { status: 400 }
      throw error
    },
  }

  await assert.rejects(fetchProducts(api, { search: 'x', category: 'All' }), /Bad request/)
  assert.equal(attempts, 1)
})

test('does not retry after a second transient failure', async () => {
  let attempts = 0
  const api = {
    get: async () => {
      attempts += 1
      const error = new Error('Gateway timeout')
      error.response = { status: 504 }
      throw error
    },
  }

  await assert.rejects(fetchProducts(api, { search: '', category: 'All' }), /Gateway timeout/)
  assert.equal(attempts, 2)
})

test('aborting during the retry delay prevents another request', async () => {
  const controller = new AbortController()
  let attempts = 0
  const api = {
    get: async () => {
      attempts += 1
      const error = new Error('Network error')
      error.code = 'ERR_NETWORK'
      throw error
    },
  }

  const request = fetchProducts(api, { search: '', category: 'All' }, controller.signal)
  setTimeout(() => controller.abort(), 10)

  await assert.rejects(request, { name: 'AbortError' })
  assert.equal(attempts, 1)
})

test('returns a slow successful response instead of an empty result', async () => {
  const api = {
    get: async (_url, config) => {
      assert.equal(config.timeout, PRODUCTS_REQUEST_TIMEOUT_MS)
      await new Promise(resolve => setTimeout(resolve, 25))
      return productResponse
    },
  }

  const response = await fetchProducts(api, { search: '', category: 'All' })

  assert.equal(response.data.products.length, 1)
})
