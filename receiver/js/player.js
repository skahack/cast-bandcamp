var debug = require('debug')('bandcamp::player');
var sprintf = require("sprintf-js").sprintf;
var Track = require('./track');
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');

var music;
var _album = {};
var _trackNum = 0;
var _duration = 0.0;
var _currentTime = 0.0;
var _loop = true;

function ended() {
  debug('ended track');
  Player.play();
}

function timeupdate() {
  _currentTime = music.currentTime;
  _duration = music.duration;
  Player.emitUpdateTime();
}

var Player = assign({}, EventEmitter.prototype, {
  init: function(album){
    debug('init player');
    _album = album;
    _trackNum = 0;
    music = document.getElementById('music');
    music.removeEventListener('ended', ended, false);
    music.addEventListener('ended', ended, false);
    music.addEventListener('timeupdate', timeupdate, false);
  },

  play: function(){
    if (_loop && _album.tracks().length <= _trackNum) {
      _trackNum = 0;
    }

    debug('play music', _trackNum);
    music.setAttribute('src', _album.track(_trackNum).file());
    music.play();

    _trackNum += 1;
    this.emitChange();
  },

  emitChange: function(){
    this.emit('CHANGE');
  },

  emitUpdateTime: function(){
    this.emit('UPDATE_TIME');
  },

  addChangeListener: function(callback){
    this.on('CHANGE', callback);
  },

  removeChangeListener: function(callback){
    this.removeListener('CHANGE', callback);
  },

  addTimeListener: function(callback){
    this.on('UPDATE_TIME', callback);
  },

  removeTimeListener: function(callback){
    this.removeListener('UPDATE_TIME', callback);
  },

  getAlbum: function(){
    if (_album.title) {
      return _album;
    }
    return null;
  },

  getCurrentTrack: function(){
    if (_album.track) {
      return _album.track(_trackNum - 1);
    }
    return new Track();
  },

  getCurrentDuration: function(){
    var m = Math.floor(_duration / 60);
    var s = Math.floor(_duration % 60);
    return sprintf('%02d:%02d', m, s);
  },

  getCurrentTime: function(){
    var m = Math.floor(_currentTime / 60);
    var s = Math.floor(_currentTime % 60);
    return sprintf('%02d:%02d', m, s);
  },

  getCurrentPosition: function(){
    return (_currentTime / _duration) * 100;
  }
});

module.exports = Player;
