import { stationService } from "../../services/station"

export const SET_STATIONS = "SET_STATIONS"
export const SET_STATION = "SET_STATION"
export const REMOVE_STATION = "REMOVE_STATION"
export const ADD_STATION = "ADD_STATION"
export const UPDATE_STATION = "UPDATE_STATION"
export const SET_FILTER_BY = "SET_FILTER_BY"
export const SET_STATION_LOADING = "SET_STATION_LOADING"

export const ADD_SONG_TO_STATION = "ADD_SONG_TO_STATION"
export const REMOVE_SONG_FROM_STATION = "REMOVE_SONG_FROM_STATION"
export const UPDATE_LIKED_STATION_COUNT = "UPDATE_LIKED_STATION_COUNT"

export const SET_TAGS = "SET_TAGS"

const initialStationState = {
  stations: [],
  tags: [],
  selectedStation: null,
  lastWatchedStationId: null,
  lastWatchedStations: [],
  filterBy: { txt: "", tags: [], genres: [], artists: [] },
  isLoading: false,
}

export function stationReducer(state = initialStationState, action = {}) {
  switch (action.type) {
    case SET_STATIONS:
      return {
        ...state,
        stations: action.stations,
      }

    case SET_TAGS:
      return {
        ...state,
        tags: action.tags,
      }

    case SET_STATION:
      const isAlreadyWatched = state.lastWatchedStations.includes(
        action.station._id,
      )
      return {
        ...state,
        selectedStation: action.station,
        lastWatchedStationId: action.station._id,
        lastWatchedStations: isAlreadyWatched
          ? state.lastWatchedStations
          : [...state.lastWatchedStations, action.station._id],
      }

    case REMOVE_STATION:
      return {
        ...state,
        stations: state.stations.filter(
          (station) => station._id !== action.stationId,
        ),
        selectedStation:
          state.selectedStation?._id === action.stationId
            ? null
            : state.selectedStation,
      }

    case ADD_STATION:
      if (
        state.stations.some((station) => station._id === action.station._id)
      ) {
        return state
      }
      return {
        ...state,
        stations: [action.station, ...state.stations],
      }

    case UPDATE_STATION:
      return {
        ...state,
        stations: state.stations.map((station) =>
          station._id === action.station._id ? action.station : station,
        ),
        selectedStation:
          state.selectedStation?._id === action.station._id
            ? action.station
            : state.selectedStation,
      }

    case SET_FILTER_BY:
      return { ...state, filterBy: action.filterBy }

    case SET_STATION_LOADING:
      return { ...state, isLoading: action.isLoading }

    case ADD_SONG_TO_STATION:
      return {
        ...state,
        stations: state.stations.map((station) =>
          station._id === action.stationId
            ? { ...station, songs: [...station.songs, action.song] }
            : station,
        ),
      }

    case REMOVE_SONG_FROM_STATION:
      return {
        ...state,
        stations: state.stations.map((station) =>
          station._id === action.stationId
            ? {
                ...station,
                songs: station.songs.filter((s) => s._id !== action.sId),
              }
            : station,
        ),
      }

    default:
      return state
  }
}
