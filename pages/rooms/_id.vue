<template>
  <b-container>
    <div class="roomId">
      room ID:
      {{ roomObj.roomId }}
    </div>
    <!-- 確認用コード -->
    <p>your Num : {{ myUserNum }}</p>
    <!-- ここまで -->
    <template v-if="roomObj.isEmpty != true">
      <countdown v-if="counting" :time="59 * 1000" @end="timeUp">
        <template slot-scope="props">
          あと：{{ props.seconds }} 秒
          <!-- <span v-if="props.seconds === 0"> {{ timeUp() }} </span> -->
        </template>
      </countdown>
    </template>

    <b-row class="usersIconDisplayArea">
      <b-col
        v-for="(user, index) in roomObj.users"
        :key="user.userNum"
        class="userIconArea"
      >
        <b-avatar :src="user.photoURL"></b-avatar>
        <h6>{{ user.displayName }}</h6>
        <template v-if="roomObj.answer[index] !== ''">done!!</template>
      </b-col>
    </b-row>
    <hr />
    <!-- 本番動作確認コメントをはずす -->
    <!-- <div> -->
    <template v-if="roomObj.isEmpty == true">
      <h1>参加者が4名集まるまでお待ちください</h1>
    </template>
    <template v-else>
      <div class="themeArea">
        <h1>{{ roomObj.theme }}</h1>
        <hr />
      </div>
      <div>
        <b-form-input
          v-model="myAnswer"
          placeholder="Please your answer"
        ></b-form-input>
        <div class="mt-2">Value: {{ myAnswer }}</div>
      </div>
      <b-button variant="outline-primary" @click="checkInput">決定</b-button>
    </template>
    <!-- まだ退出機能ができてないのでコメントアウト -->
    <!-- <button @click="returnTop">Topへ戻る</button> -->
  </b-container>
</template>

<script>
import { mapState } from 'vuex'

export default {
  data() {
    return {
      myAnswer: '',
      done: false,
      ready: false,
      checked: false,
      counting: true,
    }
  },
  computed: {
    ...mapState('room', ['roomObj', 'myUserNum']),
  },
  watch: {
    'roomObj.answer'(answer) {
      // console.log('watch')
      // console.log(answer.filter((ans) => ans === '').length)
      // test
      // if (answer.filter((ans) => ans === '').length === 3) {
      if (answer.filter((ans) => ans === '').length === 0) {
        const resultUrl = '/rooms/' + this.myUserNum + '/result'
        this.$router.push(resultUrl)
      }
    },
  },
  created() {
    console.log('created')
  },
  methods: {
    timeUp() {
      this.counting = false
      if (!this.checked) {
        this.myAnswer = 'No Answer:時間切れ'
        this.$store.dispatch('room/setMyAnswer', {
          myAnswer: this.myAnswer,
        })
      }
      // window.alert('time up!!!' + this.myAnswer)
    },
    checkInput() {
      if (!this.myAnswer) {
        // console.log('empty')
      } else {
        const check = window.confirm('この回答でよろしいですか?')
        if (check) {
          this.$store.dispatch('room/setMyAnswer', {
            myAnswer: this.myAnswer,
          })
          this.checked = true
        }
      }
    },
    timerStart() {
      this.ready = true
    },
    returnTop() {
      this.$router.push('/')
    },
    wait(ms) {
      for (let i = 0; i < ms; i++) {
        console.log('wait now')
      }
    },
  },
}
</script>

<style>
.roomId {
  text-align: left;
}

.themeArea {
  text-align: center;
}
.usersIconDisplayArea {
  margin-top: 10px;
}

.userIconArea {
  display: inline-block;
  text-align: center;
  width: 200px;
}
</style>
