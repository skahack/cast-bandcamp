var React = require('react');
var ClockStore = require('../clock');

function getState() {
  return {
    now: ClockStore.getCurrentTime()
  };
}

var Clock = React.createClass({
  getInitialState: function(){
    return getState();
  },

  componentDidMount: function(){
    ClockStore.addChangeListener(this._onChange);
  },

  componentWillUnmount: function(){
    ClockStore.removeChangeListener(this._onChange);
  },

  render: function(){
    var now = this.state.now;
    return (
      <div className="clock">
        <span className="clock-dayname">{now.format('ddd')}</span>
        <span className="clock-hour">{now.format('HH')}</span>
        <span className="clock-colon">:</span>
        <span className="clock-min">{now.format('mm')}</span>
        <div className="clock-cal">
          <span className="clock-month">{now.format('MMMM')}</span>
          <span className="clock-day">{now.format('D')}</span>
        </div>
      </div>
    )
  },

  _onChange: function(){
    this.setState(getState());
  }
});

module.exports = Clock;
