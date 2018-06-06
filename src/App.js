import React, { Component } from 'react'
import './App.css'
import Login from './Login'
import Contacts from './Contacts'
// import 'shoelace-css/dist/shoelace.css'

class App extends Component {
  constructor () {
    super()
    // window.localStorage.clear()
    this.state = {
      user: (window.localStorage.user ? window.localStorage.user : null),
      password: (window.localStorage.password ? window.localStorage.password : null)
    }
    this.storeLocal = this.storeLocal.bind(this)
    this.removeLocal = this.removeLocal.bind(this)
    this.setAuth = this.setAuth.bind(this)
  }

  storeLocal (keyName, keyValue) {
    window.localStorage.setItem(keyName, keyValue)
  }

  removeLocal (keyName) {
    window.localStorage.removeItem(keyName)
  }

  setAuth () {
    this.setState({
      user: window.localStorage.user,
      password: window.localStorage.password
    })
  }

  render () {
    if (!this.state.user && !this.state.password) {
      return (
        <div className='main'>
          <Login storeFxn={this.storeLocal} removeFxn={this.removeLocal} setAuthFxn={this.setAuth} />
        </div>

      )
    } else if (this.state.user && this.state.password) {
      return (
        <div className='main'>
          <Contacts user={this.state.user} password={this.state.password} />
        </div>
      )
    } else {
      return null
    }
  }
}

export default App
