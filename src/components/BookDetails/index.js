import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {BsFillStarFill} from 'react-icons/bs'
import Header from '../Header'
import Footer from '../Footer'
import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class BookDetails extends Component {
  state = {
    apiStatus: apiStatusConstants.initial,
    bookData: {},
  }

  componentDidMount() {
    this.getBookData()
  }

  getFormattedData = data => ({
    authorName: data.book_details.author_name,
    coverPic: data.book_details.cover_pic,
    id: data.book_details.id,
    rating: data.book_details.rating,
    readStatus: data.book_details.read_status,
    aboutAuthor: data.book_details.about_author,
    aboutBook: data.book_details.about_book,
    title: data.book_details.title,
  })

  getBookData = async () => {
    const {match} = this.props
    const {params} = match
    const {id} = params
    this.setState({
      apiStatus: apiStatusConstants.inProgress,
    })
    const jwtToken = Cookies.get('jwt_token')
    const apiUrl = `https://apis.ccbp.in/book-hub/books/${id}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)
    if (response.ok) {
      const fetchedData = await response.json()
      const updatedData = this.getFormattedData(fetchedData)
      this.setState({
        bookData: updatedData,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({
        apiStatus: apiStatusConstants.failure,
      })
    }
  }

  renderBookDetailsView = () => {
    const {bookData} = this.state
    const {
      authorName,
      coverPic,
      rating,
      aboutAuthor,
      aboutBook,
      title,
      readStatus,
    } = bookData

    return (
      <div className="container">
        <div className="book-container">
          <div className="book-details-container">
            <img className="book-details-image" src={coverPic} alt={title} />
            <div className="details-container">
              <h1 className="book-details-title">{title}</h1>
              <p className="book-details-author">{authorName}</p>
              <p className="book-details-rating">
                Avg Rating:
                <BsFillStarFill className="book-details-icon" />
                <p className="book-details-span-rating">
                  {rating || 'Not Available'}
                </p>
              </p>

              <p className="book-details-status">
                Status:
                <span className="book-details-span-status">{readStatus}</span>
              </p>
            </div>
          </div>
          <hr className="hr-line" />
          <div className="book-details-about-container">
            <h1 className="book-details-about-heading">About Author</h1>
            <p className="book-details-about-description">{aboutAuthor}</p>
            <h1 className="book-details-about-heading">About Book</h1>
            <p className="book-details-about-description">{aboutBook}</p>
          </div>
        </div>
      </div>
    )
  }

  renderLoadingView = () => (
    <div className="loader-container" testid="loader">
      <Loader type="TailSpin" color="#0284C7" height={50} width={50} />
    </div>
  )

  renderFailureView = () => (
    <div className="failure_view">
      <img
        className="failure_image"
        src="https://res.cloudinary.com/dvtvfpqeo/image/upload/v1731308762/Group_7522_m81vdn.png"
        alt="failure view"
      />
      <p className="failure-description">
        Something went wrong. Please try again
      </p>
      <button
        type="button"
        className="failure_button"
        onClick={this.getBookData}
      >
        Try Again
      </button>
    </div>
  )

  renderBookDetails = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderBookDetailsView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  render() {
    return (
      <>
        <Header />
        <div>{this.renderBookDetails()}</div>
        <Footer />
      </>
    )
  }
}

export default BookDetails
