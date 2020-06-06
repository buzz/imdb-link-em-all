import { h, Fragment } from 'preact'
import { useState } from 'preact/hooks'

import { CATEGORIES } from 'imdb-link-em-all/constants'
import SiteIcon from 'imdb-link-em-all/components/SiteIcon'
import css from 'imdb-link-em-all/components/Config/Sites.sss'

const SearchInput = ({ q, setQ }) => (
  <input
    className={css.searchInput}
    onInput={(e) => {
      console.log(e.target.value.toLowerCase().trim())
      setQ(e.target.value.toLowerCase().trim())
    }}
    placeholder="Search"
    value={q}
  />
)

const CategoryList = ({ enabled, name, setEnabled, sites }) => (
  <div className={css.catList}>
    <h4>
      {name} <span>({sites.length})</span>
    </h4>
    {sites.map((site) => {
      const checked = enabled.includes(site.id)
      return (
        <label className={checked ? css.checked : null} title={site.title}>
          <input
            checked={checked}
            onInput={(e) =>
              setEnabled((prev) =>
                e.target.checked ? [...prev, site.id] : prev.filter((id) => id !== site.id)
              )
            }
            type="checkbox"
          />
          <SiteIcon fill site={site} /> <span>{site.title}</span>
          <br />
        </label>
      )
    })}
  </div>
)

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
      <SearchInput q={q} setQ={setQ} />
      <div className={css.resultCount}>
        Showing <span>{total}</span> sites.
      </div>
      <div className={css.siteList}>{cats}</div>
    </>
  )
}

export default Sites
