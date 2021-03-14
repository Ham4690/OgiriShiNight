// import firebase from 'firebase'
import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'

if (!firebase.apps.length) {
  firebase.initializeApp({
    apiKey: process.env.FB_API_KEY,
    authDomain: process.env.FB_AUTH_DOMAIN,
    databaseURL: process.env.FB_DATABASE_URL,
    projectId: process.env.FB_PROJECTID,
    storageBucket: process.env.FB_STORAGE_BUCKET,
    messagingSenderId: process.env.FB_MESSAGING_SENDER_ID,
    appId: process.env.FB_APP_ID,
    measurementId: process.env.FB_MEASUREMENT_ID,
  })
  // const isEmulating = window.location.hostname === 'localhost'
  // if (isEmulating) {
  //   firebase.auth().useEmulator('http://localhost:9099')
  //   firebase.functions().useEmulator('localhost', 5001)
  //   firebase.firestore().useEmulator('localhost', 8080)
  // }
}

export default firebase
