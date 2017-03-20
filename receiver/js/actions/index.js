import moment from 'moment'

export const CLOCK_INIT = 'CLOCK_INIT'
export const CLOCK_UPDATE = 'CLOCK_UPDATE'
export const tick = () => {
  return {
    type: CLOCK_UPDATE,
    now: moment(),
  }
}
export const initClock = () => {
  const loop = dispatch => {
    dispatch(tick())
    setTimeout(() => loop(dispatch), 1000)
  }
  return dispatch => {
    dispatch({ type: CLOCK_INIT })
    loop(dispatch)
  }
}
