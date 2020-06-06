import { h } from 'preact'

const SiteIcon = ({ site, fill = false }) => {
  if (site.icon) {
    return <img alt={site.title} src={site.icon} />
  }

  return fill ? <div style={{ display: 'inline-block', height: '16px', width: '16px' }} /> : null
}

export default SiteIcon
