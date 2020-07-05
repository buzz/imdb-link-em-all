import { h } from 'preact'

import css from 'imdb-link-em-all/components/Config/Options.sss'

const Options = ({ options }) => {
  const optionLabels = options.map(([key, title, val, setter]) => (
    <label key={key}>
      <input checked={val} onInput={(ev) => setter(ev.target.checked)} type="checkbox" />
      <span>{title}</span>
      <br />
    </label>
  ))
  return <div className={css.options}>{optionLabels}</div>
}

export default Options
