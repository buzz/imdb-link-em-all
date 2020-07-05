import { config, description, version, homepage } from '../package.json'

export const DESCRIPTION = description
export const HOMEPAGE = homepage
export const NAME_VERSION = `Link 'em all! v${version}`
export const SITES_URL = config.sitesUrl
export const GM_CONFIG_KEY = 'config'
export const GREASYFORK_URL = 'https://greasyfork.org/scripts/17154-imdb-link-em-all'

export const DEFAULT_CONFIG = {
  enabled_sites: ['google', 'yt'],
  fetch_results: true,
  first_run: true,
  open_blank: true,
  show_category_captions: true,
}

export const CATEGORIES = {
  general: 'General',
  tracker: 'Torrent tracker',
  streaming: 'Streaming',
  filehoster: 'Filehosters',
  subtitles: 'Subtitles',
}

export const FETCH_STATE = {
  LOADING: 0,
  NO_RESULTS: 1,
  RESULTS_FOUND: 2,
  NO_ACCESS: 3,
  TIMEOUT: 4,
  ERROR: 5,
}
