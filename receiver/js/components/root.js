var React = require('react');
var Player = require('../player');
var PlayerView = require('./player');
var ProgressBar = require('./progress-bar');
var Clock = require('./clock');

function getState() {
  return {
    album: Player.getAlbum(),
    currentTrack: Player.getCurrentTrack()
  };
}

var Root = React.createClass({
  getInitialState: function(){
    return getState();
  },

  componentDidMount: function(){
    Player.addChangeListener(this._onChange);
  },

  componentWillUnmount: function(){
    Player.removeChangeListener(this._onChange);
  },

  render: function(){
    return (
      <div>
        <PlayerView
          album={this.state.album}
          currentTrack={this.state.currentTrack}
        />
        <ProgressBar />
        <Clock />
      </div>
    )
  },

  _onChange: function(){
    this.setState(getState());
  }
});

module.exports = Root;
