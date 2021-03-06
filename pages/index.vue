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
        @click="signInWithGoogle"
      >
        signIn
      </button>

      <h3 v-if="isAuth">Hi, {{ user.displayName }}</h3>
      <h3 v-else>Who are you?</h3>
      <template v-if="user.photoURL">
        <img
          style="border-radius: 50%"
          border="0"
          :src="user.photoURL"
          width="50"
          height="50"
          alt="icon"
        />
      </template>

      <div>
        <b-button @click="$bvModal.show('modal-scoped1')">部屋を作る</b-button>
        <b-modal id="modal-scoped1">
          <p class="my-4">部屋番号を入力するにゃ</p>
          <input v-model="roomId" placeholder="部屋番号" />

          <template #modal-footer="{ cancel }">
            <b-button size="sm" variant="danger" @click="toRoom">
              作成
            </b-button>
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
            <b-button size="sm" variant="danger" @click="toRoom">
              入室
            </b-button>
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
import { mapGetters } from 'vuex'

export default {
  name: 'HomePage',
  components: {},
  data() {
    return {
      roomId: '',
    }
  },
  computed: {
    ...mapGetters({
      user: 'login/user',
      isAuth: 'login/isAuth',
    }),
  },
  mounted() {
    this.$store.dispatch('login/isSignedIn')
  },
  created() {
    this.$store.dispatch('login/signedInPreviously')
  },
  methods: {
    signInWithGoogle() {
      this.$store.dispatch('login/signInWithGoogle')
    },
    signOut() {
      this.$store.dispatch('login/signOut')
    },
    toRoom() {
      const roomUrl = '/rooms/' + this.roomId
      this.$router.push(roomUrl)
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
