const debug = require('debug')('bandcamp::receiver')
import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import thunk from 'redux-thunk';
import { applyMiddleware, createStore } from 'redux'

import Root from './containers/root'
import reducer from './reducers'
import { initClock } from './actions'
import { initAudio } from './middleware/audio'
import { initCast } from './middleware/cast'

localStorage.debug = 'bandcamp::*'

const _createStore = applyMiddleware(thunk)(createStore)
let store = _createStore(reducer)
store.dispatch(initClock())
initAudio(store)
initCast(store)

render(
  <Provider store={store}>
    <Root />
  </Provider>,
  document.getElementById('root')
)
