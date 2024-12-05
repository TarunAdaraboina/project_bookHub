import {useState} from 'react'
import {Link, withRouter} from 'react-router-dom'
import {GiHamburgerMenu} from 'react-icons/gi'
import {AiOutlineClose} from 'react-icons/ai'
import Cookies from 'js-cookie'
import './index.css'

const Header = props => {
  const [isOpen, setIsOpen] = useState(false)
  const {history} = props

  const toggleMenu = () => {
    setIsOpen(!isOpen)
  }

  const onClickLogout = () => {
    // Remove the jwt_token from cookies
    Cookies.remove('jwt_token')
    // Redirect the user to the login page after logout
    history.replace('/login')
  }

  return (
    <nav className="navbar-container">
      <ul className="nav-content-container">
        <Link to="/">
          <img
            className="header-icon"
            src="https://res.cloudinary.com/dvtvfpqeo/image/upload/v1732345479/Group_7731_1_vv9xjj.png"
            alt="website logo"
          />
        </Link>

        <div className="navbar-description-container">
          <ul className="ul-container">
            <Link to="/" className="link-items">
              <li className="li-items">Home</li>
            </Link>
            <Link to="/shelf" className="link-items">
              <li className="li-items">Bookshelves</li>
            </Link>
          </ul>
          <button
            className="desktop-button"
            type="button"
            onClick={onClickLogout} // Logout functionality here
          >
            Logout
          </button>
        </div>
        <div className="menu-icon">
          {!isOpen ? (
            <GiHamburgerMenu className="hamburger-icon" onClick={toggleMenu} />
          ) : (
            <AiOutlineClose className="close-icon" onClick={toggleMenu} />
          )}
        </div>
      </ul>

      {isOpen && (
        <div className="menu-content">
          <ul className="menu-content-list">
            <Link to="/" className="link-items" onClick={toggleMenu}>
              <li className="li-items">Home</li>
            </Link>
            <Link to="/shelf" className="link-items" onClick={toggleMenu}>
              <li className="li-items">Bookshelves</li>
            </Link>
            <li className="list-items">
              <button
                className="logout-button-mobile"
                type="button"
                onClick={() => {
                  toggleMenu()
                  onClickLogout() // Logout on mobile menu click
                }}
              >
                Logout
              </button>
            </li>
            <AiOutlineClose
              className="close-icon-mobile"
              onClick={toggleMenu}
            />
          </ul>
        </div>
      )}
    </nav>
  )
}

export default withRouter(Header) // Ensure to wrap with withRouter for access to history
