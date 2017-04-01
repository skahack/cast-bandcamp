const debug = require('debug')('bandcamp::middleware::audio')
import { updatePlayerTime, loadedPlayerMetadata, endTrack } from '../actions'

const audio = document.getElementById('music')

export const initAudio = (store) => {
  debug('init player')
  const dispatch = store.dispatch

  const onFinish = dispatch => dispatch(endTrack())
  const timeupdate = (dispatch, audio) => {
    dispatch(updatePlayerTime({
      currentTime: audio.currentTime || 0,
      duration: audio.duration || 0,
    }))
  }

  audio.addEventListener('timeupdate', timeupdate.bind(null, dispatch, audio), false)

  const mediaManager = new cast.receiver.MediaManager(audio)

  mediaManager.onEnded = () => onFinish(dispatch)

  // deprecated: Unused in latest cast API.
  // workaround: Can't play next track when fire ended event.
  mediaManager.customizedStatusCallback = (() => {
    const orig = mediaManager.customizedStatusCallback.bind(mediaManager)
    return status => {
      if (status.playerState === 'IDLE' && status.idleReason === 'FINISHED') {
        onFinish(dispatch)
      }
      return orig(status)
    }
  })();
}

export const play = () => {
  audio.play()
}

export const loadFile = file => {
  debug('loadFile', file)
  if (audio.src == file) {
    audio.play()
    return new Promise((resolve) => resolve())
  }
  return new Promise((resolve, reject) => {
    const id = window.setTimeout(() => {
      reject()
    }, 2 * 60 * 1000)
    const loadedmetadata = () => {
      debug('file loaded', file)
      audio.removeEventListener('loadedmetadata', loadedmetadata, false)
      window.clearTimeout(id)
      resolve()
    }
    audio.addEventListener('loadedmetadata', loadedmetadata, false)
    audio.src = file
    audio.load()
  })
}
