import {Component} from 'react'
import Loader from 'react-loader-spinner'
import Slider from 'react-slick'
import Cookies from 'js-cookie'
import {Link} from 'react-router-dom'
import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

const settings = {
  dots: false,
  infinite: false,
  speed: 500,
  slidesToShow: 4,
  slidesToScroll: 2,
  responsive: [
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 2,
      },
    },
    {
      breakpoint: 600,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 2,
      },
    },
    {
      breakpoint: 480,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 2,
      },
    },
  ],
}

class TopRatedBooks extends Component {
  state = {
    apiStatus: apiStatusConstants.initial,
    books: [],
  }

  componentDidMount() {
    this.getTopRatedBooks()
  }

  getTopRatedBooks = async () => {
    this.setState({
      apiStatus: apiStatusConstants.inProgress,
    })

    const apiUrl = 'https://apis.ccbp.in/book-hub/top-rated-books'
    const jwtToken = Cookies.get('jwt_token')

    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }

    const response = await fetch(apiUrl, options)
    if (response.ok) {
      const fetchedData = await response.json()
      const updatedData = fetchedData.books.map(book => ({
        id: book.id,
        authorName: book.author_name,
        coverPic: book.cover_pic,
        title: book.title,
      }))
      this.setState({
        apiStatus: apiStatusConstants.success,
        books: updatedData,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  renderTopRatedBooksView = () => {
    const {books} = this.state

    return (
      <Slider {...settings}>
        {books.map(eachLogo => {
          const {id, coverPic, title, authorName} = eachLogo
          return (
            <div className="slick-item" key={id}>
              <Link to={`/books/${id}`} className="link-items" key={id}>
                <img className="logo-image" src={coverPic} alt={title} />
                <h1 className="top-rated-books-title">{title}</h1>
                <p className="top-rated-books-author">{authorName}</p>
              </Link>
            </div>
          )
        })}
      </Slider>
    )
  }

  renderLoadingView = () => (
    <div className="loader-container" testid="loader">
      <Loader type="TailSpin" color="#0284C7" height={50} width={50} />
    </div>
  )

  renderFailureView = () => (
    <div className="failure-view-container">
      <img
        className="failure-view-image"
        src="https://res.cloudinary.com/dvtvfpqeo/image/upload/v1731308762/Group_7522_m81vdn.png"
        alt="failure view"
      />
      <p className="failure-view-description">
        Something went wrong. Please try again
      </p>
      <button
        className="failure-button"
        type="button"
        onClick={this.getTopRatedBooks}
      >
        Try Again
      </button>
    </div>
  )

  render() {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderTopRatedBooksView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }
}

export default TopRatedBooks
