import { h } from 'preact'

import errorDataUrl from 'imdb-link-em-all/static/error.png'
import cogDataUrl from 'imdb-link-em-all/static/cog.png'
import lockDataUrl from 'imdb-link-em-all/static/lock.png'
import tickDataUrl from 'imdb-link-em-all/static/tick.png'
import timeoutDataUrl from 'imdb-link-em-all/static/timeout.png'
import xDataUrl from 'imdb-link-em-all/static/x.png'
import spinnerDataUrl from 'imdb-link-em-all/static/spinner.gif'

export const ErrorIcon = ({ className }) => (
  <img alt="Error icon" className={className} src={errorDataUrl} />
)
export const CogIcon = ({ className }) => (
  <img alt="Cog icon" className={className} src={cogDataUrl} />
)
export const LockIcon = ({ className }) => (
  <img alt="Lock icon" className={className} src={lockDataUrl} />
)
export const TickIcon = ({ className }) => (
  <img alt="Tick icon" className={className} src={tickDataUrl} />
)
export const TimeoutIcon = ({ className }) => (
  <img alt="Timeout icon" className={className} src={timeoutDataUrl} />
)
export const XIcon = ({ className }) => <img alt="X icon" className={className} src={xDataUrl} />
export const SpinnerIcon = ({ className }) => (
  <img alt="Loading indicator" className={className} src={spinnerDataUrl} />
)
