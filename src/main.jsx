import { h, render } from 'preact'

import { CONTAINER_ID } from 'imdb-link-em-all/constants'
import App from 'imdb-link-em-all/components/App'
import { detectLayout, failureLog, parseImdbInfo, successLog } from 'imdb-link-em-all/util'

try {
  // Parse IMDb number and layout
  const mUrl = /^\/(?:[a-z]{2}\/)?title\/tt([0-9]{7,8})(?:\/([a-z]*))?/.exec(
    window.location.pathname
  )

  if (!mUrl) {
    throw new Error('Could not parse IMDb URL!')
  }

  // Only enable on title page and reference layout
  const shouldEnable = [undefined, '', 'reference'].includes(mUrl[2])

  if (shouldEnable) {
    const imdbId = mUrl[1]
    const layoutInfo = detectLayout(mUrl)
    const [imdbInfo, containerSelector] = parseImdbInfo(imdbId, layoutInfo)

    function injectAndStart() {
      let injectionEl = document.querySelector(containerSelector)
      if (!injectionEl) {
        throw new Error('Could not find target container!')
      }

      const container = document.createElement('div')
      container.id = CONTAINER_ID
      container.className = 'ipc-page-content-container ipc-page-content-container--center'
      container.style.position = 'relative'
        container.style.padding = '0 var(--ipt-pageMargin)'
        container.style.minHeight = '50px'

      injectionEl.prepend(container)
      render(<App imdbInfo={imdbInfo} />, container)
      successLog(imdbInfo.layout)
    }

    function containerWatchdog() {
      const container = document.querySelector(`#${CONTAINER_ID}`)
      if (container === null) {
        injectAndStart()
      }
      window.setTimeout(containerWatchdog, 1000)
    }

    window.setTimeout(containerWatchdog, 500)
  }
} catch (error) {
  failureLog(error)
}
