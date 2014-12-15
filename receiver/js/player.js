var debug = require('debug')('bandcamp::player');
var sprintf = require("sprintf-js").sprintf;
var Track = require('./track');
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');

var music;
var _mediaManager;
var _album = {};
var _trackNum = 0;
var _duration = 0.0;
var _currentTime = 0.0;
var _loop = true;

function timeupdate() {
  _currentTime = music.currentTime || 0;
  _duration = music.duration || 0;
  Player.emitUpdateTime();
}

function onFinish() {
  debug('onFinish');
  Player.play();
}

var Player = assign({}, EventEmitter.prototype, {
  init: function(){
    debug('init player');

    music = document.getElementById('music');
    music.addEventListener('timeupdate', timeupdate, false);

    _mediaManager = new cast.receiver.MediaManager(music);

    // workaround: Can't play next track when fire ended event.
    _mediaManager.customizedStatusCallback = (function(){
      var orig = _mediaManager.customizedStatusCallback.bind(_mediaManager);
      return function(status){
        if (status.playerState === 'IDLE' && status.idleReason === 'FINISHED') {
          onFinish();
        }
        return orig(status);
      };
    }());
  },

  load: function(album) {
    _album = album;
  },

  play: function(trackNum){
    if (trackNum !== undefined) {
      _trackNum = trackNum;
    }

    if (_loop && _album.tracks().length <= _trackNum) {
      _trackNum = 0;
    }

    // TODO: check existing a mp3
    // https://riotskarecords.bandcamp.com/album/the-good-old-days

    var track = _album.track(_trackNum);
    debug('play music: Track No.', _trackNum);

    music.src = track.file();
    music.play();

    var mediaInfo = new cast.receiver.media.MediaInformation();
    mediaInfo.contentId = track.file();
    mediaInfo.metadata = {
      title: track.title(),
      num: track.num()
    };
    _mediaManager.setMediaInformation(mediaInfo);

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
