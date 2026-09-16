import React from "react"
import { useMediaQuery } from "react-responsive"
import { useSelector } from "react-redux"

import { BrowserRouter as Router } from "react-router-dom"
import { Routes, Route } from "react-router-dom"

import { AppHeader } from "./cmps/AppHeader.jsx"
import { LibraryPage } from "./pages/LibraryPage.jsx"
import { Explore } from "./pages/Explore.jsx"
import { Browse } from "./pages/Browse.jsx"
import { Library } from "./cmps/Library.jsx"
import { ArtistInfo } from "./cmps/ArtistInfo.jsx"
import { StationDetails } from "./pages/StationDetails.jsx"
import { Profile } from "./pages/Profile.jsx"
import { SongDetails } from "./pages/SongDetails.jsx"
import { TagDetails } from "./pages/TagDetails.jsx"
import { PlayBar } from "./cmps/PlayBar.jsx"

import { useEffect } from "react"
import {
  initSocketListeners,
  destroySocketListeners,
} from "./services/socket.listeners.js"


import { socketService } from "./services/socket.service.js"
import { MobileDock } from "./cmps/MobileDock.jsx"

import { login } from "./store/actions/user.actions.js"

function App() {
  const isExpanded = useSelector(
    (storeState) => storeState.systemModule.isExpanded,
  )
  const isMinimizedLibrary = useSelector(
    (storeState) => storeState.systemModule.isMinimizedLibrary,
  )

  const loggedInUser = useSelector((storeState) => storeState.userModule.user)

  useEffect(() => {
    initSocketListeners()
    return () => destroySocketListeners()
  }, [])

  useEffect(() => {
  if (!loggedInUser) {
    login({ username: "user0", password: "123" })
  }
}, [])

  useEffect(() => {
    if (!loggedInUser?._id) return

    socketService.watchUser(loggedInUser._id)

    return () => {
      socketService.unwatchUser(loggedInUser._id)
    }
  }, [loggedInUser?._id])

  const isMobile = useMediaQuery({ maxWidth: 768 })

  return (
    <Router>
      <div className="main-container">
        {!isMobile && <AppHeader />}
        {/* <UserMsg /> */}

        <main
          className={`app-layout
        ${isExpanded ? "expanded" : ""}
        ${isMinimizedLibrary && !isMobile ? "minimized" : ""}`.trim()}>
          
          {!isMobile && <Library />}

          <Routes>
            {/* explore, browse, stationdetails, songdetails - dynamic area */}
            <Route path="/" element={<Explore />} />
            <Route path="/browse" element={<Browse />} />
            <Route path="/browse/:tag" element={<TagDetails />} />
            <Route path="/library" element={<LibraryPage />} />
            <Route path="station/:id" element={<StationDetails />} />
            <Route path="user/:id" element={<Profile />} />
            <Route path="song/:id" element={<SongDetails />} />
          </Routes>

          {!isMobile && <ArtistInfo />}
        </main>
        <div className="mobile-menu">
          <PlayBar />
          <MobileDock />
        </div>
      </div>
    </Router>
  )
}

export default App
