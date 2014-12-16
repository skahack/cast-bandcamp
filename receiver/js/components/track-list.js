var React = require('react');
var sprintf = require("sprintf-js").sprintf;

var _separateNum = 6;

function getTrackDOMs(tracks, currentTrack) {
  var re = [];

  for (var i = 0; i < tracks.length; i++) {
    var col = Math.floor(i / _separateNum);
    var classNames = ['track'];
    if (i === (currentTrack.num() - 1)) {
      classNames.push('is-current');
    }
    if (!re[col]) {
      re[col] = [];
    }

    re[col].push(
      <li className={classNames.join(' ')}>
        <span className="track-num">{sprintf('%02d', i + 1)}.</span>
        <span className="track-name">{tracks[i].title()}</span>
      </li>
    );
  }

  return re;
}

function getSeparatedTrackDOMs(trackDOMs, currentTrack) {
  var re = [];

  for (var i = 0; i < trackDOMs.length; i++) {
    var classNames = ['tracks'];
    var currentRow = Math.floor((currentTrack.num() - 1) / _separateNum) + 1;
    if (currentRow % 2 === 0) {
      currentRow -= 1;
    }
    if (i < (currentRow - 1)) {
      classNames.push('is-hidden');
    }
    re.push(
      <ul className={classNames.join(' ')}>
        {trackDOMs[i]}
      </ul>
    );
  }

  return re;
}

var TrackList = React.createClass({
  render: function(){
    var tracks = this.props.album.tracks();
    var currentTrack = this.props.currentTrack;

    var trackDOMs = getTrackDOMs(tracks, currentTrack);
    var separatedTrackDOMs = getSeparatedTrackDOMs(trackDOMs, currentTrack);

    return (
      <div className="tracks-wrapper">
        {separatedTrackDOMs}
      </div>
    )
  }
});

module.exports = TrackList;
