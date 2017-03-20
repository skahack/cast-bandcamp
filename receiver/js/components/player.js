import React, { Component } from 'react';
import TrackList from './track-list';

const PlayerView = ({ album, currentTrack }) => {
  if (album.isEmpty()) {
    return <div />
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
        album={album}
        currentTrack={currentTrack}
      />

      <div className="desc-wrapper">
        <div className="track-title">
          <div className="track-title-inner">{currentTrack.title()}</div>
        </div>
      </div>

      <div className="filter"></div>
    </div>
  )
}

export default PlayerView
