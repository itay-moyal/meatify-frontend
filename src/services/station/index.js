const { DEV, VITE_LOCAL } = import.meta.env

import { userService } from '../user'
import { stationService as local } from './station.service.local'
import { stationService as remote } from './station.service.remote'

function getEmptyStation() {
    return {
        name: 'My Station',
        tags: [],
        songs: [],
        createdBy: userService.getLoggedinUser(),
        savedCount: 0,
        songsImagesUrls: [],
        uploadImgUrl: '',
        songsImagesUrls: [],
        isPrivate: false,
        type: 'station'
    }
}

function getDefaultFilter() {
    return {
        txt: '',
        tags: [],
    }
}


const isLocal = VITE_LOCAL === 'true'
console.log('isLocal: ', isLocal)
const service = isLocal ? local : remote

if (isLocal) {
    service.generateSpotifyData(200, 100)
}
export const stationService = { getEmptyStation, getDefaultFilter, ...service }

// Easy access to this service from the dev tools console
// when using script - dev / dev:local

if (DEV) window.stationService = stationService
