<template>
  <b-container>
    <p>room ID: {{ roomId }}</p>
    <countdown v-if="ready" :time="59 * 1000">
      <template slot-scope="props">あと：{{ props.seconds }} 秒</template>
    </countdown>
    <b-button v-else variant="outline-primary" @click="timerStart">
      全員揃った場合
    </b-button>

    <b-row class="usersIconDisplayArea">
      <b-col v-for="user in users" :key="user.name" class="userIconArea">
        <b-avatar></b-avatar>
        <h6>{{ user.name }}</h6>
      </b-col>
    </b-row>
    <div class="themeArea">
      <h1>{{ theme }}</h1>
      <hr />
    </div>
    <div class="answerArea">
      <p>{{ users[yourNum].name }} your Num : {{ yourNum }}</p>
      <div>
        <b-form-input
          v-model="yourAnswer"
          placeholder="Please your answer"
        ></b-form-input>
        <div class="mt-2">Value: {{ yourAnswer }}</div>
      </div>
      <b-button variant="outline-primary" @click="checkInput">決定</b-button>
    </div>
    <button @click="returnTop">Topへ戻る</button>
    {{ stateRoomObj.users }}
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
      yourNum: 0,
      yourAnswer: '',
      done: false,
      roomId: this.$route.params.id,
      ready: false,
    }
  },
  computed: {
    stateRoomObj() {
      return this.$store.state.room.roomObj
    },
  },
  created() {},
  methods: {
    checkInput() {
      if (!this.yourAnswer) {
        console.log('empty')
      } else {
        const check = window.confirm('この回答でよろしいですか?')
        if (check) {
          const resultUrl = '/rooms/' + this.roomId + '/result'
          window.alert('ok')
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
