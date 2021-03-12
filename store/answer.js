// import { firestoreAction } from 'vuexfire'
import firebase from '@/plugins/firebase'

const db = firebase.firestore()
const themesRef = db.collection('themes')

export const state = () => ({
  themes: [],
  theme: [],
  themeName: '',
  themeId: 0,
  themeDocId: '',
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
  setThemeDocId(state, themeDocId) {
    console.log(`setThemeDocId${themeDocId}`)
    state.themeDocId = themeDocId
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
  async fetchRandomTheme({ commit }) {
    let themeNum = 0
    await themesRef
      .orderBy('themeid', 'desc')
      .limit(1)
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          const themeData = doc.data()
          themeNum = themeData.themeid
        })
      })
    const randNum = Math.floor(Math.random() * (themeNum + 1))
    console.log('randNum', randNum)
    await themesRef
      .where('themeid', '==', randNum)
      .get()
      .then((res) => {
        res.forEach((doc) => {
          console.log('success : ' + `${doc.id} => ${doc.data()}`)
          const obj = doc.data()
          // console.log(`JSON:${obj},${obj.theme},${obj.themeid}`)
          commit('addTheme', doc.data())
          commit('setThemeName', obj.theme)
          commit('setThemeId', obj.themeid)
          commit('setThemeDocId', doc.id)
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
  async getThemeDocId({ commit }, obj) {
    const querySnapshot = await themesRef.where('theme', '==', obj.theme).get()
    console.log(querySnapshot)
    commit('setThemeDocId', querySnapshot.docs[0].id)
  },
}
