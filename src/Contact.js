import React, { Component } from 'react'
import request from 'superagent'
import moment from 'moment'

class Contact extends Component {
  render () {
    return this.props.array.map((entry) => {
      // let keyValue = entry.id
      return (<Entry deleteFxn={this.props.deleteFxn} entry={entry} key={entry.id} refreshFxn={this.props.refreshFxn} />)
    })
  }
}

class Entry extends Component {
  constructor () {
    super()
    this.state = {
      user: '',
      password: '',
      edit: false,
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
  componentDidUpdate () {
    console.log('entry updated!')
  }
  editContact (searchid) {
    // onClick={(event) => this.editContact(entry.id)}
    // const entry = this.props.array.filter(contact => contact.id === searchid)[0]
    console.log(searchid)
    const user = this.state.user
    const password = this.state.password
    const phonesub = this.state.phone.match(/([0-9])/g).join('')
    const nameArray = this.state.name.split(' ')
    const birthday = moment(this.state.dob)
    const first = nameArray[0]
    const last = nameArray[1]
    return (
      request
        .put(`http://localhost:8000/contacts/${searchid}`)
        .auth(user, password)
        .send(
          {
            'id': searchid,
            'first': first,
            'last': last,
            'email': this.state.email,
            'dob': birthday,
            'phone': phonesub,
            'company': this.state.company,
            'title': this.state.title
          })
        .then((callback) => {
          console.log(callback)
          this.props.refreshFxn()
          this.openEditor()
        })
    )
  }

  handleChange (event) {
    this.setState({[event.target.name]: event.target.value})
  }

  render () {
    const deleteContact = this.props.deleteFxn
    const entry = this.props.entry
    const name = entry.first + ' ' + entry.last
    const fullname = convertCase(name)
    const phoneNumber = formatPhone(entry.phone)
    const birthdate = moment(entry.dob).format('MMM Do, YYYY')
    const statePhone = formatPhone(this.state.phone)
    const stateDob = moment(this.state.dob).format('MMM Do, YYYY')

    if (!this.state.edit) {
      return (
        <tr className='contact' key={entry.id}>
          <td className='contact-name' id={entry.id}>{fullname}</td>
          <td className='contact-company'><b>{entry.company}</b></td>
          <td className='contact-title'><i>{entry.title}</i></td>
          <td className='contact-email'> {entry.email}</td>
          <td className='contact-phone'>{phoneNumber}</td>
          <td className='contact-DOB'>{birthdate}</td>
          <td>
            <div className='input-group contact-buttons'>
              <button type='button' className='button-info' onClick={this.openEditor}>Edit</button>
              <button type='button' className='button-danger' onClick={() => deleteContact(entry.id)}>Delete</button>
            </div>
          </td>
        </tr>
      )
    } else if (this.state.edit) {
      return (
        <tr className='contact' key={entry.id}>
          <td className='contact-name' id={entry.id}>
            <input type='text' name='name' value={this.state.name || fullname} onChange={(e) => this.handleChange(e)} />
          </td>
          <td className='contact-company'>
            <input type='text' name='company' value={this.state.company || entry.company} onChange={(e) => this.handleChange(e)} />
          </td>
          <td className='contact-title'>
            <input type='text' name='title' value={this.state.title || entry.title} onChange={(e) => this.handleChange(e)} />
          </td>
          <td className='contact-email'>
            <input type='text' name='email' value={this.state.email || entry.email} onChange={(e) => this.handleChange(e)} />
          </td>
          <td className='contact-phone'>
            <input type='text' name='phone' value={statePhone || phoneNumber} onChange={(e) => this.handleChange(e)} />
          </td>
          <td className='contact-DOB'>
            <input type='text' name='dob' value={stateDob || birthdate} onChange={(e) => this.handleChange(e)} />
          </td>
          <td>
            <div className='input-group contact-buttons'>
              <button type='button' className='button-success' onClick={() => this.editContact(entry.id)}>Submit</button>
              <button type='button' className='button-warning' onClick={this.openEditor}>Cancel</button>
              <button type='button' className='button-danger' onClick={() => deleteContact(entry.id)}>Delete</button>
            </div>
          </td>
        </tr>
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
