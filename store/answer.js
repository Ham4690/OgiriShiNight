import { firestoreAction } from 'vuexfire'
import firebase from '@/plugins/firebase'

const db = firebase.firestore()
const themesRef = db.collection('themes')

export const state = () => ({
  themes: [],
})

export const actions = {
  init: firestoreAction(({ bindFirestoreRef }) => {
    bindFirestoreRef('themes', themesRef)
  }),
  fetchTheme: ({ state }, id) => {
    console.log(state.themes)
    return state.themes[id]
  },
}

export const getters = {}
