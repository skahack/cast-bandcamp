var debug = require('debug')('bandcamp::sender');
var applicationID = '52FE16A0';
var namespace = 'urn:x-cast:com.skahack.cast.bandcamp';
var session = null;

window.__onGCastApiAvailable = function(loaded, errorInfo) {
  if (loaded) {
    initializeCastApi();
  } else {
    debug(errorInfo);
  }
};

function initializeCastApi() {
  debug('initializeCastApi');
  var sessionRequest = new chrome.cast.SessionRequest(applicationID);
  var apiConfig = new chrome.cast.ApiConfig(sessionRequest,
      sessionListener,
      receiverListener);
  chrome.cast.initialize(apiConfig, onInitSuccess, onError);
}

function onInitSuccess() {
  debug('init success');

  var divStyle = "position: absolute;top: -11px;right: -4px;cursor: pointer;background: #fff;";

  $('.inline_player.desktop-view')
    .prepend('<div class="cast-bandcamp" style="'+divStyle+'"><img style="width: 36px;"/></div>');

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
  debug('New session ID: ' + e.sessionId);
  castIconOn();
  session = e;
  session.addUpdateListener(sessionUpdateListener);
}

function sessionUpdateListener(isAlive) {
  update();
  var message = isAlive ? 'Session Updated' : 'Session Removed';
  message += ': ' + session.sessionId;
  debug(message);
  if (!isAlive) {
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

function update() {
  sendMessage(getAlbumData());
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
      session = e;
    }, onError);
  }
  update();
}

function castIconOn() {
  var image = castBandcamp + 'cast_on.png';
  $('.cast-bandcamp img').attr('src', image);
}

function castIconOff() {
  var image = castBandcamp + 'cast_off.png';
  $('.cast-bandcamp img').attr('src', image);
}
