import { h } from 'preact'

const SiteIcon = ({ className, site, title }) =>
  site.icon ? <img alt={site.title} className={className} src={site.icon} title={title} /> : null

export default SiteIcon
