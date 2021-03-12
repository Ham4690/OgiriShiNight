import firebase from '@/plugins/firebase'
const waitingUsersRef = firebase.firestore().collection('waitingUsers')

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
  setMyUserNum(state, num) {
    state.myUserNum = num
  },
}

export const actions = {
  // eslint-disable-next-line no-empty-pattern
  waiting({}, { uid }) {
    waitingUsersRef.doc(uid).set({
      status: 'waiting',
      updatedat: firebase.firestore.FieldValue.serverTimestamp(),
      roomId: '',
    })
  },
}

export const getters = {}
