import { h, Fragment } from 'preact'

import { CATEGORIES } from 'imdb-link-em-all/constants'
import SiteLink from 'imdb-link-em-all/components/LinkList/SiteLink'
import css from 'imdb-link-em-all/components/LinkList/LinkList.sss'

const LinkList = ({ config, imdbInfo, sites }) =>
  Object.entries(CATEGORIES).map(([category, categoryName]) => {
    const catSites = sites.filter(
      (site) => site.category === category && config.enabled_sites.includes(site.id)
    )

    if (!catSites.length) {
      return null
    }

    const caption = config.show_category_captions ? <h4>{categoryName}</h4> : null

    return (
      <>
        {caption}
        <div className={css.linkList}>
          {catSites.map((site, i) => (
            <SiteLink
              config={config}
              imdbInfo={imdbInfo}
              last={i === catSites.length - 1}
              site={site}
            />
          ))}
        </div>
      </>
    )
  })

export default LinkList
