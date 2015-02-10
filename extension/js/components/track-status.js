var debug = require('debug')('bandcamp:components:track-status');
var React = require('react');
var PlayerAction = require('../actions/player');
var PlayerStore = require('../stores/player');

var Status = React.createClass({
  getInitialState: function(){
    return {
      playing: false
    };
  },

  componentDidMount: function(){
    PlayerStore.on('CHANGE', this.onChange);
  },

  componentWillUnmount: function(){
    PlayerStore.removeListener('CHANGE', this.onChange);
  },

  render: function(){
    var className = ['play_status'];
    if (this.props.disabled) {
      className.push('disabled');
    }
    if (this.state.playing) {
      className.push('playing');
    }
    return (
      <a onClick={this.onClick}>
        <div className={className.join(' ')} />
      </a>
    )
  },

  onChange: function(state){
    var trackNum = PlayerStore.getTrackNum();
    var playerState = PlayerStore.getPlayerState();

    if (this.props.trackNum === trackNum) {
      if (playerState === 'PLAYING') {
        this.setState({ playing: true });
      } else {
        this.setState({ playing: false });
      }
    }
    else if (this.props.trackNum !== trackNum && this.state.playing) {
      this.setState({ playing: false });
    }
  },

  onClick: function(){
    if (this.state.playing) {
      PlayerAction.pause();
    } else {
      PlayerAction.play(this.props.trackNum);
    }
  }
});

module.exports = Status;
