var debug = require('debug')('bandcamp::receiver');
var React = require('react');
var Album = require('./album');
var Player = require('./player');
var Root = require('./components/root');

var namespace = 'urn:x-cast:com.skahack.cast.bandcamp';

cast.receiver.logger.setLevelValue(cast.receiver.LoggerLevel.DEBUG);
window.manager = cast.receiver.CastReceiverManager.getInstance();
debug('Starting Receiver Manager');

manager.onReady = function(e) {
  debug('Received Ready event: ' + JSON.stringify(e.data));
  window.manager.setApplicationState("Application status is ready...");
};

manager.onSenderConnected = function(e) {
  debug('Received Sender Connected event: ' + e.data);
  debug(window.manager.getSender(e.data));
};

manager.onSenderDisconnected = function(e) {
  debug('Received Sender Disconnected event: ' + e.data);
  var reason = cast.receiver.system.DisconnectReason.REQUESTED_BY_SENDER;
  if (window.manager.getSenders().length === 0 && event.reason === reason) {
    window.close();
  }
};

manager.onSystemVolumeChanged = function(e) {
  debug('Received System Volume Changed event: ' + e.data.level + ' ' + e.data.muted);
};

window.messageBus = window.manager.getCastMessageBus(namespace);

window.messageBus.onMessage = function(e) {
  debug('Message [' + e.senderId + ']: ' + e.data);

  var album = new Album(JSON.parse(e.data));
  Player.init(album);
  Player.play();

  window.messageBus.send(e.senderId, e.data);
};

manager.start({statusText: "Application is starting"});

React.render(<Root />, document.getElementById('root'));
