import React from 'react'
import { connect } from 'react-redux'

import PlayerView from '../components/player'
import ProgressBar from '../containers/progressBar'
import Clock from '../containers/clock'

const Root = ({ band, album, currentTrack }) => {
  return (
    <div>
      <PlayerView
        band={band}
        album={album}
        currentTrack={currentTrack}
      />
      <ProgressBar />
      <Clock />
    </div>
  )
}

const select = ({ player, bands }) => {
  const band = bands[player.bandId]
  const album = band ? band.albums[player.albumId] : null
  const currentTrack = album ? album.tracks[player.trackNum] : null
  return {
    band,
    album,
    currentTrack,
  }
}
export default connect(select)(Root)
