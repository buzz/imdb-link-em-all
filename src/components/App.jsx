import { h, Fragment } from 'preact'
import { useEffect, useState } from 'preact/hooks'

import cogIcon from 'imdb-link-em-all/static/cog.png'
import Config from 'imdb-link-em-all/components/Config'
import LinkList from 'imdb-link-em-all/components/LinkList'
import css from 'imdb-link-em-all/components/App.sss'
import useConfig from 'imdb-link-em-all/hooks/useConfig'
import useSites from 'imdb-link-em-all/hooks/useSites'

const App = ({ imdbInfo }) => {
  const { config, setConfig } = useConfig()
  const sites = useSites()
  const [showConfig, setShowConfig] = useState(false)

  useEffect(() => {
    if (config && config.first_run) {
      setShowConfig(true)
      setConfig((prev) => ({ ...prev, first_run: false }))
    }
  }, [config])

  if (!config || !sites.length) {
    return null
  }

  return (
    <>
      <h2>
        Search{' '}
        <span className={css.configWrapper}>
          <button onClick={() => setShowConfig((cur) => !cur)} title="Configure" type="button">
            <img src={cogIcon} alt="Cog icon" />
          </button>
          <Config
            config={config}
            setConfig={setConfig}
            setShow={setShowConfig}
            sites={sites}
            show={showConfig}
          />
        </span>
      </h2>
      <LinkList config={config} imdbInfo={imdbInfo} sites={sites} />
    </>
  )
}

export default App
