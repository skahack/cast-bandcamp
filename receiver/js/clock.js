var moment = require('moment');
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');

var _now = moment();

var ClockStore = assign({}, EventEmitter.prototype, {
  emitChange: function(){
    this.emit('CHANGE');
  },

  addChangeListener: function(callback){
    this.on('CHANGE', callback);
  },

  removeChangeListener: function(callback){
    this.removeListener('CHANGE', callback);
  },

  getCurrentTime: function(){
    return _now;
  }
});

function loop() {
  _now = moment();
  ClockStore.emitChange();
  setTimeout(loop, 1000);
}

loop();

module.exports = ClockStore;
