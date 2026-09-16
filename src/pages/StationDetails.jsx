import { useEffect, useState, useMemo } from "react"
import { useParams } from "react-router-dom"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import {
  loadStation,
  updateStation,
  removeStation,
} from "../store/actions/station.actions"
import { showSuccessMsg, showErrorMsg } from "../services/event-bus.service"

import { EditModal } from "../cmps/globalCmps/EditModal"
import { StationHeader } from "../cmps/globalCmps/StationHeader"
import { SongList } from "../cmps/globalCmps/SongList"

import { StationOptions } from "../cmps/globalCmps/StationOptions"
import { ScrollArea } from "../cmps/globalCmps/ScrollArea"
import { StationSearchMore } from "../cmps/StationSearchMore"
import { LoadingAnimation } from "../cmps/globalCmps/LoadingAnimation"
import { updateUser } from "../store/actions/user.actions"

import { socketService } from "../services/socket.service"

export function StationDetails() {
  const navigate = useNavigate()
  const { id } = useParams()
  const loggedInUser = useSelector((storeState) => storeState.userModule.user)

  const tags = useSelector((storeState) => storeState.stationModule.tags) || []

  const station = useSelector(
    (storeState) => storeState.stationModule.selectedStation,
  )

  const selectedStationId = useSelector(
    (storeState) => storeState.stationModule.selectedStation?._id,
  )

  const songs = useSelector((storeState) => storeState.songModule.songs)

  const [isEditOpen, setIsEditOpen] = useState(false)

  const isLikedSongsStation = station?.tags?.includes("Liked")

  const likedSongIds = loggedInUser?.likedSongIds || []
  const stationSongsIds = station?.songs || []

  const stationSongs = useMemo(() => {
    const songIds = isLikedSongsStation ? likedSongIds : stationSongsIds
    if (!songIds.length || !Array.isArray(songs)) return []
    const idToSong = new Map(songs.map((song) => [song._id.toString(), song]))
    return songIds.map((id) => idToSong.get(id.toString())).filter(Boolean)
  }, [songs, stationSongsIds, likedSongIds, isLikedSongsStation])

  useEffect(() => {
    if (!id) return

    socketService.watchStation(id)

    return () => {
      socketService.unwatchStation(id)
    }
  }, [id])

  useEffect(() => {
    if (!id) return
    async function fetchStation() {
      try {
        await loadStation(id)
      } catch (err) {
        console.log("Station not found, redirecting...")
        navigate("/")
      }
    }

    fetchStation()
  }, [id, navigate])

  async function onSaveStation(updatedStation) {
    try {
      await updateStation(updatedStation)

      showSuccessMsg("Playlist updated")
    } catch (err) {
      console.log(err)
      showErrorMsg("Couldn't update playlist")
    }
  }

  async function onRemoveStation() {
    const isConfirmed = confirm(`Delete "${station.name}"?`)

    if (!isConfirmed) return

    try {
      await removeStation(station._id)

      showSuccessMsg("Station removed")
      navigate("/")
    } catch (err) {
      console.log("Cannot remove station", err)
      showErrorMsg("Couldn't remove station")
    }
  }

  function handleReorderSongs(updatedSongs) {
    if (isLikedSongsStation) {
      console.log("isLikedSongsStation: ", isLikedSongsStation)
      const updatedUser = {
        ...loggedInUser,
        likedSongIds: updatedSongs,
      }
      updateUser(updatedUser)
    } else {
      const updatedStation = {
        ...station,
        songs: updatedSongs,
      }
      updateStation(updatedStation)
    }
  }

  if (!station && selectedStationId !== id)
    return (
      <section className="station-details dynamic-area">
        <div className="station-details__container">
          <div className="station-details__loading">
            <p>Injecting Music</p>
            <LoadingAnimation />
          </div>
        </div>
      </section>
    )
  if (!station) {
    return (
      <section className="station-details dynamic-area">
        <div className="station-details__container">
          <div className="station-details__loading">
            <p>Injecting Music</p>
            <LoadingAnimation />
          </div>
        </div>
      </section>
    )
  }

  const isOwner = loggedInUser?._id === station.createdBy?._id

  const tagData = tags.find(
    currTag => currTag.title === station.tags[0]
)

  return (
    <section
      className="station-details dynamic-area"
      style={{
        "--tag-color": tagData?.color || "#509BF5",
      }}
    >
      <ScrollArea>
        <section className="station-details__container">
          <section className="station-details__header">
            <StationHeader
              user={loggedInUser}
              stationSongs={stationSongs}
              station={station}
              isOwner={isOwner}
              onRemoveStation={onRemoveStation}
              onEditStation={() => setIsEditOpen(true)}
            />
          </section>
          <div className="station-details__content">
            <section className="station-details__options dynamic-max-width">
              <StationOptions
                stationSongs={stationSongs}
                station={station}
                isOwner={isOwner}
                onRemoveStation={onRemoveStation}
                onEditStation={() => setIsEditOpen(true)}
              />
            </section>

            {isEditOpen && (
              <EditModal
                title="Edit station"
                entity={station}
                onClose={() => setIsEditOpen(false)}
                onSave={onSaveStation}
              />
            )}

            <section className="station-details__song-list dynamic-max-width">
              {stationSongs?.length > 0 && (
                <SongList
                  songs={stationSongs || []}
                  isSortable
                  onReorder={handleReorderSongs}
                />
              )}

              <StationSearchMore station={station} songs={songs} />
            </section>
          </div>
        </section>
      </ScrollArea>
    </section>
  )
}
