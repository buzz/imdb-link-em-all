function detectLayout(mUrl) {
  // Currently there are two IMDb layouts:
  // 1) "reference": URL ends with '/reference'
  if (mUrl[2] === 'reference') {
    return {
      name: 'reference',
      titleSelector: 'title',
      containerSelector: 'main > * > section > div',
    }
  }
  // 2) "default": Default (responsive/dynamic)
  return {
    name: 'default',
    titleSelector: 'title',
    containerSelector: 'main > * > section > div',
  }
}

function parseImdbInfo(id, { name, titleSelector, containerSelector }) {
  // TODO: extract type (TV show, movie, ...)
  const info = { id, layout: name }

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
