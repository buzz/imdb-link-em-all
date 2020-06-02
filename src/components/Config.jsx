import { h } from 'preact'

import css from './App.sss'

const Config = ({ show }) => {
  return (
    <div className={css.configDialog} style={{ display: show ? 'block' : 'none' }}>
      Foo
    </div>
  )
}

export default Config
