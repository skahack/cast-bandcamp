function injectScript(url) {
  var script = document.createElement('script');
  script.setAttribute('src', url);
  document
    .getElementsByTagName('head')
    .item(0)
    .appendChild(script);
}
function injectResourceURL() {
  var script = document.createElement('script');
  var code = 'var castBandcamp = "' + chrome.extension.getURL('') + '";';
  script.setAttribute('type', 'text/javascript');
  script.innerHTML = code;
  document
    .getElementsByTagName('head')
    .item(0)
    .appendChild(script);
}

injectResourceURL(url);
injectScript('https://www.gstatic.com/cv/js/sender/v1/cast_sender.js');
var url = chrome.extension.getURL('sender.js');
injectScript(url);
