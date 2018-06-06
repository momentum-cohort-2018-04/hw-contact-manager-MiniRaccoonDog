import React, { Component } from 'react'
import request from 'superagent'
import uuid from 'uuid-v4'
import moment from 'moment'

class Contact extends Component {
  constructor () {
    super()
  }

  editContact (searchid) {
    const entry = this.props.array.filter(contact => contact.id === searchid)[0]
    console.log(entry)
    const user = this.props.user
    const password = this.props.password

    // const id = this.props.id
    // const phonesub = this.state.phone.match(/([0-9])/g).join('')
    // return (
    //   request
    //     .post(`http://localhost:8000/contacts/`)
    //     .auth(user, password)
    //     .send({ id: uuid(),
    //       first: this.state.first,
    //       last: this.state.last,
    //       email: this.state.email,
    //       dob: moment(this.state.dob),
    //       phone: phonesub,
    //       company: this.state.company,
    //       title: this.state.title
    //     })
    //     .then((callback) => {
    //       console.log(callback)
    //     })
    // )
  }

  render () {
    const editContact = this.props.editFxn
    const deleteContact = this.props.deleteFxn
    const contactArray = this.props.array.map((entry, index) => {
      let name = entry.first + ' ' + entry.last
      let fullname = convertCase(name)
      let phoneNumber = formatPhone(entry.phone)
      let birthdate = moment(entry.dob).format('MMM Do, YYYY')
      return (
        <tr className='contact' key={entry.id}>
          <td className='contact-name' id={entry.id}>{fullname}</td>
          <td className='contact-company'><b>{entry.company}</b></td>
          <td className='contact-title'><i>{entry.title}</i></td>
          <td className='contact-email'> {entry.email}</td>
          <td className='contact-phone'>{phoneNumber}</td>
          <td className='contact-DOB'>Birthday: {birthdate}</td>
          <td>
            <div className='input-group contact-buttons'>
              <button type='button' className='button-info' onClick={(event) => this.editContact(entry.id)}>Edit</button>
              <button type='button' className='button-danger' onClick={() => deleteContact(entry.id)}>Delete</button>
            </div>
          </td>
        </tr>
      )
    })
    return contactArray
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
