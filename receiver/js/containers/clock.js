import React, { Component } from 'react'
import { connect } from 'react-redux'
import Clock from '../components/clock'

const ClockContainer = ({ now }) => {
  return <Clock now={now} />
}

const select = (store) => {
  return {
    now: store.clock,
  }
}

export default connect(select)(ClockContainer)
