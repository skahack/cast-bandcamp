const debug = require('debug')('bandcamp::middleware::cast')
import {
  disconnectSender,
  changeVisibility,
  sendAlbumData,
  sendPlayCommand,
} from '../actions'


export const initCast = (store) => {
  const dispatch = store.dispatch

  const namespace = 'urn:x-cast:com.skahack.cast.bandcamp'

  // cast.receiver.logger.setLevelValue(cast.receiver.LoggerLevel.DEBUG)
  const manager = cast.receiver.CastReceiverManager.getInstance()
  const messageBus = manager.getCastMessageBus(
    namespace,
    cast.receiver.CastMessageBus.MessageType.JSON
  )

  debug('Starting Receiver Manager')

  manager.onReady = e => {
    debug(`Received Ready event: ${JSON.stringify(e.data)}`)
    manager.setApplicationState("Application status is ready...")
  }

  manager.onSenderConnected = e => {
    debug(`Received Sender Connected event: ${e.data}`)
    debug(manager.getSender(e.data))
  }

  manager.onSenderDisconnected = e => {
    debug(`Received Sender Disconnected event: ${e.data}`)
    const reason = cast.receiver.system.DisconnectReason.REQUESTED_BY_SENDER
    if (manager.getSenders().length === 0 && e.reason === reason) {
      dispatch(disconnectSender())
    }
  }

  manager.onSystemVolumeChanged = e => {
    debug(`Received System Volume Changed event: ${e.data.level} ${e.data.muted}'`)
  }

  manager.onVisibilityChanged = e => {
    debug(`Visibility Changed event: ${e.isVisible}`)
    dispatch(changeVisibility(e.isVisible))
  }

  messageBus.onMessage = e => {
    const message = e.data;
    debug(`Message [${e.senderId}]: ${message}`);

    if (message.command === 'ALBUM') {
      dispatch(sendAlbumData(message.album))
    }
    else if (message.command === 'PLAY') {
      dispatch(sendPlayCommand(message.track + 1, message.bandId, message.albumId))
    }

    messageBus.send(e.senderId, message.command)
  }

  manager.start({statusText: "Application is starting"})
}
