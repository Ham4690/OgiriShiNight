import firebase from '@/plugins/firebase'
const waitingUsersRef = firebase.firestore().collection('waitingUsers')

export const state = () => ({
  waitingUserObj: {
    displayName: '',
    photoURL: '',
    status: 'waiting',
    roomId: '',
    waitingNum: 0,
    userNum: 0,
    updatedat: firebase.firestore.FieldValue.serverTimestamp(),
  },
})

export const mutations = {
  setWaitingUser(state, waitingUserObj) {
    state.waitingUserObj = JSON.parse(JSON.stringify(waitingUserObj))
  },
}

export const actions = {
  async waiting({ commit }, { user }) {
    await waitingUsersRef.doc(user.uid).set({
      displayName: user.displayName,
      photoURL: user.photoURL,
      status: 'waiting',
      roomId: '',
      waitingNum: 0,
      userNum: 0,
      updatedat: firebase.firestore.FieldValue.serverTimestamp(),
    })
    waitingUsersRef.doc(user.uid).onSnapshot((doc) => {
      let waitingUserObj = {}
      waitingUserObj = doc.data()
      console.log('syncWaitingUser:' + waitingUserObj.status)

      commit('setWaitingUser', waitingUserObj)
      if (waitingUserObj.status === 'enableJoinRoom') {
        waitingUsersRef.doc(user.uid).onSnapshot(() => {})
      }
    })
  },
  // eslint-disable-next-line no-empty-pattern
  returnTop({}, { uid }) {
    waitingUsersRef.doc(uid).update({
      status: 'exited',
    })
    waitingUsersRef.doc(uid).onSnapshot(() => {})
  },
}

export const getters = {}
