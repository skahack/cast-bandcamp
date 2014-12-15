var debug = require('debug')('bandcamp:actions:player');
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');
var Cast = require('../utils/cast');

var PlayerAction = assign({}, EventEmitter.prototype);

PlayerAction.play = function(trackNum){
  trackNum = trackNum || 0;
  Cast.play(trackNum);
};

PlayerAction.pause = function(){
  Cast.pause();
};

PlayerAction.updateCurrentTime = function(sec){
  this.emit('CURRENT_TIME_UPDATE', sec);
};

Cast.on('STATUS_UPDATE', function(media){
  PlayerAction.emit('STATUS_UPDATE', media);
});

Cast.on('PLAY', function(){
  PlayerAction.emit('PLAY');
});

Cast.on('PLAYER_PAUSED', function(){
  PlayerAction.emit('PLAYER_PAUSED');
});

module.exports = PlayerAction;
