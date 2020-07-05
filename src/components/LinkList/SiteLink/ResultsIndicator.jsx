import { h } from 'preact'
import useResultFetcher from 'imdb-link-em-all/hooks/useResultFetcher'

import { FETCH_STATE } from 'imdb-link-em-all/constants'
import {
  ErrorIcon,
  LockIcon,
  SpinnerIcon,
  TickIcon,
  TimeoutIcon,
  XIcon,
} from 'imdb-link-em-all/components/icons'
import css from 'imdb-link-em-all/components/LinkList/SiteLink/SiteLink.sss'

const ResultsIndicator = ({ imdbInfo, site }) => {
  const fetchState = useResultFetcher(imdbInfo, site)

  let IconComp
  let title

  switch (fetchState) {
    case FETCH_STATE.LOADING:
      IconComp = SpinnerIcon
      title = 'Loading…'
      break
    case FETCH_STATE.NO_RESULTS:
      IconComp = XIcon
      title = 'No Results found!'
      break
    case FETCH_STATE.RESULTS_FOUND:
      IconComp = TickIcon
      title = 'Results found!'
      break
    case FETCH_STATE.NO_ACCESS:
      IconComp = LockIcon
      title = 'You have to login to this site!'
      break
    case FETCH_STATE.TIMEOUT:
      IconComp = TimeoutIcon
      title = 'You have to login to this site!'
      break
    case FETCH_STATE.ERROR:
      IconComp = ErrorIcon
      title = 'Error fetching results! (See dev console for details)'
      break
    default:
      return null
  }

  return (
    <span title={title}>
      <IconComp className={css.resultsIcon} />
    </span>
  )
}

export default ResultsIndicator
