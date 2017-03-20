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

const bands = (state = {}, action) => {
  if (action.type != ActionTypes.CAST_ALBUM_RECEIVED) {
    return state
  }

  const { album } = action
  if (!album) {
    return state
  }

  const tracks = album.trackinfo.reduce((memo, v) => {
    const file = v.file ? v.file['mp3-128'] : null
    memo[v.track_num] = {
      id: v.id,
      title: v.title,
      trackNum: v.track_num,
      duration: v.duration,
      file: file,
      link: v.title_link,
      released: !v.unreleased_track,
    }
    return memo
  }, [])


  const prevAlbums = state[album.current.band_id] || {}
  const albums = Object.assign({}, prevAlbums, {
    [album.current.id]: {
      id: album.current.id,
      title: album.current.title,
      url: album.url,
      artworkUrl: `https://f4.bcbits.com/img/a${album.art_id}_10.jpg`,
      tracks: tracks,
    }
  })

  return Object.assign({}, state, {
    [album.current.band_id]: {
      name: album.artist,
      albums,
    }
  })
}

const initialPlayerState = {
  bandId: 0,
  albumId: 0,
  trackNum: 0,
  loop: true,
  duration: 0.0,
  currentTime: 0.0,
}
const player = (state = initialPlayerState, action) => {
  switch(action.type) {
    case ActionTypes.CAST_PLAY_COMMAND_RECEIVED:
      return Object.assign({}, state, {
        bandId: action.bandId,
        albumId: action.albumId,
        trackNum: action.trackNum,
      })
    case ActionTypes.PLAYER_TIME_UPDATE:
      return Object.assign({}, state, {
        duration: action.duration,
        currentTime: action.currentTime,
      })
  }
  return state
}

const rootReducer = combineReducers({
  bands,
  player,
  clock,
})
export default rootReducer
