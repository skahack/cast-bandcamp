import React from 'react'
import { connect } from 'react-redux'
import { sprintf } from 'sprintf-js'

const ProgressBar = ({ position, duration, currentTime }) => {
  const barStyle = {
    width: "" + position + "%"
  }

  return (
    <div>
      <div className="bar"></div>
      <div className="bar is-active" style={barStyle}></div>
      <div className="time is-left">
        <span>{currentTime}</span>
      </div>
      <div className="time is-right">
        <span>{duration}</span>
      </div>
    </div>
  )
}

const position = (player) => {
  return (player.currentTime / player.duration) * 100
}
const duration = (player) => {
  const m = Math.floor(player.duration / 60)
  const s = Math.floor(player.duration % 60)
  return sprintf('%02d:%02d', m, s)
}
const currentTime = (player) => {
  const m = Math.floor(player.currentTime / 60)
  const s = Math.floor(player.currentTime % 60)
  return sprintf('%02d:%02d', m, s)
}
const select = ({ player }) => {
  return {
    position: position(player),
    duration: duration(player),
    currentTime: currentTime(player),
  }
}
export default connect(select)(ProgressBar)
