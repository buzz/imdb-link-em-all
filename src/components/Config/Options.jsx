import { h } from 'preact'

import css from 'imdb-link-em-all/components/Config/Options.sss'

const OPTIONS = [
  ['show_category_captions', 'Show category captions'],
  ['open_blank', 'Open links in new tab'],
  ['fetch_results', 'Automatically fetch results'],
]

const Options = () => {
  const options = OPTIONS.map(([key, title]) => (
    <label key={key}>
      <input checked onInput={() => {}} type="checkbox" />
      <span>{title}</span>
      <br />
    </label>
  ))
  return <div className={css.options}>{options}</div>
}

export default Options
