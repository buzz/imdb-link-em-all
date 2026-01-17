import { CATEGORIES, NAME_VERSION } from 'imdb-link-em-all/constants'

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

function logHeader(success) {
  let msg = `
╔═══════════════════════════════════════════════════════════════════════╗
║                    🎥 IMDb: ${NAME_VERSION.padEnd(26)}                ║
║                    ──────────────────────────────                     ║
`
  msg += success
    ? `║                        Successfully loaded! ✅                        ║
`
    : `║                         ❌ FATAL ERROR DETECTED                       ║
║           Something went wrong! The script cannot continue.           ║
`

  msg += `╚═══════════════════════════════════════════════════════════════════════╝
`
  return msg
}

function successLog(layout) {
  console.info(`${logHeader(true)}
📋 Active categories: ${Object.values(CATEGORIES).join(', ')}
⚙️ To customize: Find the userscript settings icon (cog)
🖥️ Layout detected: ${layout}
═════════════════════════════════════════════════════════════════════════
`)
}

function failureLog(error) {
  console.error(`${logHeader(false)}
💥 Error Details:
   ${error.message || error}

📄 Stack Trace:
${error.stack || 'N/A'}

🔍 Debug Info:
   • Browser: ${navigator.userAgent}
   • Userscript Manager: ${typeof GM.info !== 'undefined' ? `${GM.info.scriptHandler} ${GM.info.version}` : 'Unknown'}
   • IMDb Page: ${window.location.href}
   • Timestamp: ${new Date().toISOString()}

═════════════════════════════════════════════════════════════════════════
💡 Need Help? Please report this issue with the details above:

   🐛 GitHub Issues:
      https://github.com/buzz/imdb-link-em-all/issues/new

   💬 Greasy Fork Discussions:
      https://greasyfork.org/scripts/17154-imdb-link-em-all/feedback

   Include the FULL error message and stack trace!
═════════════════════════════════════════════════════════════════════════
`)
}

export { detectLayout, replaceFields, parseImdbInfo, successLog, failureLog }
