import { stationService } from "../../services/station"
import { songService } from "../../services/song"
import { store } from "../store"
import {
  ADD_STATION,
  REMOVE_STATION,
  SET_STATIONS,
  SET_STATION,
  UPDATE_STATION,
  SET_STATION_LOADING,
  SET_TAGS,
} from "../reducers/station.reducer"

export async function loadStations(filterBy) {
  try {
    const stations = await stationService.query(filterBy)

    store.dispatch(getCmdSetStations(stations))
  } catch (err) {
    console.log("Cannot load stations", err)
    throw err
  }
}

export async function loadTags() {
  try {
    const tags = await stationService.getTagsData()
    store.dispatch(getCmdSetTags(tags))
  } catch (err) {
    console.log("Cannot load tags", err)
    throw err
  }
}

export async function loadStation(stationId) {
  try {
    const station = await stationService.getById(stationId)
    store.dispatch(getCmdSetStation(station))
  } catch (err) {
    console.log("Cannot load station", err)
    throw err
  }
}

export async function removeStation(stationId) {
  try {
    await stationService.remove(stationId)
    store.dispatch(getCmdRemoveStation(stationId))
  } catch (err) {
    console.log("Cannot remove station", err)
    throw err
  }
}

export async function addStation(station) {
  try {
    const savedStation = await stationService.save(station)
    return savedStation
  } catch (err) {
    console.log("Cannot add station", err)
    throw err
  }
}

export async function updateStation(station) {
  try {
    const savedStation = await stationService.save(station)
    store.dispatch(getCmdUpdateStation(savedStation))
    return savedStation
  } catch (err) {
    console.log("Cannot save station", err)
    throw err
  }
}

export async function addSongToStation(stationId, songId) {
  try {
    const updatedStation = await stationService.addSongToStation(
      stationId,
      songId,
    )
    store.dispatch(getCmdUpdateStation(updatedStation))
    return updatedStation
  } catch (err) {
    console.log("Cannot add song to station", err)
    throw err
  }
}

export async function removeSongFromStation(stationId, songId) {
  try {
    const updatedStation = await stationService.removeSongFromStation(
      stationId,
      songId,
    )
    store.dispatch(getCmdUpdateStation(updatedStation))
    return updatedStation
  } catch (err) {
    console.log("Cannot remove song from station", err)
    throw err
  }
}

export function removeStationFromStore(stationId) {
  store.dispatch(getCmdRemoveStation(stationId))
}

export function updateStationInStore(station) {
  store.dispatch(getCmdUpdateStation(station))
}

export function addStationToStore(station) {
  store.dispatch(getCmdAddStation(station))
}

function getCmdSetStations(stations) {
  return {
    type: SET_STATIONS,
    stations,
  }
}

function getCmdSetStation(station) {
  return {
    type: SET_STATION,
    station,
  }
}

function getCmdRemoveStation(stationId) {
  return {
    type: REMOVE_STATION,
    stationId,
  }
}

function getCmdAddStation(station) {
  return {
    type: ADD_STATION,
    station,
  }
}

function getCmdUpdateStation(station) {
  return {
    type: UPDATE_STATION,
    station,
  }
}

function getCmdSetTags(tags) {
  return {
    type: SET_TAGS,
    tags,
  }
}