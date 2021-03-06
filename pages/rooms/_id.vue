<template>
  <b-container>
    <p>room ID: {{ roomId }}</p>
    <b-row class="usersIconDisplayArea">
      <b-col v-for="user of users" :key="user.name" class="userIconArea">
        <img
          :src="user.iconUrl"
          style="border-radius: 50%"
          border="0"
          width="50"
          height="50"
          alt="icon"
        />
        <p>{{ user.name }}</p>
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
  </b-container>
</template>

<script>
const ICONURL = '/_nuxt/assets/userIconSample.png'

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
    }
  },
  computed: {
    getUsers() {
      return this.users
    },
  },
  methods: {
    checkInput() {
      if (!this.yourAnswer) {
        console.log('empty')
      } else {
        const check = window.confirm('この回答でよろしいですか?')
        if (check) {
          window.alert('ok')
          // this.done = true
        }
      }
    },
    returnTop() {
      this.$router.push('/')
    },
  },
}
</script>

<style>
.usersIconDisplayArea {
  margin-top: 10px;
}

.userIconArea {
  display: inline-block;
  text-align: center;
  width: 200px;
}
</style>
