import {Component} from 'react'
import Cookies from 'js-cookie'
import {Redirect, withRouter} from 'react-router-dom'

import './index.css'

class LoginForm extends Component {
  state = {
    username: '',
    password: '',
    showSubmitError: false,
    errorMsg: '',
  }

  onChangeUsername = event => {
    this.setState({username: event.target.value})
  }

  onChangePassword = event => {
    this.setState({password: event.target.value})
  }

  onSubmitSuccess = jwtToken => {
    const {history} = this.props // Access history from props

    Cookies.set('jwt_token', jwtToken, {
      expires: 30,
    })
    history.replace('/') // Redirect to home page on success
  }

  onSubmitFailure = errorMsg => {
    this.setState({showSubmitError: true, errorMsg})
  }

  submitForm = async event => {
    event.preventDefault()
    const {username, password} = this.state
    const userDetails = {username, password}
    const url = 'https://apis.ccbp.in/login'
    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    }
    const response = await fetch(url, options)
    const data = await response.json()

    if (response.ok === true) {
      this.onSubmitSuccess(data.jwt_token) // Call success handler with JWT token
    } else {
      this.onSubmitFailure(data.error_msg) // Handle failure with error message
    }
  }

  renderPasswordField = () => {
    const {password} = this.state

    return (
      <div className="input-container-login">
        <label className="input-label" htmlFor="password">
          PASSWORD
        </label>
        <input
          type="password"
          id="password"
          className="password-input-field"
          value={password}
          onChange={this.onChangePassword}
          placeholder="Password"
        />
      </div>
    )
  }

  renderUsernameField = () => {
    const {username} = this.state
    const jwtToken = Cookies.get('jwt_token')
    if (jwtToken !== undefined) {
      return <Redirect to="/" /> // Redirect to Home if already logged in
    }

    return (
      <div className="input-container-login">
        <label className="input-label" htmlFor="username">
          USERNAME
        </label>
        <input
          type="text"
          id="username"
          className="username-input-field"
          value={username}
          onChange={this.onChangeUsername}
          placeholder="Username"
        />
      </div>
    )
  }

  render() {
    const {showSubmitError, errorMsg} = this.state
    return (
      <div className="login-form-container">
        <div>
          <img
            src="https://res.cloudinary.com/dvtvfpqeo/image/upload/v1729752604/Ellipse_99_emduna.png"
            className="login-website-logo-mobile-img"
            alt="login website login"
          />
          <img
            src="https://res.cloudinary.com/dvtvfpqeo/image/upload/v1727331721/Rectangle_1467_y8meak.jpg"
            className="login-website-logo-desktop-img"
            alt="login website logo"
          />
        </div>
        <div>
          <form className="form-container" onSubmit={this.submitForm}>
            <img
              src="https://res.cloudinary.com/dvtvfpqeo/image/upload/v1732345479/Group_7731_1_vv9xjj.png"
              className="login-img"
              alt="website login"
            />
            <div className="input-containerr">{this.renderUsernameField()}</div>
            <div className="input-containerr">{this.renderPasswordField()}</div>
            <button type="submit" className="login-button">
              Login
            </button>
            {showSubmitError && <p className="error-message">*{errorMsg}</p>}
          </form>
        </div>
      </div>
    )
  }
}

export default withRouter(LoginForm)
