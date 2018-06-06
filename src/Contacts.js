import React, { Component } from 'react'
import request from 'superagent'
import uuid from 'uuid-v4'
import moment from 'moment'
import Contact from './Contact'

class Contacts extends Component {
  constructor () {
    super()
    this.state = {
      contacts: [],
      newcontact: false,
      search: '',
      id: '',
      first: '',
      last: '',
      company: '',
      title: '',
      email: '',
      dob: '',
      phone: ''
    }
    this.toggleContact = this.toggleContact.bind(this)
    this.addContact = this.addContact.bind(this)
    this.getALLContacts = this.getALLContacts.bind(this)
  }

  componentDidMount () {
    this.getALLContacts()
  }

  handleChange (event) {
    this.setState({[event.target.name]: event.target.value})
  }

  getALLContacts () {
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

  // getOneContact (id) {
  //   const user = this.props.user
  //   const password = this.props.password
  //   return (
  //     request
  //       .get(`http://localhost:8000/contacts/${id}`)
  //       .auth(user, password)
  //       .then((response) => {
  //         console.log(response.body)
  //         this.setState({contacts: response.body})
  //       })
  //   )
  // }

  toggleContact () {
    this.setState({newcontact: !this.state.newcontact})
  }

  addContact () {
    const user = this.props.user
    const password = this.props.password
    const phonesub = this.state.phone.match(/([0-9])/g).join('')
    return (
      request
        .post(`http://localhost:8000/contacts/`)
        .auth(user, password)
        .send({ id: uuid(),
          first: this.state.first,
          last: this.state.last,
          email: this.state.email,
          dob: moment(this.state.dob),
          phone: phonesub,
          company: this.state.company,
          title: this.state.title
        })
        .then((callback) => {
          console.log(callback)
        })
    )
  }


  deleteContact (id) {
    const user = this.props.user
    const password = this.props.password
    return (
      request
        .delete(`http://localhost:8000/contacts/${id}`)
        .auth(user, password)
        .then((response) => {
          console.log('Deleted', response)
          const oldArray = this.state.contacts
          const result = oldArray.filter(old => old.id !== id)
          this.setState({contacts: result})
        })
    )
  }
  searchButton (event) {
    event.preventDefault()
    event.target.reset()
    const search = this.state.search
    const searchTerm = search.toLowerCase()
    const oldArray = this.state.contacts
    const results = oldArray.filter(old => {
      let array = Object.values(old).map((value) => {
        if (typeof (value) === 'string') {
          return value.toLowerCase()
        }
      })
      const pass = array.filter(val =>
        val.includes(searchTerm))
      if (pass.length > 0) { return true }
    })
    this.setState({contacts: results})
  }

  render () {
    return (
      <React.Fragment>
        <button type='button' className='button' onClick={this.getALLContacts}>Refresh</button>
        {!this.state.newcontact && <button type='button' className='button-success' onClick={this.toggleContact}>Add Contact</button>}
        {this.state.newcontact &&

        <fieldset className='contact-form'>
          <legend >New Contact</legend>
          <form className='newContact' onSubmit={this.addContact}>
            <div className='input-group input-icon'>
              <i className='fa fa-fw fa-user' />
              <input type='text' name='first' placeholder='First Name' onChange={(e) => this.handleChange(e)} />
              <input type='text' name='last'placeholder='Last Name' onChange={(e) => this.handleChange(e)} />
            </div>
            <div className='med-margin'>
              <div className='input-icon'>
                <i className='fa fa-fw fa-building' />
                <input type='text' name='company' placeholder='Company' onChange={(e) => this.handleChange(e)} />
              </div>
              <div className='input-icon small-margin'>
                <input type='text' name='title' placeholder='Title' onChange={(e) => this.handleChange(e)} />
                <i className='fa fa-fw fa-id-card' />
              </div>
            </div>
            <div className='med-margin'>
              <div className='input-icon'>
                <input type='text' name='email' placeholder='Email Address' onChange={(e) => this.handleChange(e)} />
                <i className='fa fa-fw fa-envelope-o' />
              </div>
              <div className='input-icon small-margin'>
                <i className='fa fa-fw fa-phone' />
                <input type='text' name='phone' placeholder='Phone Number' onChange={(e) => this.handleChange(e)} />
              </div>
            </div>
            <div className='input-icon'>
              <i className='fa fa-fw fa-birthday-cake' />
              <input type='text' name='dob' placeholder='Date of Birth' onChange={(e) => this.handleChange(e)} />
            </div>
            <div className='input-group med-margin'>
              <button type='submit' className='button' >Submit</button>
              <button type='button' className='button-danger' onClick={this.toggleContact}>Cancel</button>
            </div>
          </form>
        </fieldset>
        }
        <form className='search w-50' onSubmit={(e) => this.searchButton(e)}>
          <div className='input-group'>
            <input type='text' name='search' placeholder='Search Contacts' onChange={(e) => this.handleChange(e)} />
            <button type='submit' className='button'>Submit</button>
          </div>
        </form>
        <table className='table-striped table-hoverable'>
          <thead>
            <tr><th>Contact</th><th>Company</th><th>Title</th><th>Email</th><th>Phone Number</th><th>DOB</th><th>Buttons</th></tr>
          </thead>
          <tbody>
            <Contact array={this.state.contacts} deleteFxn={this.deleteContact} />
          </tbody>
        </table>
      </React.Fragment>
    )
  }
}

// function convertCase (string) {
//   let stringArray = string.split(' ')
//   for (var i of stringArray) {
//     var lowercase = i.substr(1)
//     var uppercase = i.charAt(0).toUpperCase()
//     var newWord = uppercase + lowercase
//     var indexnumb = stringArray.indexOf(i)
//     stringArray.splice(indexnumb, 1, newWord)
//   }
//   return stringArray.join(' ')
// }

// function formatPhone (string) {
//   const area = string.slice(0, 3)
//   const head = string.slice(3, 6)
//   const tail = string.slice(6)
//   return `(${area}) ${head}-${tail}`
// }
export default Contacts
