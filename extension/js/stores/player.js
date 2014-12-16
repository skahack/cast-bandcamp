var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');
var PlayerAction = require('../actions/player');

_playerState = '';
_trackNum = -1;
_title = '';
_duration = 0.0;
_currentTime = 0.0;

var PlayerStore = assign({}, EventEmitter.prototype);

PlayerStore.setMaxListeners(55);

PlayerStore.getPlayerState = function(){
  return _playerState;
};

PlayerStore.getTrackNum = function(){
  return _trackNum;
};

PlayerStore.getTitle = function(){
  return _title;
};

PlayerStore.getCurrentTime = function(){
  return _currentTime;
};

PlayerStore.getDuration = function(){
  return _duration;
};

PlayerAction.on('STATUS_UPDATE', function(media){
  if (!media || !media.media) {
    return;
  }
  _playerState = media.playerState;
  var trackNum = media.media.metadata.num - 1;
  if (_trackNum !== trackNum) {
    _trackNum = trackNum;
    _title = media.media.metadata.title;
    _duration = media.media.duration;
    _currentTime = media.currentTime;

    PlayerStore.emit('CHANGE', 'TRACK_CHANGE');
  }
});

PlayerAction.on('CURRENT_TIME_UPDATE', function(sec){
  _currentTime = sec;
  PlayerStore.emit('CHANGE', 'CURRENT_TIME_UPDATE');
});

PlayerAction.on('PLAYER_PAUSED', function(){
  _playerState = 'PAUSED';
  PlayerStore.emit('CHANGE', 'PAUSED');
});

PlayerAction.on('PLAY', function(){
  _playerState = 'PLAYING';
  PlayerStore.emit('CHANGE', 'PLAY');
});

module.exports = PlayerStore;
