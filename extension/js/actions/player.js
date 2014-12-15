var debug = require('debug')('bandcamp:actions:player');
var EventEmitter = require('events').EventEmitter;
var Cast = require('../utils/cast');

var PlayerAction = EventEmitter.prototype;

PlayerAction.play = function(trackNum){
  trackNum = trackNum || 0;
  Cast.play(trackNum);
};

PlayerAction.initTrackStore = function(tracks){
  this.emit('INIT_TRACKS', tracks);
};

module.exports = PlayerAction;
