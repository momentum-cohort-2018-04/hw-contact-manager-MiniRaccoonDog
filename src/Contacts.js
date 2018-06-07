import React, { Component } from 'react'
import Contact from './Contact'
import PropTypes from 'prop-types'

class Contacts extends Component {
  // Spread props somehow?
  render () {
    return this.props.array.map((entry, index) => {
      return (<Contact deleteFxn={this.props.deleteFxn} entry={entry} index={index} key={entry.id} array={this.props.array} setContactsFxn={this.props.setContactsFxn} />)
    })
  }
}

export default Contacts

Contacts.propTypes = {
  deleteFxn: PropTypes.func.isRequired,
  setContactsFxn: PropTypes.func.isRequired,
  array: PropTypes.array.isRequired,
  entry: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired
}
