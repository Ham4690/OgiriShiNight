<template>
  <b-container>
    <div class="roomId">
      room ID:
      {{ roomId }}
    </div>
    <!-- 確認用コード -->
    <p>your Num : {{ myNum }}</p>
    <!-- ここまで -->
    <countdown v-if="stateRoomObj.isEmpty != true" :time="59 * 1000">
      <template slot-scope="props">
        あと：{{ props.seconds }} 秒
        <span v-if="props.seconds === 0"> {{ timeUp() }} </span>
      </template>
    </countdown>

    <b-row class="usersIconDisplayArea">
      <b-col
        v-for="user in stateRoomObj.users"
        :key="user.userNum"
        class="userIconArea"
      >
        <b-avatar :src="user.photoURL"></b-avatar>
        <h6>{{ user.displayName }}</h6>
      </b-col>
    </b-row>
    <hr />
    <!-- 本番動作確認コメントをはずす -->
    <!-- <div> -->
    <div v-if="stateRoomObj.isEmpty != true">
      <div class="themeArea">
        <h1>{{ theme }}</h1>
        <hr />
      </div>
      <div>
        <b-form-input
          v-model="yourAnswer"
          placeholder="Please your answer"
        ></b-form-input>
        <div class="mt-2">Value: {{ yourAnswer }}</div>
      </div>
      <b-button variant="outline-primary" @click="checkInput">決定</b-button>
    </div>
    <!-- まだ退出機能ができてないのでコメントアウト -->
    <!-- <button @click="returnTop">Topへ戻る</button> -->
    {{ stateRoomObj.users }}
    {{ stateRoomObj.isEmpty }}
  </b-container>
</template>

<script>
const ICONURL = '~/assets/userIconSample.png'

export default {
  data() {
    return {
      users: [
        {
          name: 'user1',
          iconUrl: ICONURL,
          roomJoinNum: 0,
        },
        {
          name: 'user2',
          iconUrl: ICONURL,
          roomJoinNum: 1,
        },
        {
          name: 'user3',
          iconUrl: ICONURL,
          roomJoinNum: 2,
        },
        {
          name: 'user4',
          iconUrl: ICONURL,
          roomJoinNum: 3,
        },
      ],
      theme: 'こんなお弁当は嫌だ、どんなお弁当？',
      answers: [{ answer: '' }, { answer: '' }, { answer: '' }, { answer: '' }],
      myNum: 0,
      yourAnswer: '',
      done: false,
      roomId: this.$route.params.id,
      ready: false,
      checked: false,
    }
  },
  computed: {
    stateRoomObj() {
      return this.$store.state.room.roomObj
    },
    getMyNum() {
      const myUid = this.$store.state.login.user.uid
      console.log('myUid: ' + myUid)
      const users = this.$store.state.room.roomObj.users
      for (let i = 0; i < users.length; i++) {
        if (users[i].uid === myUid) {
          return users[i].userNum
        }
      }
      console.log('error not found you uid')
      return 5
    },
  },
  created() {
    console.log('created')
    this.myNum = this.getMyNum
  },
  methods: {
    timeUp() {
      const resultUrl = '/rooms/' + this.myNum + '/result'
      if (!this.checked) {
        this.yourAnswer = 'No Answer:時間切れ'
      }
      window.alert('time up!!!' + this.yourAnswer)
      this.$router.push(resultUrl)
    },
    checkInput() {
      if (!this.yourAnswer) {
        console.log('empty')
      } else {
        const check = window.confirm('この回答でよろしいですか?')
        if (check) {
          const resultUrl = '/rooms/' + this.myNum + '/result'
          this.checked = true
          this.$router.push(resultUrl)
        }
      }
    },
    timerStart() {
      this.ready = true
    },
    returnTop() {
      this.$router.push('/')
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
