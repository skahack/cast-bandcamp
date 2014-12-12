var React = require('react');
var Player = require('../player');

function getState() {
  return {
    currentPosition: Player.getCurrentPosition(),
    currentDuration: Player.getCurrentDuration(),
    currentTime: Player.getCurrentTime()
  };
}

var ProgressBar = React.createClass({
  getInitialState: function(){
    return getState();
  },

  componentDidMount: function(){
    Player.addTimeListener(this._onChange);
  },

  componentWillUnmount: function(){
    Player.removeTimeListener(this._onChange);
  },

  render: function(){
    var barStyle = {
      width: "" + this.state.currentPosition + "%"
    };

    return (
      <div>
        <div className="bar"></div>
        <div className="bar is-active" style={barStyle}></div>
        <div className="time is-left">
          <span>{this.state.currentTime}</span>
        </div>
        <div className="time is-right">
          <span>{this.state.currentDuration}</span>
        </div>
      </div>
    )
  },

  _onChange: function(){
    this.setState(getState());
  }
});

module.exports = ProgressBar;
