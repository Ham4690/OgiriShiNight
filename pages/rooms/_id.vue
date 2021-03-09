<template>
  <div class="container">
    <div class="roomId">
      room ID:
      {{ roomObj.roomId }}
    </div>
    <!-- 確認用コード -->
    <!-- <p>your Num : {{ myUserNum }}</p> -->
    <!-- ここまで -->
    <template v-if="roomObj.isEmpty != true">
      <countdown v-if="counting" :time="59 * 1000" @end="timeUp">
        <template slot-scope="props"> あと：{{ props.seconds }} 秒 </template>
      </countdown>
    </template>

    <div class="usersIconDisplayArea">
      <b-row>
        <b-col
          v-for="(user, index) in roomObj.users"
          :key="user.userNum"
          class="userIconArea"
        >
          <template v-if="roomObj.answer[index] !== ''">
            <b-avatar :src="user.photoURL" badge="ok" badge-variant="success">
            </b-avatar>
          </template>
          <template v-else>
            <template v-if="user.photoURL === ''">
              <b-avatar v-if="index === 1" variant="primary"></b-avatar>
              <b-avatar v-else-if="index === 2" variant="success"></b-avatar>
              <b-avatar v-else variant="danger"></b-avatar>
            </template>
            <b-avatar v-else :src="user.photoURL"></b-avatar>
          </template>

          <h6>{{ user.displayName }}</h6>
        </b-col>
      </b-row>
    </div>
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
      <b-form-input
        v-if="checked == false"
        v-model="myAnswer"
        placeholder="Please your answer"
      ></b-form-input>
      <div v-else class="mt-2">
        <h6>あなたの回答</h6>
        <h2>{{ myAnswer }}</h2>
      </div>
      <b-button
        v-if="checked == false"
        variant="outline-primary"
        class="determinationBtn"
        @click="checkInput"
        >決定</b-button
      >
      <b-modal id="modal-scoped1">
        <div>modal</div>
      </b-modal>
    </template>

    <!-- まだ退出機能ができてないのでコメントアウト -->
    <!-- <button @click="returnTop">Topへ戻る</button> -->
  </div>
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
    ...mapState('answer', ['themeDocId']),
    ...mapState('login', ['user']),
  },
  watch: {
    'roomObj.answer'(answer) {
      // console.log('watch')
      // console.log(answer.filter((ans) => ans === '').length)
      // test
      // if (answer.filter((ans) => ans === '').length === 3) {
      if (answer.filter((ans) => ans === '').length === 0) {
        // this.sleep(2, () => {
        //   console.log('1s 経過')
        // })
        const resultUrl = '/rooms/' + this.roomObj.roomId + '/result'
        this.$router.push(resultUrl)
      }
    },
  },
  created() {
    console.log('created')
  },
  mounted() {
    this.$store.dispatch('answer/getThemeDocId', {
      theme: this.roomObj.theme,
    })
  },
  methods: {
    timeUp() {
      console.log('timeUp()')
      this.counting = false
      this.confirmTimeUpModal()
      if (!this.checked) {
        console.log('timeUp AnserSet()')
        this.sleep(this.myUserNum, () => {
          console.log(this.myUserNum + 'sleep End')
        })
        this.myAnswer = '[No Answer]'
        this.$store.dispatch('room/setMyAnswer', {
          myAnswer: this.myAnswer,
        })
        console.log('timeUp AnserSetEnd()')
      }
      console.log('timeUp():End')
    },
    checkInput() {
      if (!this.myAnswer) {
        // console.log('empty')
      } else {
        // 回答の確認okならFireStoreに登録
        this.confirmAnswerModal()
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
    confirmAnswerModal() {
      this.$bvModal
        .msgBoxConfirm('この回答でよろしいですか?', {
          footerClass: 'mx-auto',
        })
        .then((value) => {
          if (value) {
            this.$store.dispatch('room/setMyAnswer', {
              myAnswer: this.myAnswer,
            })
            this.$store.dispatch('answers/setMyAnswer', {
              themeid: this.themeDocId,
              uid: this.user.uid,
              answer: this.myAnswer,
            })
            this.checked = true
          }
        })
        .catch((err) => {
          // An error occurred
          console.log(err)
        })
    },
    confirmTimeUpModal() {
      this.$bvModal
        .msgBoxOk('Time up!', {
          size: 'md',
          buttonSize: 'lg',
          okVariant: 'success',
          headerClass: 'p-2 border-bottom-0',
          footerClass: 'p-2 border-top-0 mx-auto',
          centered: true,
        })
        .then((value) => {})
        .catch((err) => {
          // An error occurred
          console.log(err)
        })
    },
    sleep(waitSec, callbackFunc) {
      console.log('sleep() start')
      // 経過時間（秒）
      let spanedSec = 0

      // 1秒間隔で無名関数を実行
      const id = setInterval(function () {
        spanedSec++
        console.log(spanedSec)
        // 経過時間 >= 待機時間の場合、待機終了。
        if (spanedSec >= waitSec) {
          // タイマー停止
          clearInterval(id)
          // 完了時、コールバック関数を実行
          if (callbackFunc) callbackFunc()
        }
      }, 500)
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
  margin-top: 5px;
  padding-top: 15px;
  padding-bottom: 15px;
  background-color: #f5f7fa;
  border-radius: 10px;
}

.userIconArea {
  display: inline-block;
  text-align: center;
  width: 200px;
}
</style>
