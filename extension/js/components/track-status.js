var React = require('react');
var PlayerAction = require('../actions/player');

var Status = React.createClass({

  componentDidMount: function(){},

  componentWillUnmount: function(){},

  render: function(){
    return (
      <a onClick={this.onClick}>
        <div className="play_status" />
      </a>
    )
  },

  onChange: function(){
  },

  onClick: function(){
    PlayerAction.play(this.props.trackNum);
  }
});

module.exports = Status;
