import { h, render } from 'preact'

import App from 'imdb-link-em-all/components/App'

const injectionEl = document.querySelector('.title-overview')
if (!injectionEl) {
  throw new Error('LTA: Could not find target container!')
}
const container = document.createElement('div')
injectionEl.appendChild(container)
render(<App />, container)
