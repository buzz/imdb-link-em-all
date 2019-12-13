import * as constants from './constants'

/* Variables */
let sites

// movie details
let imdbId
let imdbTitle
let imdbYear

let sortedKeys

// new or legacy layout
let layout

// script configuration
let config

// replace imdb fields
export function repl(str, encode = true) {
  return str
    .replace(new RegExp('{{imdbTitle}}', 'g'), encode ? encodeURIComponent(imdbTitle) : imdbTitle)
    .replace(new RegExp('{{imdbId}}', 'g'), imdbId)
    .replace(new RegExp('{{imdbYear}}', 'g'), imdbYear)
}

export function clickCog(evt) {
  evt.preventDefault()
  if ($('#lta_configure_tooltip').hasClass('hidden')) {
    showConfigure()
  } else {
    cancelConfigure()
  }
}

export function showConfigure() {
  // un/tick checkboxes
  let i
  for (i = 0; i < 3; i += 1) {
    const s = sites[i]
    for (let key in s) {
      if (Object.prototype.hasOwnProperty.call(s, key)) {
        $('#lta_configure_tooltip input[name=' + key + ']').prop(
          'checked',
          $.inArray(key, config.enabled_sites) >= 0
        )
      }
    }
  }
  $('#lta_configure_tooltip input[name=show_category_captions]').prop(
    'checked',
    config.show_category_captions
  )
  $('#lta_configure_tooltip input[name=open_blank]').prop('checked', config.open_blank)
  $('#lta_configure_tooltip input[name=fetch_results]').prop('checked', config.fetch_results)
  checkToggleAll()
  $('#lta_configure_tooltip').removeClass('hidden')
}

export function saveConfigure() {
  let i
  for (i = 0; i < 3; i++) {
    const s = sites[i]
    for (let key in s) {
      if (Object.prototype.hasOwnProperty.call(s, key)) {
        const value = $('#lta_configure_tooltip input[name=' + key + ']').prop('checked')
        const idx = config.enabled_sites.indexOf(key)
        if (value && idx < 0) {
          config.enabled_sites.push(key)
        }
        if (!value && idx >= 0) {
          config.enabled_sites.splice(idx, 1)
        }
      }
    }
  }
  config.show_category_captions = $(
    '#lta_configure_tooltip input[name=show_category_captions]'
  ).prop('checked')
  config.open_blank = $('#lta_configure_tooltip input[name=open_blank]').prop('checked')
  config.fetch_results = $('#lta_configure_tooltip input[name=fetch_results]').prop('checked')
  GM.setValue('config', JSON.stringify(config)).then(function() {
    updateExternalLinks()
    $('#lta_configure_tooltip').addClass('hidden')
  })
}

export function cancelConfigure() {
  $('#lta_configure_tooltip').addClass('hidden')
}

export function toggleAll(cat_idx) {
  const checked = $('#lta_config_toggle_all_' + cat_idx).prop('checked')
  let i
  for (i = 0; i < sortedKeys[cat_idx].length; i++) {
    $('#lta_config_' + sortedKeys[cat_idx][i]).prop('checked', checked)
  }
}

// monitor all category checkboxes and un/check the toggle all checkbox
export function checkToggleAll() {
  let i
  for (i = 0; i < 3; i++) {
    let all = true
    let j
    for (j = 0; j < sortedKeys[i].length; j++) {
      const key = sortedKeys[i][j]
      if (!$('#lta_config_' + key).prop('checked')) {
        all = false
        break
      }
    }
    $('#lta_config_toggle_all_' + i).prop('checked', all)
  }
}

// opens a link using POST
export function postLink(e) {
  e.preventDefault()
  e.stopPropagation()
  if (e.type === 'mouseup') {
    // get site key
    const k = $(e.currentTarget)
      .attr('class')
      .replace('lta-outlink-post', '')
      .replace('lta-outlink', '')
      .trim()
    let site
    let i
    // find key in sites
    for (i = 0; i < 3; i++) {
      const s = sites[i]
      if (typeof s[k] === 'object') {
        site = s[k]
        break
      }
    }
    const form = document.createElement('form')
    const data = site[2][1]
    form.action = site[2][0]
    form.method = 'POST'
    form.target = config.open_blank ? '_blank' : '_self'
    for (let key in data) {
      const input = document.createElement('input')
      input.type = 'text'
      input.name = key
      input.value = repl(data[key], false)
      form.appendChild(input)
    }
    form.style.display = 'none'
    document.body.appendChild(form)
    form.submit()
  }
}

// fetch site results
export function fetchResults(key, site) {
  const $indicator = $('#lta_external_site_links .lookup-status.' + key)
  $indicator.html('<img alt="Loading…" title="Loading…" src="' + constants.LOADING_ICON + '">')

  function noAccess() {
    $indicator
      .find('img')
      .attr('src', constants.NOACCESS_ICON)
      .attr('title', 'You have to login to this site!')
      .attr('alt', 'No access!')
  }
  function resultsFound() {
    $indicator
      .find('img')
      .attr('src', constants.TICK_ICON)
      .attr('title', 'Results found!')
      .attr('alt', 'Results found!')
  }
  function noResults() {
    $indicator
      .find('img')
      .attr('src', constants.CROSS_ICON)
      .attr('title', 'No results found! :(')
      .attr('alt', 'No results found!')
  }
  const opts = {
    timeout: 12000,
    onload: function(resp) {
      const check = site[3],
        logincheck = site[4]
      // check login state
      if (typeof logincheck === 'string') {
        if (resp.responseText.indexOf(logincheck) > -1) {
          noAccess()
          return
        }
      } else if ($.isFunction(logincheck)) {
        if (logincheck($(resp.responseText), resp)) {
          noAccess()
          return
        }
      }
      // check for results
      if (typeof check === 'string') {
        if (resp.responseText.indexOf(check) > -1) {
          noResults()
        } else {
          resultsFound()
        }
      } else if ($.isFunction(check)) {
        if (check($(resp.responseText), resp)) {
          resultsFound()
        } else {
          noResults()
        }
      } else {
        // this one has no results checker
        $indicator.find('img').remove()
      }
    },
    onerror: function(resp) {
      const status = resp.statusText
      $indicator
        .find('img')
        .attr('src', constants.ERROR_ICON)
        .attr('title', 'Error: ' + status)
        .attr('alt', 'Error')
    },
    ontimeout: function() {
      $indicator
        .find('img')
        .attr('src', constants.TIMEOUT_ICON)
        .attr('title', 'Error: Server is not responding!')
        .attr('alt', 'Error')
    },
  }
  // POST or GET
  if (Object.prototype.toString.call(site[2]) === '[object Array]') {
    opts.method = 'POST'
    opts.url = site[2][0]
    opts.headers = { 'Content-Type': 'application/x-www-form-urlencoded' }
    const data = site[2][1]
    const dataArray = []
    let dataKey
    for (dataKey in data) {
      dataArray.push(`${dataKey}=${encodeURIComponent(repl(data[dataKey]))}`)
    }
    opts.data = dataArray.join('&')
  } else {
    opts.method = 'GET'
    opts.url = repl(site[2])
  }
  GM.xmlHttpRequest(opts)
}

// add stylesheet link
export async function add_style(resourcename) {
  var h, s
  h = document.getElementsByTagName('head')[0]
  if (!h) {
    return
  }
  s = document.createElement('link')
  s.rel = 'stylesheet'
  s.href = await GM.getResourceUrl(resourcename)
  console.log(s.href)
  console.log(s)
  h.appendChild(s)
}

// initialize
export function init(newSites, newConfig, newSortedKeys, newImdbInfo) {
  sites = newSites
  config = newConfig
  sortedKeys = newSortedKeys
  imdbTitle = newImdbInfo.title
  imdbId = newImdbInfo.id
  imdbYear = newImdbInfo.year
  layout = newImdbInfo.layout

  // Add new link section
  const $container = $(
    layout === 'new' ? '.title-overview' : '.titlereference-section-overview:first > *:last'
  )
  if ($container.length === 0) {
    console.error("IMDb: Link'em all! Failed to find container!")
    return
  }
  add_style('style')
  // configure dialog
  let configure =
    '<span class="cogs_wrapper"><a href="#" title="Configure" id="lta_configure_links"><img src="' +
    constants.COGS_ICON +
    '" alt="Configure" class="ext_links_config" width="16" height="16"></a>' +
    '<span id="lta_configure_tooltip" class="hidden"><form><table><tr>' +
    '<td><h4 title="Toggle all"><input type="checkbox" name="toggle_all_0" value="1" id="lta_config_toggle_all_0"> <label for="lta_config_toggle_all_0">' +
    constants.CATEGORY_NAMES[0] +
    '</label></h4></td>' +
    '<td><h4 title="Toggle all"><input type="checkbox" name="toggle_all_1" value="1" id="lta_config_toggle_all_1"> <label for="lta_config_toggle_all_1">' +
    constants.CATEGORY_NAMES[1] +
    '</label></h4></td>' +
    '<td><h4 title="Toggle all"><input type="checkbox" name="toggle_all_2" value="1" id="lta_config_toggle_all_2"> <label for="lta_config_toggle_all_2">' +
    constants.CATEGORY_NAMES[2] +
    '</label></h4></td></tr><tr>'
  let i
  for (i = 0; i < 3; i++) {
    configure += '<td id="lta_cat_' + i + '">'
    const s = sites[i]
    let j
    for (j = 0; j < sortedKeys[i].length; j++) {
      const key = sortedKeys[i][j]
      const site = s[key]
      const title = site[0]
      const icon = site[1]
      let info_icons = ''
      if (site.length > 3) {
        info_icons +=
          ' <img alt="results" title="This site shows if results are available" src="' +
          constants.TICK_ICON +
          '" class="site-indicator">'
        if (site.length > 4) {
          info_icons +=
            '<img alt="private" title="This site is for members only" src="' +
            constants.NOACCESS_ICON +
            '" class="site-indicator">'
        }
      }
      configure +=
        '<input type="checkbox" name="' +
        key +
        '" value="1" id="lta_config_' +
        key +
        '"> <label for="lta_config_' +
        key +
        '">' +
        (icon
          ? '<img src="' + icon + '" alt="' + title + '" width="16" height="16"> '
          : '<span style="display: inline-block; width: 16px; height: 16px;"></span>') +
        title +
        info_icons +
        '</label><br>'
    }
    configure += '</td>'
  }
  configure +=
    '</tr><tr><td colspan="3"><h4>Options</h4>' +
    '<input type="checkbox" name="show_category_captions" value="1" id="lta_config_show_category_captions"> <label for="lta_config_show_category_captions">Show category captions</label><br>' +
    '<input type="checkbox" name="open_blank" value="1" id="lta_config_open_blank"> <label for="lta_config_open_blank">Open links in new tab</label><br>' +
    '<input type="checkbox" name="fetch_results" value="1" id="lta_config_fetch_results"> <label for="lta_config_fetch_results" title="This will try to fetch results from supported sites.">Automatically fetch results</label>' +
    '<div class="controls"><span class="rightcornerlink"><a target="_blank" href="' +
    constants.LTA_HOMEPAGE +
    '">Link \'em all! v' +
    GM.info.script.version +
    '</a></span>' +
    '<button id="lta_configure_links_done" class="btn primary small">OK</button> <button id="lta_configure_links_cancel" class="btn small">Cancel</button></div>' +
    '</td></tr></table></form></span></span>'

  let html
  if (layout === 'new') {
    html =
      '<div class="article"><h2>Search ' +
      configure +
      '</h2><div id="lta_external_site_links"></div></div>'
  } else {
    html = '<hr><h3>Search ' + configure + '</h3><div id="lta_external_site_links"></div><hr>'
  }
  $container.after(html)

  // Setup callbacks
  $('#lta_configure_tooltip form').submit((evt) => evt.preventDefault())
  $('#lta_configure_tooltip input[name=toggle_all_0]').click(() => toggleAll(0))
  $('#lta_configure_tooltip input[name=toggle_all_1]').click(() => toggleAll(1))
  $('#lta_configure_tooltip input[name=toggle_all_2]').click(() => toggleAll(2))
  $('#lta_configure_tooltip input:checkbox').change((event) => {
    // ignore toggle all checkbox
    const id = $(event.target).attr('id')
    if (id.indexOf('toggle_all') === -1) {
      checkToggleAll()
    }
  })
  $('#lta_configure_links').click(clickCog)
  $('#lta_configure_links_done').click(saveConfigure)
  $('#lta_configure_links_cancel').click(cancelConfigure)
  $('#lta_external_site_links').on('click mouseup', '.lta-outlink-post', postLink)
}

// render links
export function updateExternalLinks() {
  const links = [[], [], []]
  const resultFetcher = []
  let html = ''
  let i
  for (i = 0; i < 3; i += 1) {
    const s = sites[i]
    let j
    for (j = 0; j < sortedKeys[i].length; j += 1) {
      const key = sortedKeys[i][j]
      if (config.enabled_sites.indexOf(key) >= 0) {
        const site = s[key]
        const title = site[0]
        const icon = site[1]
        let cls = `lta-outlink ${key}`
        let href
        if (Object.prototype.toString.call(site[2]) === '[object Array]') {
          href = '#'
          cls += ' lta-outlink-post'
        } else {
          href = repl(site[2])
        }
        let resultsIndicator = ''
        if (config.fetch_results && site.length > 3) {
          resultsIndicator = '&nbsp;<span class="' + key + ' lookup-status"></span>'
          resultFetcher.push([key, site])
        }
        links[i].push(
          '<span class="link-wrapper"><span class="link"><a class="' +
            cls +
            '" href="' +
            href +
            '"' +
            (config.open_blank ? 'target="_blank"' : '') +
            '>' +
            (icon ? '<img src="' + icon + '" alt="' + title + '" width="16" height="16">' : '') +
            title +
            '</a>' +
            resultsIndicator +
            '</span>&nbsp;<span class="ghost">|</span></span>'
        )
      }
    }
    if (links[i].length > 0) {
      if (layout === 'new') {
        if (!config.show_category_captions && i > 0) {
          html += '<div style="height: 10px;"></div>'
        }
        if (config.show_category_captions) {
          html += '<h4>' + constants.CATEGORY_NAMES[i] + '</h4>'
        }
        html += '<div class="links">' + links[i].join(' ') + '</div>'
      } else {
        if (config.show_category_captions) {
          html +=
            '<div class="info"><h5>' +
            constants.CATEGORY_NAMES[i] +
            '</h5><div class="info-content">' +
            '<div class="links">' +
            links[i].join('&nbsp;| ') +
            '</div></div></div>'
        } else {
          html +=
            '<div class="info"><div class="links">' + links[i].join('&nbsp;| ') + '</div></div>'
        }
      }
    }
  }
  $('#lta_external_site_links').html(html)
  // result fetching
  for (i = 0; i < resultFetcher.length; i += 1) {
    fetchResults(resultFetcher[i][0], resultFetcher[i][1])
  }
}
