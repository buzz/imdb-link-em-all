import { h } from 'preact'
import { useState } from 'preact/hooks'

import { HOMEPAGE, NAME_VERSION } from 'imdb-link-em-all/constants'
import Icon from 'imdb-link-em-all/components/Icon'
import Options from 'imdb-link-em-all/components/Config/Options'
import Sites from 'imdb-link-em-all/components/Config/Sites'
import About from 'imdb-link-em-all/components/Config/About'
import css from 'imdb-link-em-all/components/Config/Config.sss'

const OPTIONS = [
  ['show_category_captions', 'Show category captions'],
  ['open_blank', 'Open links in new tab'],
  ['fetch_results', 'Automatically fetch results'],
]

const Config = ({ config, setConfig, setShow, show, sites }) => {
  const [enabledSites, setEnabledSites] = useState(config.enabled_sites)
  const showCategoryCaptionsArr = useState(config.show_category_captions)
  const openBlankArr = useState(config.open_blank)
  const fetchResultsArr = useState(config.fetch_results)

  const [showCategoryCaptions, setShowCategoryCaptions] = showCategoryCaptionsArr
  const [openBlank, setOpenBlank] = openBlankArr
  const [fetchResults, setFetchResults] = fetchResultsArr

  const optStates = [showCategoryCaptionsArr, openBlankArr, fetchResultsArr]
  const options = OPTIONS.map((opt, i) => [...opt, ...optStates[i]])

  const [tab, setTab] = useState(0)
  const tabs = [
    {
      title: 'Sites',
      icon: 'world',
      comp: <Sites enabledSites={enabledSites} setEnabledSites={setEnabledSites} sites={sites} />,
    },
    { title: 'Options', icon: 'cog', comp: <Options options={options} /> },
    { title: 'About', icon: 'info', comp: <About /> },
  ]

  const onClickCancel = () => {
    setShow(false)
    // Restore state
    setEnabledSites(config.enabled_sites)
    setFetchResults(config.fetch_results)
    setOpenBlank(config.open_blank)
    setShowCategoryCaptions(config.show_category_captions)
  }

  const onClickSave = () => {
    setConfig({
      enabled_sites: enabledSites,
      fetch_results: fetchResults,
      open_blank: openBlank,
      show_category_captions: showCategoryCaptions,
    })
    setShow(false)
  }

  return (
    <div className={css.popover} style={{ display: show ? 'block' : 'none' }}>
      <div className={css.inner}>
        <div className={css.top}>
          {tabs.map(({ title, icon }, i) => (
            <button
              className={tab === i ? css.active : null}
              type="button"
              onClick={() => setTab(i)}
            >
              <Icon title={title} type={icon} /> {title}
            </button>
          ))}
          <div className={css.link}>
            <a target="_blank" rel="noreferrer" href={HOMEPAGE}>
              {NAME_VERSION}
            </a>
          </div>
        </div>
        <div className={css.body}>
          {tabs.map(({ comp }, i) => (
            <div style={{ display: tab === i ? 'block' : 'none' }}>{comp}</div>
          ))}
        </div>
        <div className={css.controls}>
          <div>
            <button className="btn primary small" onClick={onClickSave} type="button">
              OK
            </button>
            <button className="btn small" onClick={onClickCancel} type="button">
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Config
