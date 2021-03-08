import firebase from '@/plugins/firebase'
const roomsRef = firebase.firestore().collection('rooms')
const unknownUser = {
  displayName: '空き',
  photoURL: '~/assets/userIconSample.png',
  userNum: 0,
  uid: 'ZZZZZ',
}

export const state = () => ({
  roomObj: {
    roomId: '',
    users: [],
    answer: ['', '', '', ''],
    isEmpty: false,
    theme: '',
    points: [0, 0, 0, 0],
  },
})

export const mutations = {
  setUsers(state, user) {
    state.roomObj.users = JSON.parse(JSON.stringify(user))
  },
  setIsEmpty(state, isEmpty) {
    state.roomObj.isEmpty = isEmpty
  },
  setRoomObj(state, roomObj) {
    state.roomObj.roomId = roomObj.roomId
    state.roomObj.answer = roomObj.answer
    state.roomObj.isEmpty = roomObj.isEmpty
    state.roomObj.points = roomObj.poits
    state.roomObj.theme = roomObj.theme
  },
  setTheme(state, themeName) {
    console.log(`setThemeName${themeName}`)
    state.theme = themeName
  },
}

export const actions = {
  async createRoom({ commit, dispatch }, { roomId, themeName, user }) {
    roomsRef.doc(roomId).set({
      answer: ['', '', '', ''],
      isEmpty: true,
      points: [0, 0, 0, 0],
      theme: themeName,
    })
    await roomsRef.doc(roomId).collection('users').doc(user.uid).set({
      displayName: user.displayName,
      photoURL: user.photoURL,
      userNum: 0,
    })
    await dispatch('syncFirestore', { roomId })
  },
  async getIsEmpty({ commit }, { roomId }) {
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
  async joinRoom({ dispatch }, { roomId, user }) {
    // 参加済みのユーザー追加
    dispatch('syncFirestore', { roomId })
    // 参加済みの人数を取得
    let userNum = 0
    userNum =
      Math.max.apply(
        null,
        state.roomObj.users.map((o) => o.userNum)
      ) + 1
    // firestoreに自分のuser情報を挿入
    await roomsRef
      .doc(roomId)
      .collection('users')
      .doc(user.uid)
      .set({
        displayName: user.displayName,
        photoURL: user.photoURL,
        userNum: userNum + 1,
      })
    // commit('pushUser', user)
    // 最大人数に達すればisEmpty更新
    if (userNum + 1 >= 3) {
      await roomsRef.doc(roomId).update({
        isEmpty: false,
      })
    }
  },
  syncFirestore({ commit }, { roomId }) {
    roomsRef.doc(roomId).onSnapshot((doc) => {
      let roomObj = {}
      roomObj = doc.data()
      roomObj.roomId = doc.id
      commit('setRoomObj', roomObj)
      // console.log('Current room: ', doc.data())
    })
    roomsRef
      .doc(roomId)
      .collection('users')
      .orderBy('userNum', 'asc')
      .onSnapshot((snapshot) => {
        let count = 0
        const users = []
        snapshot.forEach((doc) => {
          const userData = doc.data()
          // console.log('Current users: ', doc.data)
          users.push({
            ...doc.data(),
            uid: doc.id,
          })
          count++
          if (userData.userNum === 3) {
            roomsRef
              .doc(this.roomId)
              .collection('users')
              .onSnapshot(() => {})
          }
        })
        for (let i = count; i < 4; i++) {
          users.push(unknownUser)
        }
        commit('setUsers', users)
      })
  },
  unsubRoom() {
    roomsRef.doc(this.roomId).onSnapshot(() => {})
  },
}

export const getters = {}
