var React = require('react');
var sprintf = require("sprintf-js").sprintf;
var TrackList = require('./track-list');

var PlayerView = React.createClass({
  render: function(){
    var album = this.props.album;
    if (!album) {
      return (<div />);
    }

    return (
      <div className="player">
        <img src={album.artwork()} />

        <div className="album-wrapper">
          <div className="album-title">{album.title()}</div>
          <div className="artist">
            <span className="artist-by">by</span>
            <span className="artist-name">{album.artist()}</span>
          </div>
        </div>

        <TrackList
          album={this.props.album}
          currentTrack={this.props.currentTrack}
        />

        <div className="desc-wrapper">
          <div className="track-title">
            <div className="track-title-inner">{this.props.currentTrack.title()}</div>
          </div>
        </div>

        <div className="filter"></div>
      </div>
    )
  }
});

module.exports = PlayerView;
