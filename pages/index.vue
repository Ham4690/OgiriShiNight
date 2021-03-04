/* eslint-disable vue/no-lone-template */
<template>
  <div class="container">
    <div>
      <h1 class="title">ogiri-shi-night</h1>

      <div v-if="isAuth">
        <nuxt-link v-if="isAuth" to="/answer" class="anslink">
          <b-button variant="outline-danger"> play </b-button>
        </nuxt-link>
      </div>

      <div class="links">
        <a
          href="https://nuxtjs.org/"
          target="_blank"
          rel="noopener noreferrer"
          class="button--green"
        >
          Documentation
        </a>
        <a
          href="https://github.com/nuxt/nuxt.js"
          target="_blank"
          rel="noopener noreferrer"
          class="button--grey"
        >
          GitHub
        </a>
        <button
          v-if="isAuth"
          href=""
          target="_blank"
          rel="noopener noreferrer"
          class="button--grey"
          @click="signOut"
        >
          signOut
        </button>
        <button
          v-else
          target="_blank"
          rel="noopener noreferrer"
          class="button--green"
          @click="googleAuth"
        >
          signIn
        </button>
      </div>

      <h3 v-if="isAuth">Hi, {{ user.displayName }}</h3>
      <h3 v-else>Who are you?</h3>
    </div>
  </div>
</template>

<script>
// import LoginModal from '~/components/LoginModal'
import firebase from 'firebase'
import { firestore } from '~/plugins/firebase.js'

export default {
  name: 'HomePage',
  components: {},
  data() {
    return {
      isAuth: false,
      user: {
        uid: '',
        displayName: '',
        photoURL: '',
      },
    }
  },
  mounted() {
    firebase.auth().onAuthStateChanged((user) => (this.isAuth = !!user))
  },
  created() {
    if (localStorage.getItem('accessToken')) {
      const uid = localStorage.getItem('uid')
      firestore
        .collection('users')
        .doc(uid)
        .get()
        .then((doc) => {
          if (doc.exists) {
            console.log('Document data:', doc.data())
            this.user = doc.data()
            this.isAuth = true
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
  methods: {
    googleAuth() {
      const authUI = new firebase.auth.GoogleAuthProvider()
      // This gives you a the Google OAuth 1.0 Access Token and Secret.
      firebase
        .auth()
        .signInWithPopup(authUI)
        .then((result) => {
          this.isAuth = true
          localStorage.setItem('accessToken', result.credential.accessToken)
          localStorage.setItem('uid', result.user.uid)
          this.user = {
            uid: result.user.uid,
            displayName: result.user.displayName,
            photoURL: result.user.photoURL,
          }
          const userStore = firestore.collection('users').doc(result.user.uid)
          userStore
            .set({
              displayName: result.user.displayName,
              photURL: result.user.photoURL,
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
    signOut() {
      firebase.auth().signOut()
      localStorage.removeItem('accessToken')
      localStorage.removeItem('uid')
    },
  },
}
</script>

<style>
.container {
  margin: 0 auto;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.title {
  font-family: 'Quicksand', 'Source Sans Pro', -apple-system, BlinkMacSystemFont,
    'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  display: block;
  font-weight: 300;
  font-size: 100px;
  color: #35495e;
  letter-spacing: 1px;
}

.subtitle {
  font-weight: 300;
  font-size: 42px;
  color: #526488;
  word-spacing: 5px;
  padding-bottom: 15px;
}

.links {
  padding-top: 15px;
}

/* answerページへのリンク  */
.anslink {
  color: #35495e;
}
</style>
