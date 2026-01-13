import { h, Fragment } from 'preact'
import { useEffect, useState } from 'preact/hooks'

import Config from 'imdb-link-em-all/components/Config'
import Icon from 'imdb-link-em-all/components/Icon'
import LinkList from 'imdb-link-em-all/components/LinkList'
import css from 'imdb-link-em-all/components/App.sss'
import useConfig from 'imdb-link-em-all/hooks/useConfig'
import { SITES } from 'imdb-link-em-all/constants'

const App = ({ imdbInfo }) => {
  const { config, setConfig } = useConfig()
  const [showConfig, setShowConfig] = useState(false)

  useEffect(() => {
    if (config && config.first_run) {
      setShowConfig(true)
      setConfig((prev) => ({ ...prev, first_run: false }))
    }
  }, [config])

  return (
    <>
      {imdbInfo.layout === 'legacy' ? <hr /> : null}
      <div className={css.configWrapper}>
        <button onClick={() => setShowConfig((cur) => !cur)} title="Configure" type="button">
          <Icon type="cog" />
        </button>
        <Config
          config={config}
          layout={imdbInfo.layout}
          setConfig={setConfig}
          setShow={setShowConfig}
          sites={SITES}
          show={showConfig}
        />
      </div>
      <LinkList config={config} imdbInfo={imdbInfo} sites={SITES} />
    </>
  )
}

export default App
