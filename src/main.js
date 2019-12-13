// Test cases for different layouts:
// http://www.imdb.com/title/tt0163978/
// http://www.imdb.com/title/tt1166810/
// http://www.imdb.com/title/tt4380968/
// http://www.imdb.com/title/tt3087990/

import { DEFAULT_CONFIG } from './constants'
import { init, updateExternalLinks, showConfigure } from './functions'
import sites from './sites'

const sortKeys = (s) => {
  const sortedKeys = []
  for (let i = 0; i < 3; i += 1) {
    sortedKeys.push(Object.keys(s[i]).sort((a, b) => s[i][a][0].localeCompare(s[i][b][0])))
  }
  return sortedKeys
}

const restoreConfiguration = async () => {
  return GM.getValue('config').then((configstring) => {
    if (typeof configstring !== 'undefined') {
      return [JSON.parse(configstring), false]
    }
    const config = DEFAULT_CONFIG
    // firstRun = true
    return GM.setValue('config', JSON.stringify(config)).then(() => [config, true])
  })
}

const parseInfo = () => {
  const imdbInfo = {}
  // parse imdb number/layout
  const pathNameMatch = /^\/title\/tt([0-9]{7})\/([a-z]*)/.exec(window.location.pathname)
  if (pathNameMatch) {
    const [, id, layoutArg] = pathNameMatch
    // detect layout
    let titleSelector
    if (['reference', 'combined'].includes(layoutArg)) {
      imdbInfo.layout = 'legacy'
      titleSelector = 'h3[itemprop=name]'
    } else {
      imdbInfo.layout = 'new'
      titleSelector = 'h1'
    }
    // extract movie infos
    imdbInfo.title = $(titleSelector)
      .text()
      .trim()
    imdbInfo.id = id
    const titleYearMatch = /^(.+)\s+\((\d+)\)/.exec(imdbInfo.title)
    if (titleYearMatch) {
      imdbInfo.title = titleYearMatch[1].trim()
      imdbInfo.year = titleYearMatch[2].trim()
    } else {
      imdbInfo.year = ''
    }
  }
  return imdbInfo
}

$(() => {
  const sortedKeys = sortKeys(sites)
  restoreConfiguration().then(([config, firstRun]) => {
    const imdbInfo = parseInfo()
    init(sites, config, sortedKeys, imdbInfo)
    updateExternalLinks()
    if (firstRun) {
      showConfigure()
    }
  })
})
