import {FaGoogle, FaTwitter, FaInstagram, FaYoutube} from 'react-icons/fa'
import './index.css'

const Footer = () => (
  <>
    <div className="footer-container">
      <div className="react-icons-container">
        <FaGoogle className="react-icon" />
        <FaTwitter className="react-icon" />
        <FaInstagram className="react-icon" />
        <FaYoutube className="react-icon" />
      </div>
      <p className="contact-us-description">Contact Us</p>
    </div>
  </>
)

export default Footer
