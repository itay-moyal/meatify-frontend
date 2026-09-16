import { Link, NavLink } from "react-router-dom"
import { isCookie, useNavigate, useLocation } from "react-router"
import { useSelector, useDispatch } from "react-redux"
import { useState, useRef, useEffect } from "react"

import { showErrorMsg, showSuccessMsg } from "../services/event-bus.service.js"
import { logout } from "../store/actions/user.actions.js"
import { debounce } from "../services/util.service.js"

import { stationService } from "../services/station"
import { SearchResultsDropdown } from "./SearchResultsDropdown.jsx"

import { IconComp } from "./globalCmps/IconComp.jsx"

export function AppHeader() {
  const user = useSelector((storeState) => storeState.userModule.user)
  const stations = useSelector((storeState) => storeState.stationModule.stations) || []

  const searchRef = useRef(null)
  const [searchTxt, setSearchTxt] = useState('')
  const [searchResults, setSearchResults] = useState([])

  const navigate = useNavigate()
  const location = useLocation()

  const [isOpen, setIsOpen] = useState(false)

  const isHome = location.pathname === `/`
  const isBrowse = location.pathname === `/browse`

  useEffect(() => {
    if (!searchTxt.trim()) {
      setSearchResults(stations)
    }
  }, [stations, searchTxt])

  const debouncedSearch = useRef(
    debounce(async (txt) => {
      try {
        if (!txt.trim()) {
          setSearchResults(stations)
          return
        }

        const searchedStations = await stationService.query({ txt })
        setSearchResults(searchedStations)
      } catch (err) {
        console.error('Cannot search stations', err)
      }
    }, 300)
  ).current

  function handleChange({ target }) {
    const value = target.value
    setIsOpen(true)
    setSearchTxt(value)      // immediate UI update
    debouncedSearch(value)   // backend search
  }

  useEffect(() => {
    function handleClickOutside(ev) {
      if (searchRef.current && !searchRef.current.contains(ev.target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)

    return () =>
      document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  async function onLogout() {
    try {
      await logout()
      navigate("/")
      showSuccessMsg(`Bye now`)
    } catch (err) {
      showErrorMsg("Cannot logout")
    }
  }

  return (
    <header className="app-header full">
      <nav>
        <NavLink to="/" className="logo">
          <img className="app-header__logo" src="/logo/meatify-logo.svg" alt="Meatify logo" />
        </NavLink>

        <div className="search-bar-container">

          <button
            className="btn circle-btn"
            onClick={() => navigate("/")}>
            <IconComp name={`${isHome ? 'home' : 'home-hollow'}`}
              className="icon--white icon--md" />
          </button>

          <div className="search-bar" ref={searchRef}>
            <button className="btn">
              <IconComp name="search" className="icon--muted icon--md" />
            </button>
            <div className="search-bar-container__input-wrapper">

              <input
                className="search-input"
                type="search"
                name="txt"
                id=""
                placeholder="What do you want to play?"
                value={searchTxt}
                onChange={handleChange}
              />

              {searchTxt.length > 0 && <button className="btn input-close-btn"
                onClick={() => setSearchTxt('')}>
                <IconComp name="close" className="icon--muted icon--md" />
              </button>}
            </div>


            <div className="search-browse-container">
              <button
                className="btn"
                onClick={() => navigate("/browse")}
              >
                <IconComp name={`${isBrowse ? 'browse' : 'browse-hollow'}`}
                  className="icon--muted icon--md" />
              </button>
            </div>
            {isOpen && <SearchResultsDropdown stations={searchResults} />}
          </div>
        </div>

        <div className="app-header__user-actions">
          {!user && (
            <NavLink to="auth/login" className="login-link">
              Login
            </NavLink>
          )}
          {user && <>
            

            <div className="user-info">
              <button className="btn circle-btn">
                <Link to={`user/${user._id}`}>
                  {user.imgUrl && <img className="user-info__pic" src={user.imgUrl} />}
                </Link>
              </button>
            </div>
          </>
          }
        </div>

      </nav>
    </header >
  )
}
