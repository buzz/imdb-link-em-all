import { h } from 'preact'
import useResultFetcher from 'imdb-link-em-all/hooks/useResultFetcher'

import { FETCH_STATE } from 'imdb-link-em-all/constants'
import Icon from 'imdb-link-em-all/components/Icon'
import css from 'imdb-link-em-all/components/LinkList/SiteLink/SiteLink.sss'

const ResultsIndicator = ({ imdbInfo, site }) => {
  const fetchState = useResultFetcher(imdbInfo, site)

  let iconType
  let title

  switch (fetchState) {
    case FETCH_STATE.LOADING:
      iconType = 'spinner'
      title = 'Loading…'
      break
    case FETCH_STATE.NO_RESULTS:
      iconType = 'x'
      title = 'No Results found!'
      break
    case FETCH_STATE.RESULTS_FOUND:
      iconType = 'tick'
      title = 'Results found!'
      break
    case FETCH_STATE.NO_ACCESS:
      iconType = 'lock'
      title = 'You have to login to this site!'
      break
    case FETCH_STATE.TIMEOUT:
      iconType = 'timeout'
      title = 'You have to login to this site!'
      break
    case FETCH_STATE.ERROR:
      iconType = 'error'
      title = 'Error fetching results! (See dev console for details)'
      break
    default:
      return null
  }

  return <Icon className={css.resultsIcon} title={title} type={iconType} />
}

export default ResultsIndicator
