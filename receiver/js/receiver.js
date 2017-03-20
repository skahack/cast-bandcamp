const debug = require('debug')('bandcamp::receiver')
import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import thunk from 'redux-thunk';
import { applyMiddleware, createStore } from 'redux'

import Album from './album'
import Player from './player'
import Root from './containers/root'
import reducer from './reducers'
import { initClock } from './actions'

const namespace = 'urn:x-cast:com.skahack.cast.bandcamp'

cast.receiver.logger.setLevelValue(cast.receiver.LoggerLevel.DEBUG);
var manager = cast.receiver.CastReceiverManager.getInstance();
var messageBus = manager.getCastMessageBus(namespace, cast.receiver.CastMessageBus.MessageType.JSON);

debug('Starting Receiver Manager');

manager.onReady = function(e) {
  debug('Received Ready event: ' + JSON.stringify(e.data));
  manager.setApplicationState("Application status is ready...");
};

manager.onSenderConnected = function(e) {
  debug('Received Sender Connected event: ' + e.data);
  debug(manager.getSender(e.data));
};

manager.onSenderDisconnected = function(e) {
  debug('Received Sender Disconnected event: ' + e.data);
  var reason = cast.receiver.system.DisconnectReason.REQUESTED_BY_SENDER;
  if (manager.getSenders().length === 0 && event.reason === reason) {
    window.close();
  }
};

manager.onSystemVolumeChanged = function(e) {
  debug('Received System Volume Changed event: ' + e.data.level + ' ' + e.data.muted);
};

manager.onVisibilityChanged = function(e) {
  debug('Visibility Changed event: ' + e.isVisible);
  if (e.isVisible) {
    var trackNum = Player.getCurrentTrackNum();
    var album = Player.getAlbum();
    if (!album.isEmpty()) {
      Player.play(trackNum, album.bandId(), album.id());
    }
  } else {
    Player.stop();
  }
};


messageBus.onMessage = function(e) {
  debug('Message [' + e.senderId + ']: ', e.data);

  var message = e.data;

  if (message.command === 'ALBUM') {
    Player.load(new Album(message.album));
  }
  else if (message.command === 'PLAY') {
    Player.play(message.track, message.bandId, message.albumId);
  }

  messageBus.send(e.senderId, message.command);
};

manager.start({statusText: "Application is starting"});

const _createStore = applyMiddleware(thunk)(createStore)
let store = _createStore(reducer)
store.dispatch(initClock())

render(
  <Provider store={store}>
    <Root />
  </Provider>,
  document.getElementById('root')
)
