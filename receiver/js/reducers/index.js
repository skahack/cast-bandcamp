import { combineReducers } from 'redux'
import moment from 'moment';
import * as ActionTypes from '../actions'

const initialDate = moment('20170101')
const clock = (state = initialDate, action) => {
  if (action.type == ActionTypes.CLOCK_UPDATE) {
    return action.now
  }
  return state
}

const rootReducer = combineReducers({
  clock,
  dummy: (state = null, action) => state
})
export default rootReducer
