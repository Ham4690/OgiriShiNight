import firebase from '@/plugins/firebase'
const answersRef = firebase.firestore().collection('answers')
const themesRef = firebase.firestore().collection('themes')

export const state = () => ({
  answers: [],
})

export const mutations = {
  setMyAnswers(state, myAnswers) {
    state.answers = myAnswers
  },
}

export const actions = {
  setMyAnswer({ commit }, obj) {
    console.log(obj)
    answersRef
      .add({
        themeid: obj.themeid,
        uid: obj.uid,
        answer: obj.answer,
        createdat: firebase.firestore.FieldValue.serverTimestamp(),
      })
      .then((docRef) => {
        console.log('Document written with ID: ', docRef.id)
      })
      .catch((error) => {
        console.error('Error adding document: ', error)
      })
  },
  async getMyAnswers({ commit }, { uid }) {
    console.log('get')
    const querySnapshot = await answersRef.where('uid', '==', uid).get()
    const getMyAnswers = querySnapshot.docs.map(async (doc) => {
      let theme = ''
      const themeDoc = await themesRef.doc(doc.data().themeid).get()
      console.log(themeDoc)
      theme = themeDoc.data().theme
      const data = doc.data()
      data.createdat = data.createdat.toDate().toLocaleString('ja')
      data.theme = theme
      return data
    })
    const myAnswers = await Promise.all(getMyAnswers)
    commit('setMyAnswers', myAnswers)
  },
}

export const getters = {}
