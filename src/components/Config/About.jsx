import { h } from 'preact'

import { DESCRIPTION, HOMEPAGE, GREASYFORK_URL, NAME_VERSION } from 'imdb-link-em-all/constants'
import css from 'imdb-link-em-all/components/Config/About.sss'

const About = () => (
  <div className={css.about}>
    <div className={css.top}>
      <h3>🎥 {NAME_VERSION}</h3>
      <p>{DESCRIPTION}</p>
    </div>
    <div className={css.content}>
      <h2>🔗 Links</h2>
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
      </ul>
      <h2>✨ Contributions</h2>
      <p>Add new sites or update existing entries.</p>
      <ul>
        <li>
          <a
            target="_blank"
            rel="noreferrer"
            href="https://github.com/buzz/imdb-link-em-all/issues/new"
          >
            Open a GitHub issue
          </a>{' '}
          or
        </li>
        <li>
          <a
            target="_blank"
            rel="noreferrer"
            href="https://greasyfork.org/en/scripts/17154-imdb-link-em-all/feedback"
          >
            Give feedback
          </a>{' '}
          on Greasy Fork.
        </li>
      </ul>
      <p>
        <em>Thanks to all the contributors!</em> 👍
      </p>
      <h2>⚖ License</h2>
      <p>
        This script is licensed under the terms of the{' '}
        <a
          target="_blank"
          rel="noreferrer"
          href="https://github.com/buzz/imdb-link-em-all/blob/master/LICENSE"
        >
          GPL-2.0 License
        </a>
        .
      </p>
    </div>
  </div>
)

export default About
