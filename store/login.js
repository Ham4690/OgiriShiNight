import firebase from 'firebase'
import { firestore } from '~/plugins/firebase.js'

export const state = () => ({
  isAuth: false,
  user: {
    uid: '',
    displayName: '',
    photoURL: '',
  },
})

export const mutations = {
  setUser(state, user) {
    state.user = user
  },
  setIsAuth(state, isAuth) {
    state.isAuth = isAuth
  },
}

export const actions = {
  isSignedIn({ commit, state }) {
    let result = false
    firebase.auth().onAuthStateChanged((user) => (result = !!user))
    commit('setIsAuth', result)
  },
  signedInPreviously({ commit }) {
    if (localStorage.getItem('accessToken')) {
      const userid = localStorage.getItem('uid')
      firestore
        .collection('users')
        .doc(userid)
        .get()
        .then((doc) => {
          if (doc.exists) {
            const uidData = doc.data()
            const user = {
              uid: userid,
              displayName: uidData.displayName,
              photoURL: uidData.photoURL,
            }
            commit('setUser', user)
            commit('setIsAuth', true)
          } else {
            // doc.data() will be undefined in this case
            console.log('No such document!')
          }
        })
        .catch((error) => {
          console.log('Error getting document:', error)
        })
    }
  },
  signInWithGoogle({ commit }) {
    const authUI = new firebase.auth.GoogleAuthProvider()
    // This gives you a the Google OAuth 1.0 Access Token and Secret.
    firebase
      .auth()
      .signInWithPopup(authUI)
      .then((result) => {
        localStorage.setItem('accessToken', result.credential.accessToken)
        localStorage.setItem('uid', result.user.uid)
        const user = {
          uid: result.user.uid,
          displayName: result.user.displayName,
          photoURL: result.user.photoURL,
        }
        commit('setUser', user)
        commit('setIsAuth', true)
        const userStore = firestore.collection('users').doc(result.user.uid)
        userStore
          .set({
            displayName: result.user.displayName,
            photoURL: result.user.photoURL,
          })
          .then(() => {
            console.log('Document successfully written!')
          })
          .catch((error) => {
            console.error('Error writing document: ', error)
          })
        console.log('firestoreに保存したにゃ')
      })
      .catch((error) => {
        console.log(error)
      })
  },
  signOut({ commit }) {
    firebase.auth().signOut()
    const user = {
      uid: '',
      displayName: '',
      photoURL: '',
    }
    commit('setUser', user)
    commit('setIsAuth', false)
    localStorage.removeItem('accessToken')
    localStorage.removeItem('uid')
  },
}

export const getters = {
  user: (state) => {
    return state.user
  },
  isAuth: (state) => {
    return state.isAuth
  },
}
