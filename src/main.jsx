import { h, render } from 'preact'

import App from 'imdb-link-em-all/components/App'

const parseImdbInfo = () => {
  // TODO: extract type (TV show, movie, ...)

  // Parse IMDb number and layout
  const mUrl = /^\/title\/tt([0-9]{7,8})\/([a-z]*)/.exec(window.location.pathname)
  if (!mUrl) {
    throw new Error('Could not parse IMDb URL!')
  }

  const info = {
    id: mUrl[1],
    layout: ['reference', 'combined'].includes(mUrl[2]) ? 'legacy' : 'new',
  }

  const titleSelector = info.layout === 'legacy' ? 'h3[itemprop=name]' : 'h1'
  info.title = document.querySelector(titleSelector).innerText.trim()
  const mTitle = /^(.+)\s+\((\d+)\)/.exec(info.title)
  if (mTitle) {
    info.title = mTitle[1].trim()
    info.year = parseInt(mTitle[2].trim(), 10)
  }

  return info
}

const imdbInfo = parseImdbInfo()
// TODO legacy layout
const injectionEl = document.querySelector('.title-overview')
if (!injectionEl) {
  throw new Error('LTA: Could not find target container!')
}
const container = document.createElement('div')
container.classList.add('article')
injectionEl.appendChild(container)
render(<App imdbInfo={imdbInfo} />, container)
