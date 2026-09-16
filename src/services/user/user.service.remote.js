import { httpService } from "../http.service"

const STORAGE_KEY_LOGGEDIN_USER = "loggedinUser"


export const userService = {
  login,
  logout,
  signup,
  getUsers,
  getById,
  remove,
  update,
  getLoggedinUser,
  saveLoggedinUser,
}

function getUsers() {
  return httpService.get(`user`)
}

async function getById(userId) {
  const user = await httpService.get(`user/${userId}`)
  return user
}

function remove(userId) {
  return httpService.delete(`user/${userId}`)
}

async function update(user) {
  const updatedUser = await httpService.put(`user/${user._id}`, user)

  const loggedinUser = getLoggedinUser()

  if (loggedinUser?._id === updatedUser._id) {
    saveLoggedinUser(updatedUser)
  }

  return updatedUser
}

async function login(userCred) {
  const user = await httpService.post("auth/login", userCred)
  if (user) return saveLoggedinUser(user)
}

async function signup(userCred) {
  if (!userCred.imgUrl)
    userCred.imgUrl =
      "https://cdn.pixabay.com/photo/2020/07/01/12/58/icon-5359553_1280.png"
  userCred.score = 10000

  const user = await httpService.post("auth/signup", userCred)
  return saveLoggedinUser(user)
}

async function logout() {
  sessionStorage.removeItem(STORAGE_KEY_LOGGEDIN_USER)
  return await httpService.post("auth/logout")
}

function getLoggedinUser() {
  return JSON.parse(sessionStorage.getItem(STORAGE_KEY_LOGGEDIN_USER))
}

function saveLoggedinUser(user) {
  user = {
    _id: user._id,
    username: user.username,
    fullname: user.fullname,
    imgUrl: user.imgUrl,
    isAdmin: user.isAdmin,
    likedStationIds: user.likedStationIds || [],
    likedSongIds: user.likedSongIds || [],
  }
  sessionStorage.setItem(STORAGE_KEY_LOGGEDIN_USER, JSON.stringify(user))
  return user
}
