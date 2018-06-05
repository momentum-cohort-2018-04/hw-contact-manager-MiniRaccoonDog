import React, { Component } from 'react'
import request from 'superagent'

class Contacts extends Component {
  constructor () {
    super()
    this.state = {
      contacts: []
    }
    this.convertCase = this.convertCase.bind(this)
  }
  getContacts () {
    const user = this.props.user
    const password = this.props.password
    return (
      request
        .get(`http://localhost:8000/contacts`)
        .auth(user, password)
        .then((response) => {
          console.log(response.body)
          this.setState({contacts: response.body})
        })
    )
  }

  componentDidMount () {
    this.getContacts()
  }

  convertCase (string) {
    console.log(string)
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

  render () {
    const contactArray = this.state.contacts.map(function (entry, index) {
      let name = entry.name.first + ' ' + entry.name.last
      console.log(name)
      // console.log(this)
      return (
        <tr className='contact' key={index}>
          <td className='contact-name' id={entry.id}>{name}</td>
          <td className='contact-company'><b>{entry.company}</b></td>
          <td className='contact-title'><i>{entry.title}</i></td>
          <td className='contact-email'>Email: {entry.email}</td>
          <td className='contact-phone'>Phone: {entry.phone}</td>
          <td className='contact-DOB'>Date of Birth: {entry.dob}</td>
        </tr>
      )
    })
    console.log(contactArray)
    return contactArray
  }
}

export default Contacts
