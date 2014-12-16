var Analytics = {};

Analytics.sendEvent = function(category, action, label, value, options){
  ga('send', 'event', category, action, label, value, options);
};

module.exports = Analytics;
