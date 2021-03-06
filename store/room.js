import firebase from '@/plugins/firebase'
const roomsRef = firebase.firestore().collection('rooms')

export const state = () => ({
  roomId: 0,
  room: {
    users: [
      {
        uid: '',
        displayName: '',
        photoURL: '',
        userNum: 0,
      },
    ],
    answer: [],
    isEmpty: true,
    theme: '',
    points: [],
  },
})

export const mutations = {
  setRoomId(state, roomId) {
    state.roomId = roomId
  },
  pushUser(state, user) {
    state.room.users.push(user)
  },
}

export const actions = {
  createRoom({ commit }, { roomId, user }) {
    console.log(user)
    roomsRef
      .doc(roomId)
      .set({
        answer: ['', '', '', ''],
        isEmpty: false,
        points: [0, 0, 0, 0],
        theme: '',
        playerNum: 1,
      })
      .then(() => {
        console.log('Document successfully written!')
      })
      .catch((error) => {
        console.error('Error writing document: ', error)
      })
    roomsRef
      .doc(roomId)
      .collection('users')
      .doc(user.uid)
      .set({
        displayName: user.displayName,
        photoURL: user.photoURL,
        userNumm: 0,
      })
      .then(() => {
        console.log('Document successfully written!')
      })
      .catch((error) => {
        console.error('Error writing document: ', error)
      })
    commit('setRoomId', roomId)
  },
  searchRoom(roomId) {
    roomsRef
      .doc(roomId)
      .get()
      .then((doc) => {
        if (!doc.exists) {
          return doc.data().playerNum
        }
        console.log('No such document!')
        alert('にゃにゃ？！\nそのIDの部屋は存在しないにゃ')
      })
      .catch((error) => {
        console.log('Error getting document:', error)
      })
    return 0
  },
  enterRoom({ commit }, { roomId, user, playerNum }) {
    roomsRef.doc(roomId).update({ playerNum: playerNum + 1 })
    roomsRef
      .doc(roomId)
      .collection('users')
      .doc(user.uid)
      .set({
        displayName: user.displayName,
        photoURL: user.photoURL,
        userNum: playerNum + 1,
      })
      .then(() => {
        console.log('Document successfully written!')
      })
      .catch((error) => {
        console.error('Error writing document: ', error)
      })
    commit('pushUser')
  },
}

export const getters = {}
