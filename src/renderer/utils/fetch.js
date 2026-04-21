const originalFetch = require('isomorphic-fetch');
const fetchRetry = require('fetch-retry')(originalFetch)

const attempt = Symbol('attempt')

export function catGirlFetch(url, init = {}, timeout = 5000) {
  init[attempt] || (init[attempt] = 0)
  init.retryOn = function (attempt, error) {
    if (attempt > 2) return false
    return error !== null
  }

  init.retryDelay = function (attempt, error, response) {
    return Math.pow(2, attempt) * 300
  }

  return Promise.race([
    fetchRetry(url, init)
      .then(x => {
        if (!x.ok) {
          const err = new Error(`HTTP ${x.status}`)
          err.status = x.status
          throw err
        }
        return x
      })
      .then(async x => {
        if (init.raw) return x

        const text = await x.text()
        try {
          return JSON.parse(text)
        } catch (e) {
          console.log(text)
          throw e
        }
      })
      .catch(err => Promise.reject(err)),

    new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Timeout, mazafaka!')), timeout)
    )
  ])
}
