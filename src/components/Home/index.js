import {Link, Redirect} from 'react-router-dom'
import Cookies from 'js-cookie'
import Header from '../Header'
import Footer from '../Footer'
import TopRatedBooks from '../TopRatedBooks'

import './index.css'

const Home = () => {
  const jwtToken = Cookies.get('jwt_token')
  if (jwtToken === undefined) {
    return <Redirect to="/login" />
  }
  return (
    <>
      <Header />
      <div className="home-container">
        <div className="home-content-container">
          <h1 className="home-heading">Find Your Next Favorite Books?</h1>
          <p className="paragraph">
            You are in the right place. Tell us what titles or genres you have
            enjoyed in the past, and we will give you surprisingly insightful
            recommendations.
          </p>
          <Link to="/shelf" className="link-items">
            <button className="findbooks-button" type="button">
              Find Books
            </button>
          </Link>
        </div>
        <div className="top-rated-books-container">
          <div className="books-shelves-container">
            <h1 className="top-rated-books-heading">Top Rated Books</h1>
            <Link to="/shelf" className="link-items">
              <button className="findbooks-button-desktop" type="button">
                Find Books
              </button>
            </Link>
          </div>
          <div className="slick-container">
            <TopRatedBooks />
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}

export default Home
