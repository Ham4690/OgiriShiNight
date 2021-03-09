/* eslint-disable vue/no-lone-template */
<template>
  <div class="container">
    <div>
      <h1 class="title">ogiri-shi-night</h1>
      <hr />

      <!-- <div v-if="isAuth">
        <nuxt-link v-if="isAuth" to="/answer" class="anslink">
          <b-button style="margin: 10px" variant="danger" size="lg">
            play
          </b-button>
        </nuxt-link>
      </div> -->

      <template v-if="user.photoURL">
        <b-avatar :src="user.photoURL" class="mt-4" size="6rem"> </b-avatar>
      </template>

      <h3 v-if="isAuth">Hi, {{ user.displayName }}</h3>
      <h3 v-else>Who are you?</h3>

      <div v-if="isAuth">
        <b-button
          variant="dark"
          size="lg"
          @click="$bvModal.show('modal-scoped1')"
          >部屋を作る</b-button
        >
        <b-modal id="modal-scoped1" title="部屋を作る" hide-footer>
          <p class="my-4">部屋番号を入力するにゃ</p>
          <input v-model="roomId" placeholder="部屋番号" />

          <!-- <template #modal-footer="{ cancel }"> -->
          <b-button size="sm" variant="danger" @click="createRoom">
            作成
          </b-button>
          <b-button
            size="sm"
            variant="danger"
            @click="hideModal('modal-scoped1')"
          >
            Cancel
          </b-button>
          <!-- </template> -->
        </b-modal>
        <b-button
          variant="dark"
          size="lg"
          @click="$bvModal.show('modal-scoped2')"
          >部屋に入る</b-button
        >
        <b-modal id="modal-scoped2" title="部屋に入る" hide-footer>
          <p class="my-4">部屋番号を入力するにゃ</p>
          <input v-model="roomId" placeholder="部屋番号" />

          <!-- <template #modal-footer="{ cancel }"> -->
          <b-button size="sm" variant="danger" @click="joinRoom">
            入室
          </b-button>
          <b-button
            size="sm"
            variant="danger"
            @click="hideModal('modal-scoped2')"
          >
            Cancel
          </b-button>
          <!-- </template> -->
        </b-modal>
      </div>

      <b-button
        v-if="isAuth"
        href=""
        target="_blank"
        rel="noopener noreferrer"
        class="mt-3"
        size="lg"
        variant="success"
        @click="signOut"
      >
        signOut
      </b-button>
      <b-button
        v-else
        target="_blank"
        rel="noopener noreferrer"
        variant="success"
        @click="signInWithGoogle"
      >
        signIn
      </b-button>
      <b-button v-if="isAuth" variant="dark" size="lg" @click="getMyAnswer"
        >過去の自分の回答</b-button
      >
      <b-modal id="modal-my-answer" title="自分の回答" hide-footer>
        <b-row v-for="myAnswer in answers" :key="myAnswer.userNum">
          <p>{{ myAnswer.theme }}</p>
          <p>{{ myAnswer.answer }}</p>
          <p>{{ myAnswer.createdat }}</p>
        </b-row>
        <!-- <template #modal-footer="{ cancel }"> -->
        <b-button
          size="sm"
          variant="danger"
          @click="hideModal('modal-my-answer')"
        >
          戻る
        </b-button>
        <!-- </template> -->
      </b-modal>
      <br />
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'HomePage',
  components: {},
  data() {
    return {
      roomId: '',
    }
  },
  computed: {
    ...mapState('login', ['user', 'isAuth']),
    ...mapState({ roomObjUsers: (state) => state.room.roomObj.users }),
    ...mapState('answer', ['themeName']),
    ...mapState('answers', ['answers']),
  },
  watch: {
    roomObjUsers(obj) {
      const roomUrl = '/rooms/' + this.roomId
      this.$router.push(roomUrl)
    },
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
    async createRoom() {
      await this.$store.dispatch('answer/fetchRandomTheme')
      console.log(this.themeName)
      this.$store.dispatch('room/createRoom', {
        roomId: this.roomId,
        user: this.user,
        themeName: this.themeName,
      })
    },
    async joinRoom() {
      // 部屋があるか
      // isEmptyがtrueか
      await this.$store.dispatch('room/getIsEmpty', {
        roomId: this.roomId,
      })
      console.log('empty is ' + `${this.$store.state.room.roomObj.isEmpty}`)
      if (this.$store.state.room.roomObj.isEmpty === true) {
        this.$store.dispatch('room/joinRoom', {
          roomId: this.roomId,
          user: this.user,
        })
      } else {
        alert('にゃにゃ？！\nそのIDの部屋は存在しないか人数が一杯にゃ')
      }
    },
    hideModal(modalName) {
      this.$bvModal.hide(modalName)
    },
    getMyAnswer() {
      this.$store.dispatch('answers/getMyAnswers', {
        uid: this.user.uid,
      })
      this.$bvModal.show('modal-my-answer')
    },
  },
}
</script>

<style>
.container {
  margin: 0 auto;
  min-height: 100vh;
  justify-content: center;
  align-items: center;
  text-align: center;
  max-width: 100%;
}

.title {
  font-family: 'Quicksand', 'Source Sans Pro', -apple-system, BlinkMacSystemFont,
    'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  display: block;
  font-weight: 300;
  font-size: 100px;
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

footer {
  display: inline;
}
</style>
