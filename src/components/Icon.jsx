import { h } from 'preact'

import errorDataUrl from 'imdb-link-em-all/static/error.png'
import cogDataUrl from 'imdb-link-em-all/static/cog.png'
import lockDataUrl from 'imdb-link-em-all/static/lock.png'
import tickDataUrl from 'imdb-link-em-all/static/tick.png'
import timeoutDataUrl from 'imdb-link-em-all/static/timeout.png'
import xDataUrl from 'imdb-link-em-all/static/x.png'
import spinnerDataUrl from 'imdb-link-em-all/static/spinner.gif'

const iconSrcs = {
  error: errorDataUrl,
  cog: cogDataUrl,
  lock: lockDataUrl,
  tick: tickDataUrl,
  timeout: timeoutDataUrl,
  x: xDataUrl,
  spinner: spinnerDataUrl,
}

const Icon = ({ className, title, type }) => (
  <img alt={`${type} icon`} className={className} src={iconSrcs[type]} title={title} />
)

export default Icon
