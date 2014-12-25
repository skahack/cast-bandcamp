var debug = require('debug')('bandcamp:stores:cast');
var React = require('react');
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');
var applicationID = process.env.APP_ID;
var namespace = 'urn:x-cast:com.skahack.cast.bandcamp';
var session = null;
var mediaSession = null;

window.session = session;

var Cast = assign({}, EventEmitter.prototype);

Cast.init = function(){
  debug('initializeCastApi');
  var sessionRequest = new chrome.cast.SessionRequest(applicationID);
  var apiConfig = new chrome.cast.ApiConfig(sessionRequest,
      sessionListener,
      receiverListener);
  chrome.cast.initialize(apiConfig, onInitSuccess, onError);
};

Cast.play = function(trackNum){
  trackNum = trackNum || 0;
  play(trackNum);
};

Cast.pause = function(){
  pause();
};

function onInitSuccess() {
  debug('init success');

  if (session === null) {
    castIconOff();
  } else {
    castIconOn();
  }

  $('.cast-bandcamp').on('click', clickCastButton);
}

function onSuccess(message) {
  debug("onSuccess", message);
}

function onError(message) {
  debug("onError", message);
  castIconOff();
}

function onStopAppSuccess() {
  debug('onStopAppSuccess');
}

function sessionListener(e) {
  debug('New session: ', e);
  castIconOn();
  session = e;
  session.addUpdateListener(sessionUpdateListener);
  session.addMessageListener(namespace, onMessage);
  session.addMediaListener(onMediaDiscovered);


  if (session.media.length > 0) {
    Cast.emit('STATUS_UPDATE', session.media[0]);
  }
  else {
    sendAlbumData();
    Cast.play();
  }
}

function sessionUpdateListener(isAlive) {
  var message = isAlive ? 'Session Updated' : 'Session Removed';
  message += ': ' + session.sessionId;
  debug(message);
  if (!isAlive) {
    castIconOff();
    session = null;
  }
}

function receiverMessage(namespace, message) {
  debug("receiverMessage: "+namespace+", "+message);
}

function receiverListener(e) {
  if (e === 'available') {
    debug('receiver found');
  } else {
    debug('receiver list empty');
  }
}

function onMediaDiscovered(media) {
  debug('new media session:', media);
  mediaSession = media;
  mediaSession.addUpdateListener(onMediaStatusUpdate);
}

function onMediaStatusUpdate(isAlive) {
  debug('onMediaStatusUpdate', isAlive);
  if (session.media.length > 0) {
    Cast.emit('STATUS_UPDATE', session.media[0]);
  }
  if (!isAlive) {
    mediaSession = null;
  }
}

function stopApp() {
  session.stop(onStopAppSuccess, onError);
}

function sendMessage(message) {
  if (session !== null) {
    session.sendMessage(namespace, message, onSuccess.bind(this, "Message sent: " + message), onError);
  } else {
    chrome.cast.requestSession(function(e) {
      session = e;
      session.sendMessage(namespace, message, onSuccess.bind(this, "Message sent: " + message), onError);
    }, onError);
  }
}

function onMessage(namespace, message) {
  debug('onMessage: ', namespace, message);
}

function play(trackNum) {
  sendMessage({
    command: 'PLAY',
    track: trackNum,
  });
  Cast.emit('PLAY');
}

function pause() {
  if (session.media.length === 0) {
    return;
  }
  var request = new chrome.cast.media.PauseRequest();
  session.media[0].pause(request, onSuccess, onError);

  Cast.emit('PLAYER_PAUSED');
}

function sendAlbumData() {
  sendMessage({
    command: 'ALBUM',
    album: getAlbumData()
  });
}

function transcribe(words) {
  sendMessage(words);
}

function getAlbumData() {
  return TralbumData;
}

function clickCastButton(e) {
  if (session === null) {
    chrome.cast.requestSession(function(e){
      sessionListener(e);
    }, onError);
  }
}

function castIconOn() {
  var image = castBandcamp + 'cast_on.png';
  $('.cast-bandcamp').attr('src', image);

  $('.inline_player.desktop-view').hide();
  $('.inline_player.chromecast').show();

  $('.play-col').hide();
  $('.cast-play-col').show();
}

function castIconOff() {
  var image = castBandcamp + 'cast_off.png';
  $('.cast-bandcamp').attr('src', image);

  $('.inline_player.desktop-view').show();
  $('.inline_player.chromecast').hide();

  $('.play-col').show();
  $('.cast-play-col').hide();
}

module.exports = Cast;
