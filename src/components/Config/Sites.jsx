import { h, Fragment } from 'preact'
import { useState } from 'preact/hooks'

import { CATEGORIES } from 'imdb-link-em-all/constants'
import Icon from 'imdb-link-em-all/components/Icon'
import SiteIcon from 'imdb-link-em-all/components/SiteIcon'
import css from 'imdb-link-em-all/components/Config/Sites.sss'

const SearchInput = ({ q, setQ }) => (
  <div className={css.searchInput}>
    <span>🔍</span>
    <input
      onInput={(e) => {
        setQ(e.target.value.toLowerCase().trim())
      }}
      placeholder="Search"
      value={q}
    />
    <button
      style={{ display: q.length ? 'unset' : 'none' }}
      title="Clear"
      type="button"
      onClick={() => setQ('')}
    >
      <Icon type="x" />
    </button>
  </div>
)

const DummyIcon = ({ size }) => {
  const sizePx = `${size}px`
  const style = { display: 'inline-block', height: sizePx, width: sizePx }
  return <div className={css.siteIcon} style={style} />
}

const SiteLabel = ({ checked, setEnabled, site }) => {
  const input = (
    <input
      checked={checked}
      onInput={(e) =>
        setEnabled((prev) =>
          e.target.checked ? [...prev, site.id] : prev.filter((id) => id !== site.id)
        )
      }
      type="checkbox"
    />
  )
  const icon = site.icon ? (
    <SiteIcon className={css.siteIcon} site={site} title={site.title} />
  ) : (
    <DummyIcon size={16} />
  )
  const title = (
    <span className={css.title} title={site.title}>
      {site.title}
    </span>
  )

  const extraIcons = [
    site.noAccessMatcher ? (
      <Icon className={css.extraIcon} title="Access restricted" type="lock" />
    ) : null,
    site.noResultsMatcher ? (
      <Icon className={css.extraIcon} title="Site supports fetching of results" type="tick" />
    ) : null,
  ]

  return (
    <label className={checked ? css.checked : null}>
      {input}
      {icon} {title} {extraIcons}
    </label>
  )
}

const CategoryList = ({ enabled, name, setEnabled, sites }) => {
  const siteLabels = sites.map((site) => (
    <SiteLabel checked={enabled.includes(site.id)} setEnabled={setEnabled} site={site} />
  ))
  return (
    <div className={css.catList}>
      <h4>
        {name} <span>({sites.length})</span>
      </h4>
      {siteLabels}
    </div>
  )
}

const Sites = ({ enabledSites, setEnabledSites, sites }) => {
  const [q, setQ] = useState('')

  const catSites = Object.keys(CATEGORIES).map((cat) => {
    const s = sites.filter((site) => site.category === cat)
    if (q.length) {
      return s.filter((site) => site.title.toLowerCase().includes(q))
    }
    return s
  })

  const cats = Object.entries(CATEGORIES).map(([cat, catName], i) =>
    catSites[i].length ? (
      <CategoryList
        enabled={enabledSites}
        key={cat}
        name={catName}
        setEnabled={setEnabledSites}
        sites={catSites[i]}
      />
    ) : null
  )

  const total = catSites.reduce((acc, s) => acc + s.length, 0)

  return (
    <>
      <div className={css.searchBar}>
        <SearchInput q={q} setQ={setQ} />
        <div className={css.resultCount}>
          Showing <span>{total}</span> sites.
        </div>
      </div>
      <div className={css.siteList}>{cats}</div>
    </>
  )
}

export default Sites
