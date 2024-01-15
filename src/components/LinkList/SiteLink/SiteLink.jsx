import { h, Fragment } from 'preact'

import SiteIcon from 'imdb-link-em-all/components/SiteIcon'
import ResultsIndicator from 'imdb-link-em-all/components/LinkList/SiteLink/ResultsIndicator'
import css from 'imdb-link-em-all/components/LinkList/SiteLink/SiteLink.sss'
import usePostLink from 'imdb-link-em-all/hooks/usePostLink'

const Sep = () => (
  <>
    &nbsp;
    <span className="ghost">|</span>
  </>
)

const SiteLink = ({ config, imdbInfo, last, site }) => {
  const extraAttrs = config.open_blank ? { target: '_blank', rel: 'noreferrer' } : {}
  const [href, onClick] = usePostLink(site.url, config.open_blank, imdbInfo)

  return (
    <span className={css.linkWrapper}>
      <a className="ipc-link ipc-link--base" href={href} onClick={onClick} {...extraAttrs}>
        <SiteIcon site={site} />
        <span>{site.title}</span>
      </a>
      {config.fetch_results ? <ResultsIndicator imdbInfo={imdbInfo} site={site} /> : null}
      {last ? null : <Sep />}
    </span>
  )
}

export default SiteLink
