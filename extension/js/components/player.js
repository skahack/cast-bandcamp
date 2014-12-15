var debug = require('debug')('bandcamp:components:player');
var React = require('react');
var PlayerAction = require('../actions/player');

var Player = React.createClass({
  // getInitialState: function(){
  //   return getState();
  // },

  componentDidMount: function(){},
  componentWillUnmount: function(){},

  render: function(){
    var title = 'Title';
    var url = '/';
    var currentTime = '00:00';
    var duration = '01:00';
    var progressStyle = {
      left: '0px',
      top: '-2px'
    };
    var divStyle = {
      position: 'absolute',
      top: '-11px',
      right: '-4px',
      cursor: 'pointer',
      background: '#fff'
    };
    var imgStyle = { width: '36px' };
    var progressBarStyle = { width: '0%' };

    return (
      <div>
        <div className="cast-bandcamp" style={divStyle}>
          <img style={imgStyle} />
        </div>
        <table>
        <tbody>
        <tr>
          <td className="play_cell" rowSpan="2">
            <a onClick={this.play}><div className="playbutton"></div></a>
          </td>
          <td className="track_cell" colSpan="3">
            <div className="track_info">
              <span className="title-section">
                <a className="title_link primaryText" href={url}>
                  <span className="title">{title}</span>
                </a>
              </span>
              <span className="time secondaryText">
                <span className="time_elapsed">{currentTime}</span>
                <span> / </span>
                <span className="time_total">{duration}</span>
              </span>
            </div>
          </td>
        </tr>
        <tr>
          <td className="progbar_cell">
            <div className="progbar">
              <div className="progbar_empty">
                <div className="progbar_fill" style={progressBarStyle}></div>
                <div className="thumb" id="yui-gen0" style={progressStyle}></div>
              </div>
            </div>
          </td>
          <td className="prev_cell">
            <a><div className="prevbutton"></div></a>
          </td>
          <td className="next_cell">
            <a><div className="nextbutton"></div></a>
          </td>
        </tr>
        </tbody>
        </table>
      </div>
    )
  },

  play: function(e){
    PlayerAction.play();
  }
});

module.exports = Player;
