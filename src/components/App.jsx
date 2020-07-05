import { h, Fragment } from 'preact'
import { useEffect, useState } from 'preact/hooks'

import Config from 'imdb-link-em-all/components/Config'
import Icon from 'imdb-link-em-all/components/Icon'
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
            <Icon type="cog" />
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
