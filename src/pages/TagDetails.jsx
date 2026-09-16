import { useParams } from "react-router-dom"
import { useSelector } from "react-redux"
import { SongList } from "../cmps/globalCmps/SongList"
import { ScrollArea } from "../cmps/globalCmps/ScrollArea"
import { SquareList } from "../cmps/globalCmps/SquareList"

export function TagDetails() {
  const { tag } = useParams()
  const safeTag = tag?.toLowerCase() || ""

  const stations =
    useSelector((storeState) => storeState.stationModule.stations) || []
  const songs = useSelector((storeState) => storeState.songModule.songs) || []

  const filteredStations = stations.filter((station) =>
    station.tags?.some((stationTag) => stationTag.toLowerCase() === safeTag),
  )

  const filteredSongs = songs.filter((song) =>
    song.tags?.some((songTag) => songTag.toLowerCase() === safeTag),
  )

  const tags = useSelector((storeState) => storeState.stationModule.tags) || []
  const tagData = tags.find(
    (currTag) => currTag.title?.toLowerCase() === safeTag,
  )

  return (
    <section
      className="tag-details dynamic-area"
      style={{
        "--tag-color": tagData?.color || "#509BF5",
      }}
    >
      <ScrollArea>
        <section className="tag-details__container">
          <header className="tag-details__header">
            <div className="tag-details__header-content dynamic-max-width">
              <h1>{tagData?.title || tag}</h1>
            </div>
          </header>

          <div className="tag-details__lists">
            <div className="tag-details__lists-container dynamic-max-width">
              {filteredStations.length > 0 && (
                <div className="tag-details__station-list">
                  <h2>Stations</h2>
                  <SquareList stations={filteredStations} />
                </div>
              )}

              {filteredSongs.length > 0 && (
                <div className="tag-details__song-list">
                  <h2>Songs</h2>
                  <SongList songs={filteredSongs} />
                </div>
              )}
            </div>
          </div>
        </section>
      </ScrollArea>
    </section>
  )
}
