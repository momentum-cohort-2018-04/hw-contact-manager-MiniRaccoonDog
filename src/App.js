import React, { Component } from 'react'
import './App.css'
import Login from './Login'
import Landing from './Landing'
import {
  BrowserRouter as Router,
  Route
} from 'react-router-dom'

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
    if (!window.localStorage.user || !window.localStorage.user) {
      return (
        <Login storeFxn={this.storeLocal} removeFxn={this.removeLocal} setAuthFxn={this.setAuth} />
      )
    } else {
      return (
        <Router>
          <div>
            <Route path='/' render={({history}) =>
              <div className='main'>
                <h1 className='title'>Contacts</h1>
                <Landing history={history} />
              </div>
            } />
          </div>
        </Router>)
    }
  }
}

export default App
