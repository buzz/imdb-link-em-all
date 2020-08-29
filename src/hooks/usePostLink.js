import { useEffect, useRef } from 'preact/hooks'

import replaceFields from 'imdb-link-em-all/util'

// As it is not possible to open links with POST request we need a trick
const usePostLink = (url, openBlank, imdbInfo) => {
  const formEl = useRef()
  const isPost = Array.isArray(url)
  const href = isPost ? url[0] : replaceFields(url, imdbInfo, false)
  const onClick = (event) => {
    if (isPost && formEl.current) {
      event.preventDefault()
      formEl.current.submit()
    }
  }

  useEffect(() => {
    if (isPost) {
      const [postUrl, fields] = url
      const form = document.createElement('form')
      form.action = postUrl
      form.method = 'POST'
      form.style.display = 'none'
      form.target = openBlank ? '_blank' : '_self'
      Object.keys(fields).forEach((key) => {
        const input = document.createElement('input')
        input.type = 'text'
        input.name = key
        input.value = replaceFields(fields[key], imdbInfo, false)
        form.appendChild(input)
      })
      document.body.appendChild(form)
      formEl.current = form
    }

    return () => {
      if (formEl.current) {
        formEl.current.remove()
      }
    }
  })

  return [href, onClick]
}

export default usePostLink
