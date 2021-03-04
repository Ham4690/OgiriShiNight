// import { firestoreAction } from 'vuexfire'
import firebase from '@/plugins/firebase'

const db = firebase.firestore()
const themesRef = db.collection('themes')

export const state = () => ({
  themes: [],
})

export const mutations = {
  addTheme(state, theme) {
    state.themes.push(theme)
  },
}

export const actions = {
  // init: firestoreAction(({ bindFirestoreRef }) => {
  //   bindFirestoreRef('themes', themesRef)
  // }),
  // fetchTheme: ({ state }, id) => {
  //   console.log(state.themes)
  //   return state.themes[id]
  // },
  fetchThemes({ commit }) {
    themesRef
      .get()
      .then((res) => {
        res.forEach((doc) => {
          console.log('success : ' + `${doc.id} => ${doc.data()}`)
          commit('addTheme', doc.data())
        })
      })
      .catch((error) => {
        console.log('error : ' + error)
      })
  },
  addTheme({ commit }, theme) {
    console.log(theme)
    themesRef
      .add({
        theme: theme.theme,
      })
      .then(function (docRef) {
        console.log('Document written with ID: ', docRef.id)
        commit('addTheme', theme)
      })
      .catch(function (error) {
        console.error('Error adding document: ', error)
      })
  },
}
export const getters = {
  getThemes(state) {
    return state.themes
  },
}
