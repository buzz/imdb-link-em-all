import { h } from 'preact'

import cogDataUrl from 'famfamfam-silk/dist/png/cog.png'
import errorDataUrl from 'famfamfam-silk/dist/png/error.png'
import lockDataUrl from 'famfamfam-silk/dist/png/lock.png'
import tickDataUrl from 'famfamfam-silk/dist/png/tick.png'
import timeoutDataUrl from 'famfamfam-silk/dist/png/time_delete.png'
import xDataUrl from 'famfamfam-silk/dist/png/cross.png'
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
