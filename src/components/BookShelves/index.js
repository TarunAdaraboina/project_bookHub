import {Component} from 'react'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'
import {Link} from 'react-router-dom'
import {BsFillStarFill, BsSearch} from 'react-icons/bs'

import Header from '../Header'
import Footer from '../Footer'

import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

const bookshelvesList = [
  {
    id: '22526c8e-680e-4419-a041-b05cc239ece4',
    value: 'ALL',
    label: 'All',
  },
  {
    id: '37e09397-fab2-46f4-9b9a-66b2324b2e22',
    value: 'READ',
    label: 'Read',
  },
  {
    id: '2ab42512-3d05-4fba-8191-5122175b154e',
    value: 'CURRENTLY_READING',
    label: 'Currently Reading',
  },
  {
    id: '361d5fd4-9ea1-4e0c-bd47-da2682a5b7c8',
    value: 'WANT_TO_READ',
    label: 'Want to Read',
  },
]

class BookShelves extends Component {
  state = {
    books: [],
    apiStatus: apiStatusConstants.initial,
    bookshelfName: bookshelvesList[0].value,
    bookshelfLabel: bookshelvesList[0].label,
    searchInput: '',
    searchValue: '',
  }

  componentDidMount() {
    this.getProducts()
  }

  getProducts = async () => {
    this.setState({
      apiStatus: apiStatusConstants.inProgress,
    })

    const {bookshelfName, searchInput} = this.state
    const apiUrl = `https://apis.ccbp.in/book-hub/books?shelf=${bookshelfName}&search=${searchInput}`
    const jwtToken = Cookies.get('jwt_token')
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }

    const response = await fetch(apiUrl, options)

    if (response.ok) {
      const fetchedData = await response.json()
      const updatedData = fetchedData.books.map(each => ({
        id: each.id,
        authorName: each.author_name,
        coverPic: each.cover_pic,
        rating: each.rating,
        readStatus: each.read_status,
        title: each.title,
      }))

      if (updatedData.length === 0) {
        this.setState({
          books: [],
          apiStatus: apiStatusConstants.success,
          searchValue: searchInput,
        })
      } else {
        this.setState({
          books: updatedData,
          apiStatus: apiStatusConstants.success,
          searchValue: '',
        })
      }
    } else {
      this.setState({
        apiStatus: apiStatusConstants.failure,
      })
    }
  }

  onChangeBookshelf = bookshelf => {
    const {value, label} = bookshelf
    this.setState(
      {bookshelfName: value, bookshelfLabel: label},
      this.getProducts,
    )
  }

  onChangeSearchInput = event => {
    this.setState({searchInput: event.target.value})
  }

  onClickSearch = () => {
    this.getProducts()
  }

  onKeyDown = event => {
    if (event.key === 'Enter') {
      this.getProducts()
    }
  }

  renderBookshelvesFilters = () => {
    const {bookshelfName} = this.state
    return (
      <ul className='ul-list-filters-buttons'>
        {bookshelvesList.map(each => (
          <li className='list-bookshelves-filters' key={each.id}>
            <button
              className={`bookshelf-filter-button ${
                bookshelfName === each.value ? 'active' : ''
              }`}
              type='button'
              onClick={() => this.onChangeBookshelf(each)}
            >
              {each.label}
            </button>
          </li>
        ))}
      </ul>
    )
  }

  renderProductsListView = () => {
    const {books, searchValue} = this.state

    if (books.length === 0) {
      return (
        <div className='no-books-container'>
          <img
            className='no-books-image'
            src='https://res.cloudinary.com/dvtvfpqeo/image/upload/v1732259945/Asset_1_1_k2k0gi.png'
            alt='no books'
          />
          <p className='no-books-message'>
            Your search for {searchValue} did not find any matches.
          </p>
        </div>
      )
    }

    return (
      <ul className='ul-list-items'>
        {books.map(book => (
          <Link to={`/books/${book.id}`} key={book.id} className='link-item'>
            <div className='list-item-container'>
              <li className='list-items'>
                <img
                  src={book.coverPic}
                  alt={book.title}
                  className='book-image'
                />
                <div>
                  <h1 className='book-name'>{book.title}</h1>
                  <p className='book-author'>{book.authorName}</p>
                  <p className='book-rating'>
                    Avg Rating:
                    <BsFillStarFill className='icon' />
                    {book.rating}
                  </p>
                  <p className='book-status'>
                    Status:
                    <span className='span-status'>{book.readStatus}</span>
                  </p>
                </div>
              </li>
            </div>
          </Link>
        ))}
      </ul>
    )
  }

  renderLoadingView = () => (
    <div className='loader-container' testid='loader'>
      <Loader type='TailSpin' color='#0284C7' height={50} width={50} />
    </div>
  )

  renderFailureView = () => (
    <div className='failure_view'>
      <img
        className='failure_image'
        src='https://res.cloudinary.com/dvtvfpqeo/image/upload/v1731308762/Group_7522_m81vdn.png'
        alt='failure view'
      />
      <p className='failure-description'>
        Something went wrong. Please try again.
      </p>
      <button
        type='button'
        className='failure_button'
        onClick={this.getProducts}
      >
        Try Again
      </button>
    </div>
  )

  renderSlider = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderProductsListView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  render() {
    const {searchInput, bookshelfLabel} = this.state

    return (
      <>
        <Header />
        <div className='book-shelf-products-container'>
          <div className='input-container'>
            <label htmlFor='search' className='visually-hidden'>
              Search for books
            </label>
            <input
              id='search'
              className='input-element'
              type='search'
              placeholder='Search here'
              value={searchInput}
              onChange={this.onChangeSearchInput}
              onKeyDown={this.onKeyDown}
            />
            <button
              type='button'
              className='search-button'
              onClick={this.onClickSearch}
            >
              <BsSearch className='search-icon' />
            </button>
          </div>
          <div>
            <div className='book-shelves-container'>
              <h1 className='bookshelves-heading'>Bookshelves</h1>
              <div className='list-button-container'>
                {this.renderBookshelvesFilters()}
              </div>
            </div>
          </div>
          <div className='books-search-and-products-container'>
            <div className='all-books-container'>
              <h1 className='heading'>{bookshelfLabel} Books</h1>
              <div className='search-input-container'>
                <input
                  className='input-element'
                  placeholder='Search here'
                  value={searchInput}
                  onChange={this.onChangeSearchInput}
                  onKeyDown={this.onKeyDown}
                />
                <button
                  type='button'
                  className='search-button'
                  testid='searchButton'
                  onClick={this.onClickSearch}
                >
                  <BsSearch className='search-icon' />
                </button>
              </div>
            </div>
            <div>{this.renderSlider()}</div>
          </div>
        </div>
        <Footer />
      </>
    )
  }
}

export default BookShelves
