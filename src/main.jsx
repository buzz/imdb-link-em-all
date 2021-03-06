import { h, render } from 'preact'

import App from 'imdb-link-em-all/components/App'

const detectLayout = (mUrl) => {
  // Currently there seem to be 3 different IMDb layouts:
  // 1) "legacy": URL ends with '/reference'
  // 2) "new": The default (has been around for many years)
  // 3) "redesign2002": Redesign (currently beta opt-in) using
  //    https://www.imdb.com/preferences/beta-control?e=tmd&t=in&u=/title/tt0163978/
  //    (Enabled with cookie)
  if (['reference', 'combined'].includes(mUrl[2])) {
    return ['legacy', 'h3[itemprop=name]', '.titlereference-section-overview > *:last-child']
  }
  if (document.cookie.includes('beta-control=tmd=in;')) {
    return [
      'redesign2020',
      '[data-testid=hero-title-block__title]',
      '[class*=TitleMainBelowTheFoldGroup__Container]',
    ]
  }
  return ['new', 'h1', '.title-overview']
}

const parseImdbInfo = () => {
  // TODO: extract type (TV show, movie, ...)

  // Parse IMDb number and layout
  const mUrl = /^\/title\/tt([0-9]{7,8})\/([a-z]*)/.exec(window.location.pathname)
  if (!mUrl) {
    throw new Error('Could not parse IMDb URL!')
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
const injectionEl = document.querySelector(containerSelector)
if (!injectionEl) {
  throw new Error('LTA: Could not find target container!')
}

const container = document.createElement('div')
container.style.position = 'relative'
if (imdbInfo.layout === 'redesign2020') {
  container.style.padding = '0 var(--ipt-pageMargin)'
  container.style.maxWidth = '800px'
  injectionEl.insertBefore(container, injectionEl.firstChild)
} else {
  container.classList.add('article')
  injectionEl.appendChild(container)
}

render(<App imdbInfo={imdbInfo} />, container)
