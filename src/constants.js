import { description, version, homepage } from '../package.json'
export { default as SITES } from '../sites.json'

export const DESCRIPTION = description
export const HOMEPAGE = homepage
export const NAME_VERSION = `Link 'em all! v${version}`
export const GM_CONFIG_KEY = 'config'
export const GREASYFORK_URL = 'https://greasyfork.org/scripts/17154-imdb-link-em-all'

export const DEFAULT_CONFIG = {
  enabled_sites: [],
  fetch_results: true,
  first_run: true,
  open_blank: true,
  show_category_captions: true,
}

export const CATEGORIES = {
  search: 'Search',
  movie_site: 'Movie sites',
  pub_tracker: 'Public trackers',
  priv_tracker: 'Private trackers',
  streaming: 'Streaming',
  filehoster: 'Filehosters',
  subtitles: 'Subtitles',
  tv: 'TV',
}

export const FETCH_STATE = {
  LOADING: 0,
  NO_RESULTS: 1,
  RESULTS_FOUND: 2,
  NO_ACCESS: 3,
  TIMEOUT: 4,
  ERROR: 5,
}
