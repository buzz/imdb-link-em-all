import { h, render } from 'preact'

import { CONTAINER_ID } from 'imdb-link-em-all/constants'
import App from 'imdb-link-em-all/components/App'
import { detectLayout, parseImdbInfo } from 'imdb-link-em-all/util'

// Parse IMDb number and layout
const mUrl = /^\/(?:[a-z]{2}\/)?title\/tt([0-9]{7,8})(?:\/([a-z]*))?/.exec(window.location.pathname)

if (!mUrl) {
  throw new Error('LTA: Could not parse IMDb URL!')
}

// Only enable on title page and reference layout
const shouldEnable = [undefined, 'reference'].includes(mUrl[2])

// Only enable on title page and reference layout
if (shouldEnable) {
  const imdbId = mUrl[1]
  const layoutInfo = detectLayout(mUrl)
  const [imdbInfo, containerSelector] = parseImdbInfo(imdbId, layoutInfo)

  function injectAndStart() {
    let injectionEl = document.querySelector(containerSelector)
    if (!injectionEl) {
      throw new Error('LTA: Could not find target container!')
    }

    const container = document.createElement('div')
    container.id = CONTAINER_ID
    container.style.position = 'relative'

    if (imdbInfo.layout === 'default') {
      container.className = 'ipc-page-content-container ipc-page-content-container--center'
      container.style.padding = '0 var(--ipt-pageMargin)'
      container.style.minHeight = '50px'
      injectionEl.prepend(container)
    }

    // reference layout
    else {
      container.className = 'ipc-page-content-container ipc-page-content-container--center'
      container.style.padding = '0 var(--ipt-pageMargin)'
      injectionEl.prepend(container)
    }

    render(<App imdbInfo={imdbInfo} />, container)
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
