import firebase from '@/plugins/firebase'
const roomsRef = firebase.firestore().collection('rooms')
const roomObjInit = {
  roomId: '',
  users: [{}, {}, {}, {}],
  answer: ['', '', '', ''],
  isEmpty: false,
  theme: '',
  points: [0, 0, 0, 0],
}

export const state = () => ({
  roomObj: roomObjInit,
})

export const mutations = {
  setRoomId(state, roomId) {
    state.roomId = roomId
  },
  pushUser(state, user) {
    state.roomObj.users.push(user)
  },
  setIsEmpty(state, isEmpty) {
    state.roomObj.isEmpty = isEmpty
  },
  clearRoomObj(state) {
    state.roomObj = roomObjInit
  },
}

export const actions = {
  createRoom({ commit, state }, { roomId, user }) {
    roomsRef
      .doc(roomId)
      .set({
        answer: ['', '', '', ''],
        isEmpty: true,
        points: [0, 0, 0, 0],
        theme: '',
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
        userNum: 0,
      })
      .then(() => {
        console.log('Document successfully written!')
      })
      .catch((error) => {
        console.error('Error writing document: ', error)
      })
    commit('setRoomId', roomId)
    commit('clearRoomObj')
    commit('pushUser', user)
    commit('setIsEmpty', true)
    // console.log(state.roomObj)
  },
  async getIsEmpty({ commit }, { roomId }) {
    console.log(roomId)
    await roomsRef
      .doc(roomId)
      .get()
      .then((doc) => {
        if (doc.exists) {
          const roomData = doc.data()
          commit('setIsEmpty', roomData.isEmpty)
        } else {
          console.log('No such roomId!')
        }
      })
      .catch((error) => {
        console.log('Error getting document:', error)
      })
  },
  async joinRoom({ commit, state }, { roomId, user }) {
    let userNum = 0
    let isEmpty = true
    // 参加済みのユーザー追加
    commit('clearRoomObj')
    console.log(state.roomObj)
    await roomsRef
      .doc(roomId)
      .collection('users')
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          const userData = doc.data()
          const user = {
            uid: doc.id,
            displayName: userData.displayName,
            photoURL: userData.photoURL,
            userNum: userData.userNum,
          }
          commit('pushUser', user)
          console.log('1')
        })
      })
      .catch((error) => {
        console.log('Error getting documents: ', error)
      })
    // userNum確認
    await roomsRef
      .doc(roomId)
      .collection('users')
      .orderBy('userNum', 'desc')
      .limit(1)
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          const userData = doc.data()
          userNum = userData.userNum
        })
        console.log('2')
      })
    // firestoreのroom.user更新
    await roomsRef
      .doc(roomId)
      .collection('users')
      .doc(user.uid)
      .set({
        displayName: user.displayName,
        photoURL: user.photoURL,
        userNum: userNum + 1,
      })
      .then(() => {
        console.log('3')
        console.log('Document successfully written!')
      })
      .catch((error) => {
        console.error('Error writing document: ', error)
      })
    if (userNum + 1 === 3) {
      isEmpty = false
      roomsRef.doc(roomId).update({
        isEmpty: false,
      })
    }
    console.log('4')
    commit('pushUser', user)
    commit('setIsEmpty', isEmpty)
    // console.log(state.roomObj)
  },
  clear({ commit, state }) {
    commit('clearRoomObj')
  },
}

export const getters = {}
