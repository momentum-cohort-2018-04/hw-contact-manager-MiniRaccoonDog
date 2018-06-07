import React, { Component } from 'react'
import request from 'superagent'
import moment from 'moment'
import PropTypes from 'prop-types'

class Contact extends Component {
  constructor () {
    super()
    this.state = {
      user: '',
      password: '',
      edit: false,
      index: '',
      name: '',
      company: '',
      title: '',
      email: '',
      phone: '',
      dob: ''
    }
    this.openEditor = this.openEditor.bind(this)
  }

  componentDidMount () {
    this.setState({
      user: window.localStorage.user,
      password: window.localStorage.password,
      index: this.props.index,
      name: this.state.name ? this.state.name : this.props.entry.first + ' ' + this.props.entry.last,
      company: this.state.company ? this.state.company : this.props.entry.company,
      title: this.state.title ? this.state.title : this.props.entry.title,
      email: this.state.email ? this.state.email : this.props.entry.email,
      phone: this.state.phone ? this.state.phone : this.props.entry.phone,
      dob: this.state.dob ? this.state.dob : this.props.entry.dob})
  }

  openEditor () {
    this.setState({edit: !this.state.edit})
  }

  editContact (searchid) {
    const user = this.state.user
    const index = this.state.index
    const password = this.state.password
    const phonesub = this.state.phone.match(/([0-9])/g).join('')
    const nameArray = this.state.name.split(' ')
    const birthday = moment(this.state.dob)
    const first = nameArray[0]
    const last = nameArray[1]

    const body = {
      'id': searchid,
      'first': first,
      'last': last,
      'email': this.state.email,
      'dob': birthday,
      'phone': phonesub,
      'company': this.state.company,
      'title': this.state.title
    }
    return (
      request
        .put(`http://localhost:8000/contacts/${searchid}`)
        .auth(user, password)
        .send(body)
        .then((callback) => {
          console.log(callback)
          const allcontacts = this.props.array
          allcontacts.splice(index, 1, body)
          this.props.setContactsFxn(allcontacts)
          this.openEditor()
        })
    )
  }

  handleChange (event) {
    this.setState({[event.target.name]: event.target.value})
  }

  render () {
    const entry = this.props.entry
    const name = entry.first + ' ' + entry.last
    const fullname = convertCase(name)
    const phoneNumber = formatPhone(entry.phone)
    const birthdate = moment(entry.dob).format('MMMM DD')
    if (!this.state.edit) {
      return (
        <div className='col-3 contact' key={entry.id}>
          <div className='contact-name' id={entry.id}>{fullname}</div>
          <div className='contact-company'>{entry.company}</div>
          <div className='contact-title'>{entry.title}</div>
          <div className='contact-email'> {entry.email}</div>
          <div className='contact-phone'>{phoneNumber}</div>
          <div className='contact-DOB'>Birthday: {birthdate}</div>
          <div className='input-group contact-group'>
            <button type='button' className='button-light button-xs contact-button' onClick={this.openEditor}>Edit</button>
            <button type='button' className='button-secondary button-xs contact-button' onClick={() => this.props.deleteFxn(entry.id)}>Delete</button>
          </div>
        </div>
      )
    } else if (this.state.edit) {
      return (
        <div className='col-3 contact' key={entry.id}>
          <div className='contact-name' id={entry.id}>
            <input type='text' name='name' value={this.state.name || fullname} onChange={(e) => this.handleChange(e)} />
          </div>
          <div className='contact-company'>
            <input type='text' name='company' value={this.state.company || entry.company} onChange={(e) => this.handleChange(e)} />
          </div>
          <div className='contact-title'>
            <input type='text' name='title' value={this.state.title || entry.title} onChange={(e) => this.handleChange(e)} />
          </div>
          <div className='contact-email'>
            <input type='text' name='email' value={this.state.email || entry.email} onChange={(e) => this.handleChange(e)} />
          </div>
          <div className='contact-phone'>
            <input type='text' name='phone' value={this.state.phone || phoneNumber} onChange={(e) => this.handleChange(e)} />
          </div>
          <div className='contact-DOB'>
            <h4>Birthday:</h4>
            <input type='text' name='dob' value={this.state.dob || birthdate} onChange={(e) => this.handleChange(e)} />
          </div>
          <div className='input-group contact-buttons'>
            <button type='button' className='button-light' onClick={() => this.editContact(entry.id)}>Submit</button>
            <button type='button' className='button-secondary' onClick={this.openEditor}>Cancel</button>
            <button type='button' className='button-secondary' onClick={() => this.props.deleteFxn(entry.id)}>Delete</button>
          </div>
        </div>
      )
    }
  }
}

function convertCase (string) {
  let stringArray = string.split(' ')
  for (var i of stringArray) {
    var lowercase = i.substr(1)
    var uppercase = i.charAt(0).toUpperCase()
    var newWord = uppercase + lowercase
    var indexnumb = stringArray.indexOf(i)
    stringArray.splice(indexnumb, 1, newWord)
  }
  return stringArray.join(' ')
}

function formatPhone (string) {
  const area = string.slice(0, 3)
  const head = string.slice(3, 6)
  const tail = string.slice(6)
  return `(${area}) ${head}-${tail}`
}

export default Contact

Contact.propTypes = {
  deleteFxn: PropTypes.func.isRequired,
  entry: PropTypes.object.isRequired
}
