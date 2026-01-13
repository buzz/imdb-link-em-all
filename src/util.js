function detectLayout(mUrl) {
  // Currently there are two IMDb layouts:
  // 1) "legacy": URL ends with '/reference'
  if (mUrl[2] === 'reference') {
    return ['legacy', 'h3[itemprop=name]', '.titlereference-section-overview > *:last-child']
  }
  // 2) "default": Default (responsive/dynamic)
  return ['default', 'title', 'main > * > section > div']
}

function parseImdbInfo([layout, titleSelector, containerSelector]) {
  // TODO: extract type (TV show, movie, ...)

  // Parse IMDb number and layout
  const mUrl = /^\/(?:[a-z]{2}\/)?title\/tt([0-9]{7,8})(?:\/([a-z]*))?/.exec(
    window.location.pathname
  )

  if (!mUrl) {
    throw new Error('LTA: Could not parse IMDb URL!')
  }

  const info = { id: mUrl[1], layout }

  info.title = document.querySelector(titleSelector).innerText.trim()
  const mTitle = /^(.+)\s+\((\d+)\)/.exec(info.title)
  if (mTitle) {
    info.title = mTitle[1].trim()
    info.year = parseInt(mTitle[2].trim(), 10)
  }

  return [info, containerSelector]
}

function replaceFields(str, { id, title, year }, encode = true) {
  return str
    .replace(new RegExp('{{IMDB_TITLE}}', 'g'), encode ? encodeURIComponent(title) : title)
    .replace(new RegExp('{{IMDB_ID}}', 'g'), id)
    .replace(new RegExp('{{IMDB_YEAR}}', 'g'), year)
}

export { detectLayout, replaceFields, parseImdbInfo }
