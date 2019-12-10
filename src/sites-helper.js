// helper function that identifies header redirect using refresh
export function detectRefreshRedirect($dom, resp) {
  if (resp.responseHeaders.indexOf('Refresh: 0; url=') > -1) {
    return false
  }
  return true
}
