import { useEffect, useState } from 'preact/hooks'

import { FETCH_STATE } from 'imdb-link-em-all/constants'
import replaceFields from 'imdb-link-em-all/util'

const checkResponse = (resp, site) => {
  // Likely a redirect to login page
  if (resp.responseHeaders && resp.responseHeaders.includes('Refresh: 0; url=')) {
    return FETCH_STATE.NO_ACCESS
  }

  // There should be a responseText
  if (!resp.responseText) {
    return FETCH_STATE.ERROR
  }

  // Detect Blogger content warning
  if (
    resp.responseText.includes(
      'The blog that you are about to view may contain content only suitable for adults.'
    )
  ) {
    return FETCH_STATE.NO_ACCESS
  }

  // Detect CloudFlare anti DDOS page
  if (resp.responseText.includes('Checking your browser before accessing')) {
    return FETCH_STATE.NO_ACCESS
  }

  // Check site access
  if (site.noAccessMatcher) {
    const matchStrings = Array.isArray(site.noAccessMatcher)
      ? site.noAccessMatcher
      : [site.noAccessMatcher]
    if (matchStrings.some((matchString) => resp.responseText.includes(matchString))) {
      return FETCH_STATE.NO_ACCESS
    }
  }
  // Check results
  if (Array.isArray(site.noResultsMatcher)) {
    // Advanced ways of checking, currently only EL_COUNT is supported
    const [checkType, selector, compType, number] = site.noResultsMatcher
    const m = resp.responseHeaders.match(/content-type:\s([^\s;]+)/)
    const contentType = m ? m[1] : 'text/html'

    let doc
    try {
      const parser = new DOMParser()
      doc = parser.parseFromString(resp.responseText, contentType)
    } catch (e) {
      console.error('Could not parse document!')
      return FETCH_STATE.ERROR
    }

    switch (checkType) {
      case 'EL_COUNT': {
        let result
        try {
          result = doc.querySelectorAll(selector)
        } catch (err) {
          console.error(err)
          return FETCH_STATE.ERROR
        }
        if (compType === 'GT') {
          if (result.length > number) {
            return FETCH_STATE.RESULTS_FOUND
          }
        }
        if (compType === 'LT') {
          if (result.length < number) {
            return FETCH_STATE.RESULTS_FOUND
          }
        }
        break
      }
      default:
    }
    return FETCH_STATE.NO_RESULTS
  }

  const matchStrings = Array.isArray(site.noResultsMatcher)
    ? site.noResultsMatcher
    : [site.noResultsMatcher]
  if (matchStrings.some((matchString) => resp.responseText.includes(matchString))) {
    return FETCH_STATE.NO_RESULTS
  }

  return FETCH_STATE.RESULTS_FOUND
}

const useResultFetcher = (imdbInfo, site) => {
  const [fetchState, setFetchState] = useState(null)

  useEffect(() => {
    let xhr
    if (site.noResultsMatcher) {
      // Site supports result fetching
      const { url } = site
      const isPost = Array.isArray(url)

      const opts = {
        timeout: 20000,
        onload: (resp) => setFetchState(checkResponse(resp, site)),
        onerror: (resp) => {
          console.error(`Failed to fetch results from URL '${url}': ${resp.statusText}`)
          setFetchState(FETCH_STATE.ERROR)
        },
        ontimeout: () => setFetchState(FETCH_STATE.TIMEOUT),
      }

      if (isPost) {
        const [postUrl, fields] = url
        opts.method = 'POST'
        opts.url = postUrl
        opts.headers = { 'Content-Type': 'application/x-www-form-urlencoded' }
        opts.data = Object.keys(fields)
          .map((key) => {
            const val = replaceFields(fields[key], imdbInfo, false)
            return `${key}=${val}`
          })
          .join('&')
      } else {
        opts.method = 'GET'
        opts.url = replaceFields(url, imdbInfo)
      }

      xhr = GM.xmlHttpRequest(opts)
      setFetchState(FETCH_STATE.LOADING)
    }

    return () => {
      if (xhr && xhr.abort) {
        xhr.abort()
      }
    }
  }, [imdbInfo, site])

  return fetchState
}

export default useResultFetcher
