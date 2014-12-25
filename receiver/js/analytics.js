var Analytics = {};

Analytics.sendEvent = function(category, action, label, value, options){
  ga('send', 'event', category, action, label, value, options);
};

function ga() {
  if (process.env.NODE_ENV === 'development') {
    return;
  }
  window.ga.apply(window, arguments);
}

function init() {
  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
    (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
    m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

  ga('create', 'UA-57705884-1', 'auto');
  ga('send', 'pageview');
}

if (process.env.NODE_ENV === 'production') {
  init();
}

module.exports = Analytics;
