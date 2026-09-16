import { useState, useEffect, useMemo } from "react"
import { useMediaQuery } from "react-responsive"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"

import { addStation, loadStations,loadTags } from "../store/actions/station.actions"
import { updateUser } from "../store/actions/user.actions.js"
import { loadSongs } from "../store/actions/song.actions.js"
import { showSuccessMsg, showErrorMsg } from "../services/event-bus.service"

import { stationService } from "../services/station/"
import { StationList } from "./StationList"
import { StationFilter } from "./StationFilter.jsx"
import {
  TOGGLE_EXPAND_LIBRARY,
  TOGGLE_MINIMIZE_LIBRARY,
  TURN_ON_SQUARE_LIBRARY,
  TURN_OFF_SQUARE_LIBRARY,
  TOGGLE_SQUARE_LIBRARY,
}
  from "../store/reducers/system.reducer.js"
import { store } from "../store/store.js"
import { IconComp } from "./globalCmps/IconComp.jsx"
import { ScrollArea } from "./globalCmps/ScrollArea.jsx"
import { SquareList } from "./globalCmps/SquareList.jsx"

export function Library({ mobile = false }) {
  const navigate = useNavigate()
  const isMobile = useMediaQuery({ maxWidth: 768 })
  const stations = useSelector(
    (storeState) => storeState.stationModule.stations,
  )

  const [searchTxt, setSearchTxt] = useState('')

  const isMinimizedLibrary = useSelector((storeState) => storeState.systemModule.isMinimizedLibrary)

  const songs = useSelector((storeState) => storeState.songModule.songs)
  const isSquare = useSelector(storeState => storeState.systemModule.isSquare)

  useEffect(() => {
    const handleResize = () => {
      const shouldBeMinimized = window.innerWidth < 1300
      store.dispatch({ type: TOGGLE_MINIMIZE_LIBRARY, isMinimizedLibrary: shouldBeMinimized })
      store.dispatch({ type: TURN_OFF_SQUARE_LIBRARY })
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  function toggleMinimize() {
    if (isMobile) return
    store.dispatch({ type: TOGGLE_MINIMIZE_LIBRARY, isMinimizedLibrary: !isMinimizedLibrary })
    store.dispatch({ type: TURN_OFF_SQUARE_LIBRARY })
  }


  const loggedinUser = useSelector((storeState) => storeState.userModule.user)
  const isExpanded = useSelector(
    (storeState) => storeState.systemModule.isExpanded,
  )

  const likedSongs = useMemo(
    () =>
      songs.filter((song) => loggedinUser?.likedSongIds?.includes(song._id)),
    [songs, loggedinUser?.likedSongIds],
  )

  const libraryStations = useMemo(() => {
    if (!Array.isArray(stations) || !loggedinUser) return []

  
    const idToStation = new Map(stations.map(station => [station._id.toString(), station]))

    const likedIds = loggedinUser.likedStationIds || []

    const orderedLikedStations = likedIds
      .map(id => idToStation.get(id.toString()))
      .filter(Boolean)

      if (searchTxt) {
        const lowerSearchTxt = searchTxt.toLowerCase()
        return orderedLikedStations.filter(station =>
          station.name.toLowerCase().includes(lowerSearchTxt)
        )
      }

    return orderedLikedStations

  }, [stations, loggedinUser , searchTxt])

  function toggleExpand() {
    store.dispatch({ type: TOGGLE_EXPAND_LIBRARY, isExpanded: !isExpanded })
    store.dispatch({ type: TURN_ON_SQUARE_LIBRARY })
  }

  useEffect(() => {
    loadStations()
    loadSongs()
    loadTags()
  }, [])


  async function onCreateStation() {
    const station = stationService.getEmptyStation()

    try {
      const savedStation = await addStation(station)

      await updateUser({
        ...loggedinUser,
        likedStationIds: [
          savedStation._id,
          ...(loggedinUser.likedStationIds || [])
        ],
      })

      showSuccessMsg("Station added!")
      navigate(`/station/${savedStation._id}`)
    } catch (err) {
      console.log("Could not create station", err)
      showErrorMsg("Couldn't add station")
    }
  }


  return (
    <section className={mobile ? "library-page" : `app-library ${isMinimizedLibrary ? 'app-library--minimize' : ''} `}>
      <div className={`library-header ${isMinimizedLibrary ? 'library-header--minimized' : ''} `}>
        <button
          className={`btn minimize-button ${isMinimizedLibrary ? 'minimized' : ''}`}
          onClick={toggleMinimize}
        >
          <IconComp name={isMinimizedLibrary ? 'collapse-right' : 'collapse-left'}
            className={`${isMinimizedLibrary ? 'icon--md' : 'icon--sm'} icon--muted`} />
          {!isMinimizedLibrary && 'Your Library'}
        </button>

        <section className="library-controls">
          <button onClick={onCreateStation} className="btn bg-button">
            <IconComp name="create" className="icon--sm icon--muted" />
            {!isMinimizedLibrary && <span className="btn-text">Create</span>}
          </button>
          {!isMinimizedLibrary && <button onClick={toggleExpand} className="btn hover-bg">
            <IconComp name={isExpanded ? 'un-expend' : 'expend'} className="icon--sm icon--muted" />
          </button>}
        </section>
      </div>

      {!isMinimizedLibrary && <div className="filter">
        <StationFilter searchTxt={searchTxt} setSearchTxt={setSearchTxt} />
      </div>}

      <ScrollArea>
        <div
          className={
            isExpanded || isSquare
              ? "library-content library-content--expanded"
              : "library-content"
          }
        >
          {isSquare ? (
            <SquareList
              stations={libraryStations}
              isOwner={true}
              isLibrary={true}
            />
          ) : (
            <StationList stations={libraryStations} />
          )}
        </div>
      </ScrollArea>
    </section>
  )
}
