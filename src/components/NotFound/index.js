import {Link} from 'react-router-dom'
import './index.css'

const NotFound = () => (
  <div className="pagenotfound-container">
    <img
      className="pagenotfound-image"
      src="https://res.cloudinary.com/dvtvfpqeo/image/upload/v1730615366/Group_7484_niz8py.png"
      alt="not found"
    />
    <h1 className="title">Page Not Found</h1>
    <p className="description">
      we are sorry, the page you requested could not be found. Please go back to
      the homepage.
    </p>
    <Link to="/">
      <button type="button" className="button">
        Go Back to Home
      </button>
    </Link>
  </div>
)

export default NotFound
