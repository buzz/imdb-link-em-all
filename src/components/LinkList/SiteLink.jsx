import { h, Fragment } from 'preact'

import { generateUrl } from 'imdb-link-em-all/util'
import SiteIcon from 'imdb-link-em-all/components/SiteIcon'
import css from 'imdb-link-em-all/components/LinkList/LinkList.sss'

const Sep = () => (
  <>
    &nbsp;
    <span className="ghost">|</span>
  </>
)

// TODO: post requests
// TODO: result fetcher

const SiteLink = ({ config, imdbInfo, last, site }) => {
  const extraAttrs = config.open_blank ? { target: '_blank', rel: 'noreferrer' } : {}
  return (
    <span className={css.linkWrapper}>
      <span className={css.link}>
        <a href={generateUrl(site.url, imdbInfo)} {...extraAttrs}>
          <SiteIcon site={site} />
          <span>{site.title}</span>
        </a>
      </span>
      {last ? null : <Sep />}
    </span>
  )
}

export default SiteLink
