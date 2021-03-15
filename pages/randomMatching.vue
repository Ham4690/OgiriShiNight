/* eslint-disable vue/no-lone-template */
<template>
  <div class="container">
    <div>
      <h1 class="title">ogiri-shi-night</h1>
      <hr />
      <br />
      <br />
      <br />
      <br />
      <div v-if="minuteFlg">参加者が見つかりませんでした。。。</div>
      <div v-else>
        <b-spinner
          style="width: 3rem; height: 3rem"
          variant="primary"
          label="Large Spinner"
        ></b-spinner>
      </div>
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <div v-if="!minuteFlg">
        {{ waitingUserObj.waitingNum }}/4人が集まっています。
      </div>
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <b-button size="sm" variant="danger" class="mt-3" @click="returnTop">
        戻る
      </b-button>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'WaitingPage',
  components: {},
  data() {
    return {
      minuteFlg: false,
    }
  },
  computed: {
    ...mapState('waitingUsers', ['waitingUserObj']),
    ...mapState('login', ['user']),
  },
  watch: {
    'waitingUserObj.status'(status) {
      if (status === 'enableJoinRoom') {
        this.$store.dispatch('room/syncRoombyRandom', {
          roomId: this.waitingUserObj.roomId,
          myUserNum: this.waitingUserObj.userNum,
        })
        setTimeout(() => {
          const roomUrl = '/rooms/' + this.waitingUserObj.roomId
          this.$router.push(roomUrl)
        }, 1000)
      }
    },
  },
  mounted() {},
  created() {
    setTimeout(() => {
      this.minuteFlg = true
      // console.log('minuteFlg = true')
    }, 60 * 1000)
  },
  methods: {
    returnTop() {
      this.$store.dispatch('waitingUsers/returnTop', { uid: this.user.uid })
      this.$router.push('/')
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
