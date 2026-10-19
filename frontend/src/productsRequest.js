export const PRODUCTS_REQUEST_TIMEOUT_MS = 60_000
const RETRY_DELAY_MS = 500

function isRetryable(error) {
  if (error?.response) {
    return [502, 503, 504].includes(error.response.status)
  }

  if (error?.code === 'ERR_CANCELED') return false
  return ['ECONNABORTED', 'ETIMEDOUT', 'ERR_NETWORK'].includes(error?.code)
    || Boolean(error?.request && !error?.code)
}

function waitForRetry(signal) {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) {
      reject(signal.reason || new DOMException('Request aborted.', 'AbortError'))
      return
    }

    const cleanup = () => signal?.removeEventListener('abort', onAbort)
    const timer = setTimeout(() => {
      cleanup()
      resolve()
    }, RETRY_DELAY_MS)
    const onAbort = () => {
      clearTimeout(timer)
      cleanup()
      reject(signal.reason || new DOMException('Request aborted.', 'AbortError'))
    }

    signal?.addEventListener('abort', onAbort, { once: true })
  })
}

export async function fetchProducts(api, params, signal) {
  for (let attempt = 0; attempt < 2; attempt += 1) {
    try {
      return await api.get('/products', {
        params,
        timeout: PRODUCTS_REQUEST_TIMEOUT_MS,
        signal,
      })
    } catch (error) {
      if (attempt === 1 || signal?.aborted || !isRetryable(error)) throw error
      await waitForRetry(signal)
    }
  }

  throw new Error('Product request failed after its retry.')
}
