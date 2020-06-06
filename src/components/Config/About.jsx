import { h, Fragment } from 'preact'

import { DESCRIPTION, HOMEPAGE, GREASYFORK_URL, NAME_VERSION } from 'imdb-link-em-all/constants'

const About = () => (
  <>
    <h3>{NAME_VERSION}</h3>
    <p>{DESCRIPTION}</p>
    <ul>
      <li>
        <a target="_blank" rel="noreferrer" href={HOMEPAGE}>
          GitHub
        </a>
      </li>
      <li>
        <a target="_blank" rel="noreferrer" href={GREASYFORK_URL}>
          Greasy Fork
        </a>
      </li>
      <li>
        <a href="https://github.com/buzz/imdb-link-em-all/blob/master/ADDING-SITES.md">
          Add new sites
        </a>
      </li>
    </ul>
  </>
)

export default About
