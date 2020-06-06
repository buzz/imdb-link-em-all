export const replaceFields = (str, { id, title, year }, encode = true) => {
  return str
    .replace(new RegExp('{{IMDB_TITLE}}', 'g'), encode ? encodeURIComponent(title) : title)
    .replace(new RegExp('{{IMDB_ID}}', 'g'), id)
    .replace(new RegExp('{{IMDB_YEAR}}', 'g'), year)
}

export const generateUrl = (url, imdbInfo) => replaceFields(url, imdbInfo)
