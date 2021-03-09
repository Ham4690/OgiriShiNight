import firebase from '@/plugins/firebase'
const roomsRef = firebase.firestore().collection('rooms')

export const state = () => ({
  roomObj: {
    roomId: '',
    users: [],
    answer: ['', '', '', ''],
    isEmpty: false,
    theme: '',
    points: [0, 0, 0, 0],
    scored: [false, false, false, false],
  },
  myUserNum: 0,
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
    state.roomObj.points = roomObj.points
    state.roomObj.theme = roomObj.theme
    state.roomObj.scored = roomObj.scored
  },
  setMyUserNum(state, num) {
    state.myUserNum = num
  },
}

export const actions = {
  async createRoom({ commit, dispatch }, { roomId, themeName, user }) {
    roomsRef.doc(roomId).set({
      answer: ['', '', '', ''],
      isEmpty: true,
      points: [0, 0, 0, 0],
      theme: themeName,
      scored: [false, false, false, false],
    })
    await roomsRef.doc(roomId).collection('users').doc(user.uid).set({
      displayName: user.displayName,
      photoURL: user.photoURL,
      userNum: 0,
    })
    await dispatch('syncFirestore', { roomId })
    commit('setMyUserNum', 0)
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
  async joinRoom({ commit, dispatch }, { roomId, user }) {
    // 参加済みのユーザー追加
    dispatch('syncFirestore', { roomId })
    // 参加済みの人数を取得
    let userNum = 0
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
      })
    commit('setMyUserNum', userNum + 1)
    console.log(userNum + 1)
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
      console.log('syncFirestore:' + roomObj.answer)

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
          users.push({
            displayName: 'None',
            photoURL: '',
            userNum: i,
            uid: 'ZZZZZ',
          })
        }
        commit('setUsers', users)
      })
  },
  unsubRoom() {
    roomsRef.doc(this.roomId).onSnapshot(() => {})
  },
  setMyAnswer({ state }, { myAnswer }) {
    const answer = state.roomObj.answer
    answer[state.myUserNum] = myAnswer
    console.log(answer)
    roomsRef.doc(state.roomObj.roomId).update({
      answer,
    })
  },
  setNoAnswer({ state }, { noAnswer }) {
    const stateAnswer = state.roomObj.answer
    const answer = stateAnswer.map((ans) => {
      if (ans === '') {
        return noAnswer
      }
      return ans
    })
    roomsRef.doc(state.roomObj.roomId).update({
      answer,
    })
  },
  setPointAndScored({ state }, { points }) {
    const statePoints = state.roomObj.points
    console.log('points', points)
    console.log('roomObj', state.roomObj)
    console.log('statePoints', statePoints)
    for (let i = 0; i < 4; i++) {
      statePoints[i] += points[i]
    }
    console.log('statePoints', statePoints)
    const scored = state.roomObj.scored
    scored[state.myUserNum] = true
    roomsRef.doc(state.roomObj.roomId).update({
      points: statePoints,
      scored,
    })
  },
  deleteRooms() {},
}

export const getters = {}
