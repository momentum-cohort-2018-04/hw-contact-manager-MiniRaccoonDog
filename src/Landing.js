import React, { Component } from 'react'
import request from 'superagent'
import uuid from 'uuid-v4'
import moment from 'moment'
import Contacts from './Contacts'
import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom'

class Landing extends Component {
  constructor () {
    super()
    this.state = {
      user: window.localStorage.user,
      password: window.localStorage.password,
      contacts: [],
      backup: [],
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
    this.addContact = this.addContact.bind(this)
    this.getALLContacts = this.getALLContacts.bind(this)
    this.setContacts = this.setContacts.bind(this)
  }

  componentDidMount () {
    this.getALLContacts()
  }

  handleChange (event) {
    this.setState({[event.target.name]: event.target.value})
  }

  getALLContacts () {
    return (
      request
        .get(`http://localhost:8000/contacts`)
        .auth(this.state.user, this.state.password)
        .then((response) => {
          console.log(response.body)
          this.setState({contacts: response.body})
          this.setState({backup: response.body})
        })
    )
  }

  /*
  getOneContact (id) {
    const user = this.props.user
    const password = this.props.password
    return (
      request
        .get(`http://localhost:8000/contacts/${id}`)
        .auth(user, password)
        .then((response) => {
          console.log(response.body)
          this.setState({contacts: response.body})
        })
    )
  } */
  setContacts (newarray) {
    this.setState({contacts: newarray})
  }

  addContact () {
    const phonesub = this.state.phone.match(/([0-9])/g).join('')
    return (
      request
        .post(`http://localhost:8000/contacts/`)
        .auth(this.state.user, this.state.password)
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
          console.log('add contact callback', callback)
        })
    )
  }

  deleteContact (id) {
    return (
      request
        .delete(`http://localhost:8000/contacts/${id}`)
        .auth(this.state.user, this.state.password)
        .then((response) => {
          console.log('Deleted', response)
          const oldArray = this.state.contacts
          const result = oldArray.filter(old => old.id !== id)
          this.setState({contacts: result})
        })
    )
  }
  searchContacts (event) {
    event.preventDefault()
    event.target.reset()
    const search = this.state.search
    const searchTerm = search.toLowerCase()
    const oldArray = this.state.backup
    const results = oldArray.filter(old => {
      let array = Object.values(old).map((value) => {
        if (typeof (value) === 'string') {
          return value.toLowerCase()
        } else { return value }
      })
      const pass = array.filter(val =>
        val.includes(searchTerm))
      if (pass.length > 0) { return true }
    })
    this.setState({contacts: results})
  }
  /*
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
        <form className='search w-50' onSubmit={(e) => this.searchContacts(e)}>
          <div className='input-group'>
            <input type='text' name='search' placeholder='Search Contacts' onChange={(e) => this.handleChange(e)} />
            <button type='submit' className='button'>Submit</button>
          </div>
        </form>
        <table className='table-striped table-hoverable'>
          <thead>
            <tr><th>Contact</th><th>Company</th><th>Title</th><th>Email</th><th>Phone Number</th><th>DOB</th></tr>
          </thead>
          <tbody>
            <Contacts array={this.state.contacts} deleteFxn={this.deleteContact} setContactsFxn={this.setContacts} />
          </tbody>
        </table>
      </React.Fragment>
    )
  } */

  render () {
    return (
      <Router>
        <div>
          <Route path='/add' render={() =>
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
                  <button type='button' className='button-danger' onClick={this.props.history.goBack}>Cancel</button>
                </div>
              </form>
            </fieldset>
          } />
          <Route exact path='/' render={() =>
            <React.Fragment>

              <Link to='/add'><button type='button' className='button'>Add Contact</button></Link>
              <form className='search w-50' onSubmit={(e) => this.searchContacts(e)}>
                <div className='input-group'>
                  <input type='text' name='search' placeholder='Search Contacts' onChange={(e) => this.handleChange(e)} />
                  <button type='submit' className='button'>Submit</button>

                </div>
                <button type='button' className='button' onClick={this.getALLContacts}>Refresh</button>
              </form>
              <table className='table-striped table-hoverable'>
                <thead>
                  <tr><th>Contact</th><th>Company</th><th>Title</th><th>Email</th><th>Phone Number</th><th>DOB</th></tr>
                </thead>
                <tbody>
                  <Contacts array={this.state.contacts} deleteFxn={this.deleteContact} setContactsFxn={this.setContacts} />
                </tbody>
              </table>
            </React.Fragment>
          } />
        </div>
      </Router>)
  }
}

export default Landing
