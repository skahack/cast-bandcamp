const debug = require('debug')('bandcamp::actions')
import moment from 'moment'
import {
  play as playAudio,
  loadFile as loadAudioFile
} from '../middleware/audio'

export const CLOCK_INIT = 'CLOCK_INIT'
export const CLOCK_UPDATE = 'CLOCK_UPDATE'
const tick = () => {
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

export const PLAYER_TIME_UPDATE = 'PLAYER_TIME_UPDATE'
export const PLAYER_METADATA_LOADED = 'PLAYER_METADATA_LOADED'
export const PLAYER_PLAY_TRACK = 'PLAYER_PLAY_TRACK'
export const PLAYER_TRACK_ENDED = 'PLAYER_TRACK_ENDED'
export const updatePlayerTime = ({ currentTime, duration }) => {
  return {
    type: PLAYER_TIME_UPDATE,
    currentTime,
    duration,
  }
}
export const loadedPlayerMetadata = () => {
  return (dispatch, getState) => {
    dispatch({ type: PLAYER_METADATA_LOADED })
  }
}
export const endTrack = () => {
  debug('endTrack')
  return (dispatch, getState) => {
    dispatch({ type: PLAYER_TRACK_ENDED })
    return dispatch(playNext(getState()))
  }
}

export const CAST_SENDER_DISCONNECTED = 'CAST_SENDER_DISCONNECTED'
export const CAST_VISIBILITY_CHANGED = 'CAST_VISIBILITY_CHANGED'
export const CAST_ALBUM_RECEIVED = 'CAST_ALBUM_RECEIVED'
export const CAST_PLAY_COMMAND_RECEIVED = 'CAST_PLAY_COMMAND_RECEIVED'
export const CAST_FILE_LOADING = 'CAST_FILE_LOADING'
export const CAST_ERROR = 'CAST_ERROR'

export const disconnectSender = () => {
  window.close()
  return { type: CAST_SENDER_DISCONNECTED }
}
export const changeVisibility = isVisible => {
  return {
    type: CAST_VISIBILITY_CHANGED,
    isVisible,
  }
}

export const sendAlbumData = album => {
  return {
    type: CAST_ALBUM_RECEIVED,
    album,
  }
}

const selectTrack = (state, trackNum, bandId, albumId) => {
  const album = selectAlbum(state, bandId, albumId)
  if (!album) return null

  const track = album.tracks[trackNum]
  if (!track) return null

  return track
}

const selectAlbum = (state, bandId, albumId) => {
  const band = state.bands[bandId]
  if (!band) return null

  const album = band.albums[albumId]
  if (!album) return null

  return album
}

const playNext = (state) => {
  debug('playNext', state.player)
  const { bandId, albumId, trackNum } = state.player
  const album = selectAlbum(state, bandId, albumId)
  let n = trackNum + 1
  if (n > Object.keys(album.tracks).length) {
    n = 1
  }
  return sendPlayCommand(n, bandId, albumId)
}

export const sendPlayCommand = (trackNum, bandId, albumId) => {
  return (dispatch, getState) => {
    debug('sendPlayCommand', trackNum, bandId, albumId)
    dispatch({
      type: CAST_PLAY_COMMAND_RECEIVED,
      trackNum,
      bandId,
      albumId,
    })
    const state = getState()
    const track = selectTrack(state, trackNum, bandId, albumId)
    if (!track || !track.file) {
      return dispatch(endTrack())
    }

    return loadAudioFile(track.file)
      .then(() => {
        playAudio()
      })
  }
}
