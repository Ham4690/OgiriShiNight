import firebase from 'firebase'

if (!firebase.apps.length) {
  firebase.initializeApp(
    {
        apiKey: "AIzaSyBF4r0zwuaANJIW3N4e5ctrlhavOa_lLxU",
        authDomain: "ogiri-shi-night.firebaseapp.com",
        databaseURL: "https://ogiri-shi-night.firebaseio.com",
        projectId: "ogiri-shi-night",
        storageBucket: "ogiri-shi-night.appspot.com",
        messagingSenderId: "575718904682",
        appId: "1:575718904682:web:28619b839d2a456db54b13",
        measurementId: "G-9KMR9MF9X9"

    }
  )
}

export default firebase

