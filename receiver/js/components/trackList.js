import React from 'react'
import { sprintf } from 'sprintf-js'

var _separateNum = 6

const getTrackDOMs = (tracks, currentTrack) => {
  return tracks.reduce((memo, v, i) => {
    const col = Math.floor((i - 1) / _separateNum)
    let classNames = ['track']
    if (i === (currentTrack.trackNum)) {
      classNames.push('is-current');
    }
    if (!memo[col]) {
      memo[col] = []
    }

    memo[col].push(
      <li className={classNames.join(' ')} key={`trackListRow${i}`}>
        <span className="track-num">{sprintf('%02d', i)}.</span>
        <span className="track-name">{v.title}</span>
      </li>
    )

    return memo
  }, [])
}

const getSeparatedTrackDOMs = (trackDOMs, currentTrack) => {
  return trackDOMs.reduce((memo, v, i) => {
    let classNames = ['tracks'];
    let currentRow = Math.floor((currentTrack.trackNum) / _separateNum) + 1
    if (currentRow % 2 === 0) {
      currentRow -= 1
    }
    if (i < (currentRow - 1)) {
      classNames.push('is-hidden')
    }
    memo.push(
      <ul className={classNames.join(' ')} key={`trackList${i}`}>
        {trackDOMs[i]}
      </ul>
    )

    return memo
  }, [])
}

const TrackList = ({ album, currentTrack }) => {
  const tracks = album.tracks
  const trackDOMs = getTrackDOMs(tracks, currentTrack)
  const separatedTrackDOMs = getSeparatedTrackDOMs(trackDOMs, currentTrack)

  return (
    <div className="tracks-wrapper">
      {separatedTrackDOMs}
    </div>
  )
}

export default TrackList
