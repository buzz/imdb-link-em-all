import { h, render } from 'preact'

import App from 'imdb-link-em-all/components/App'

const divId = '__LTA__'

const detectLayout = (mUrl) => {
  // Currently there seem to be 3 different IMDb layouts:
  // 1) "legacy": URL ends with '/reference'
  if (['reference', 'combined'].includes(mUrl[2])) {
    return ['legacy', 'h3[itemprop=name]', '.titlereference-section-overview > *:last-child']
  }
  // 2) "redesign2020": Redesign 2020
  //    https://www.imdb.com/preferences/beta-control?e=tmd&t=in&u=/title/tt0163978/
  if (document.querySelector('[data-testid="hero-title-block__title"]')) {
    return ['redesign2020', 'title', '[class*=TitleMainBelowTheFoldGroup]']
  }
  // 3) "new": The old default (has been around for many years)
  return ['new', 'h1', '.title-overview']
}

const parseImdbInfo = () => {
  // TODO: extract type (TV show, movie, ...)

  // Parse IMDb number and layout
  const mUrl = /^\/title\/tt([0-9]{7,8})\/([a-z]*)/.exec(window.location.pathname)
  if (!mUrl) {
    throw new Error('LTA: Could not parse IMDb URL!')
  }

  const [layout, titleSelector, containerSelector] = detectLayout(mUrl)

  const info = { id: mUrl[1], layout }

  info.title = document.querySelector(titleSelector).innerText.trim()
  const mTitle = /^(.+)\s+\((\d+)\)/.exec(info.title)
  if (mTitle) {
    info.title = mTitle[1].trim()
    info.year = parseInt(mTitle[2].trim(), 10)
  }

  return [info, containerSelector]
}

const [imdbInfo, containerSelector] = parseImdbInfo()

const injectAndStart = () => {
  let injectionEl = document.querySelector(containerSelector)
  if (!injectionEl) {
    throw new Error('LTA: Could not find target container!')
  }

  const container = document.createElement('div')
  container.id = divId
  container.style.position = 'relative'
  if (imdbInfo.layout === 'redesign2020') {
    container.className = 'ipc-page-content-container ipc-page-content-container--center'
    container.style.padding = '0 var(--ipt-pageMargin)'
    container.style.minHeight = '50px'
    injectionEl.prepend(container)
  } else {
    container.classList.add('article')
    injectionEl.appendChild(container)
  }

  render(<App imdbInfo={imdbInfo} />, container)
}

const containerWatchdog = () => {
  const container = document.querySelector(`#${divId}`)
  if (container === null) {
    injectAndStart()
  }
  window.setTimeout(containerWatchdog, 1000)
}

window.setTimeout(containerWatchdog, 500)
