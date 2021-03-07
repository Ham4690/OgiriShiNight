import firebase from '@/plugins/firebase'
const roomsRef = firebase.firestore().collection('rooms')

const roomObjInit = {
  roomId: '',
  users: [],
  answer: ['', '', '', ''],
  isEmpty: false,
  theme: '',
  points: [0, 0, 0, 0],
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
  setRoomId: (state, roomId) => {
    state.roomObj.roomId = roomId
  },
  setUsers(state, user) {
    state.roomObj.users = JSON.parse(JSON.stringify(user))
    console.log('setUser', state.roomObj)
  },
  setIsEmpty(state, isEmpty) {
    state.roomObj.isEmpty = isEmpty
  },
  initRoomObj(state) {
    state.roomObj = JSON.parse(JSON.stringify(roomObjInit))
  },
  setRoomObj(state, roomObj) {
    const stateUsers = state.roomObj.users
    state.roomObj = JSON.parse(JSON.stringify(roomObj))
    state.roomObj.users = JSON.parse(JSON.stringify(stateUsers))
  },
}

export const actions = {
  async createRoom({ commit, dispatch }, { roomId, user }) {
    commit('initRoomObj')
    await roomsRef.doc(roomId).set({
      answer: ['', '', '', ''],
      isEmpty: true,
      points: [0, 0, 0, 0],
      theme: '',
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
  async joinRoom({ commit, state, dispatch }, { roomId, user }) {
    // let isEmpty = true
    // 参加済みのユーザー追加
    commit('initRoomObj')
    await dispatch('syncFirestore', { roomId })
    // commit('setRoomId', roomId)
    // await roomsRef
    //   .doc(roomId)
    //   .collection('users')
    //   .get()
    //   .then((querySnapshot) => {
    //     querySnapshot.forEach((doc) => {
    //       const userData = doc.data()
    //       const userObj = {
    //         uid: doc.id,
    //         displayName: userData.displayName,
    //         photoURL: userData.photoURL,
    //         userNum: userData.userNum,
    //       }
    //       commit('pushUser', userObj)
    //     })
    //   })
    //   .catch((error) => {
    //     console.log('Error getting documents: ', error)
    //   })
    // // テーマ取得
    // await roomsRef
    //   .doc(roomId)
    //   .get()
    //   .then((doc) => {
    //     commit('setTheme', doc.data().theme)
    //   })
    // 参加済みの人数を取得
    user.userNum =
      Math.max.apply(
        null,
        state.roomObj.users.map((o) => o.userNum)
      ) + 1
    // firestoreに自分のuser情報を挿入
    await roomsRef.doc(roomId).collection('users').doc(user.uid).set({
      displayName: user.displayName,
      photoURL: user.photoURL,
      userNum: user.userNum,
    })
    // commit('pushUser', user)
    // 最大人数に達すればisEmpty更新
    if (user.userNum === 3) {
      await roomsRef.doc(roomId).update({
        isEmpty: false,
      })
    }
  },
  syncFirestore({ commit, state }, { roomId }) {
    roomsRef.doc(roomId).onSnapshot((doc) => {
      let roomObj = {}
      roomObj = doc.data()
      roomObj.roomId = doc.id
      commit('setRoomObj', roomObj)
      console.log('Current room: ', doc.data())
    })
    roomsRef
      .doc(roomId)
      .collection('users')
      .orderBy('userNum', 'asc')
      .onSnapshot((snapshot) => {
        const users = []
        snapshot.forEach((doc) => {
          const userData = doc.data()
          console.log('Current users: ', doc.data)
          users.push({
            ...doc.data(),
            uid: doc.id,
          })
          commit('setUsers', users)
          if (userData.userNum === 3) {
            roomsRef
              .doc(this.roomId)
              .collection('users')
              .onSnapshot(() => {})
          }
        })
      })
  },
  unsubRoom() {
    roomsRef
      .doc(this.roomId)
      .collection('users')
      .onSnapshot(() => {})
  },
}

export const getters = {}
