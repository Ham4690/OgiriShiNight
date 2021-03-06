// import { firestoreAction } from 'vuexfire'
import firebase from '@/plugins/firebase'

const db = firebase.firestore()
const themesRef = db.collection('themes')
const themeNum = 4

export const state = () => ({
  themes: [],
  theme: [],
  themeName: '',
  themeId: 0,
})

export const mutations = {
  addTheme(state, theme) {
    state.theme.push(theme)
  },
  setThemeName(state, themeName) {
    console.log(`setThemeName${themeName}`)
    state.themeName = themeName
  },
  setThemeId(state, themeId) {
    console.log(`setThemeId${themeId}`)
    state.themeId = themeId
  },
}

export const actions = {
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
  fetchRandomTheme({ commit }) {
    const randNum = Math.floor(Math.random() * themeNum)
    console.log('randNum')
    console.log(randNum)
    themesRef
      .where('themeid', '==', randNum)
      .get()
      .then((res) => {
        res.forEach((doc) => {
          console.log('success : ' + `${doc.id} => ${doc.data()}`)
          const obj = doc.data()
          console.log(`JSON:${obj},${obj.theme},${obj.themeid}`)
          commit('addTheme', doc.data())
          commit('setThemeName', obj.theme)
          commit('setThemeId', obj.themeid)
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
