import { useEffect, useState } from 'preact/hooks'

import { SITES_URL } from 'imdb-link-em-all/constants'

export const loadSites = () =>
  new Promise((resolve, reject) =>
    GM.xmlHttpRequest({
      method: 'GET',
      url: SITES_URL,
      nocache: true,
      onload({ response, status, statusText }) {
        if (status === 200) {
          try {
            resolve(JSON.parse(response).sort((a, b) => a.title.localeCompare(b.title)))
          } catch (e) {
            reject(e)
          }
        } else {
          reject(new Error(`LTA: Could not load sites (URL=${SITES_URL}): ${status} ${statusText}`))
        }
      },
      onerror({ status, statusText }) {
        reject(new Error(`LTA: Could not load sites (URL=${SITES_URL}): ${status} ${statusText}`))
      },
    })
  )

const useSites = () => {
  const [sites, setSites] = useState([])

  useEffect(() => {
    loadSites()
      .then((s) => setSites(s))
      .catch((err) => setSites(err.message))
  }, [])

  return sites
}

export default useSites
