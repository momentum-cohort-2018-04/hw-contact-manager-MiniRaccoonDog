import React, { Component } from 'react'
import request from 'superagent'
//  {id: 2, username: 'atorres', password: 'carpet-PANTHER-balloon-FROG'}
class Login extends Component {
  constructor () {
    super()
    this.state = {
      user: '',
      password: '',
      error: ''
    }
    this.handleChange = this.handleChange.bind(this)
    this.checkAuth = this.checkAuth.bind(this)
    this.badCredentials = this.badCredentials.bind(this)
    this.goodCredentials = this.goodCredentials.bind(this)
  }

  handleChange (event) {
    this.setState({[event.target.name]: event.target.value})
  }

  goodCredentials () {
    console.log('GOOD CREDS')
    const storeLocal = this.props.storeFxn
    storeLocal('user', this.state.user)
    storeLocal('password', this.state.password)
    this.props.setAuthFxn()
  }

  badCredentials () {
    console.log('baaad creds')
    this.setState({
      user: '',
      password: ''
    })
  }

  checkAuth (event) {
    event.preventDefault()
    event.target.reset()
    request
      .head(`http://localhost:8000/contacts`)
      .auth(this.state.user, this.state.password)
      .then((response) => {
        if (response.status === 200) {
          this.goodCredentials()
          console.log('LOGGED IN!')
        } else {}
      })
      .catch((error) => {
        if (error.status === 401) {
          this.badCredentials()
          this.setState({error: error.status})
          console.log('needs better response')
        }
      })
  }

  render () {
    if (this.state.error === '') {
      return (
        <div className='login full-center'>
          <form className='login_form' onSubmit={(e) => this.checkAuth(e)}>
            <fieldset>
              <legend>Login</legend>
              <div className='input-field'>
                <label>Name</label>
                <input type='text' name='user' onChange={(e) => this.handleChange(e)} />
              </div>

              <div className='input-field'>
                <label>Password</label>
                <input type='password' name='password' onChange={(e) => this.handleChange(e)} />
              </div>

              <div className='input-field'>
                {/* <label><input type='checkbox' /> Remember me</label> */}
              </div>
              <button className='login-button' type='submit' >Submit</button>
            </fieldset>
          </form>
        </div>
      )
    } else if (this.state.error === 401) {
      return (
        <div className='login center'>
          <form className='login_form' onSubmit={(e) => this.checkAuth(e)}>
            <fieldset>
              <legend>Login</legend>
              <div className='input-field'>
                <label>Name</label>
                <input type='text' name='user' onChange={(e) => this.handleChange(e)} />
              </div>

              <div className='input-field'>
                <label>Password</label>
                <input type='password' name='password' onChange={(e) => this.handleChange(e)} />
              </div>

              <div className='input-field'>
                <warning className='alert alert-danger'>Invalid Login Credentials</warning>
                {/* <label><input type='checkbox' /> Remember me</label> */}
              </div>

              <button className='login-button' type='submit' >Submit</button>
            </fieldset>
          </form>
        </div>
      )
    }
  }
}

export default Login
