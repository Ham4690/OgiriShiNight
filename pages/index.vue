/* eslint-disable vue/no-lone-template */
<template>
  <div class="container">
    <div>
      <h1 class="title">ogiri-shi-night</h1>

      <div v-if="isAuth">
        <nuxt-link v-if="isAuth" to="/answer" class="anslink">
          <b-button style="margin: 10px" variant="outline-danger">
            play
          </b-button>
        </nuxt-link>
      </div>

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
      <img
        border="0"
        :src="user.photoURL"
        width="128"
        height="128"
        alt="icon"
      />

      <h3 v-if="isAuth">Hi, {{ user.displayName }}</h3>
      <h3 v-else>Who are you?</h3>

      <div>
        <b-button @click="$bvModal.show('modal-scoped1')">部屋を作る</b-button>
        <b-modal id="modal-scoped1">
          <p class="my-4">部屋番号を入力するにゃ</p>
          <input v-model="roomId" placeholder="部屋番号" />

          <template #modal-footer="{ cancel }">
            <b-button size="sm" variant="danger" to="/answer"> 作成 </b-button>
            <b-button size="sm" variant="danger" @click="cancel()">
              Cancel
            </b-button>
          </template>
        </b-modal>
        <b-button @click="$bvModal.show('modal-scoped2')">部屋に入る</b-button>
        <b-modal id="modal-scoped2">
          <p class="my-4">部屋番号を入力するにゃ</p>
          <input v-model="roomId" placeholder="部屋番号" />

          <template #modal-footer="{ cancel }">
            <b-button size="sm" variant="danger" to="/answer"> 入室 </b-button>
            <b-button size="sm" variant="danger" @click="cancel()">
              Cancel
            </b-button>
          </template>
        </b-modal>
      </div>
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
      roomId: '',
    }
  },
  mounted() {
    firebase.auth().onAuthStateChanged((user) => (this.isAuth = !!user))
  },
  created() {
    if (localStorage.getItem('accessToken')) {
      const userid = localStorage.getItem('uid')
      firestore
        .collection('users')
        .doc(userid)
        .get()
        .then((doc) => {
          if (doc.exists) {
            const uidData = doc.data()
            this.user = {
              uid: userid,
              displayName: uidData.displayName,
              photoURL: uidData.photoURL,
            }
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
          console.log(this.user.photoURL)
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

button {
  padding-top: 15px;
}

/* answerページへのリンク  */
.anslink {
  margin-bottom: 15px;
  color: #35495e;
}
</style>
