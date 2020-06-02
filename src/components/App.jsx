import { h } from 'preact'
import { useState } from 'preact/hooks'

import cogIcon from 'imdb-link-em-all/static/cog.png'

import Config from './Config'
import css from './App.sss'

const App = () => {
  const [showConfig, setShowConfig] = useState(true)

  return (
    <div className="article">
      <h2>
        Search{' '}
        <span className={css.configWrapper}>
          <button
            className={css.configButton}
            onClick={() => setShowConfig((curShowConfig) => !curShowConfig)}
            title="Configure"
            type="button"
          >
            <img src={cogIcon} alt="Cog icon" />
          </button>
          <Config show={showConfig} />
        </span>
      </h2>
    </div>
  )
}

export default App
