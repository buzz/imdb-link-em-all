import { useEffect, useState } from 'preact/hooks'

import { GM_CONFIG_KEY, DEFAULT_CONFIG } from 'imdb-link-em-all/constants'

// Note: GM.* only work in async functions
const restoreConfig = async () => JSON.parse(await GM.getValue(GM_CONFIG_KEY))
const saveConfig = async (config) => GM.setValue(GM_CONFIG_KEY, JSON.stringify(config))

const useConfig = () => {
  const [config, setConfig] = useState()

  useEffect(() => {
    restoreConfig()
      .then((c) => setConfig(c))
      .catch(() => setConfig(DEFAULT_CONFIG))
  }, [])

  useEffect(() => {
    if (config) {
      saveConfig(config)
    }
  }, [config])

  return { config, setConfig }
}

export default useConfig
