import React, { Component } from 'react'
import { connect } from 'react-redux'

import Player from '../player'
import PlayerView from '../components/player'
import ProgressBar from '../components/progress-bar'
import Clock from '../containers/clock'

function getState() {
  return {
    album: Player.getAlbum(),
    currentTrack: Player.getCurrentTrack(),
  }
}

class Root extends Component {
  constructor(props) {
    super(props)
    this.state = getState()
  }

  componentDidMount() {
    Player.addChangeListener(this._onChange.bind(this))
  }

  componentWillUnmount() {
    Player.removeChangeListener(this._onChange.bind(this))
  }

  render() {
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
  }

  _onChange() {
    this.setState(getState())
  }
}

export default connect()(Root)
