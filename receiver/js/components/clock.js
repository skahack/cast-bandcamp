import React from 'react'

// @param {Moment} now
const Clock = ({ now }) => {
  return (
    <div className="clock">
      <span className="clock-dayname">{now.format('ddd')}</span>
      <span className="clock-hour">{now.format('HH')}</span>
      <span className="clock-colon">:</span>
      <span className="clock-min">{now.format('mm')}</span>
      <div className="clock-cal">
        <span className="clock-month">{now.format('MMMM')}</span>
        <span className="clock-day">{now.format('D')}</span>
      </div>
    </div>
  )
}

export default Clock
