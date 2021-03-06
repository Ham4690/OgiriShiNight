<template>
  <div>
    result Id--
    {{ resultId }}

    <div class="themeArea">
      <h1>{{ theme }}</h1>
      <hr />
    </div>

    <b-raw class="myAnsInfo">
      <b-col class="userIconArea">
        <img
          src="~/assets/userIconSample.png"
          style="border-radius: 50%"
          border="0"
          width="50"
          height="50"
          alt="icon"
        />
        <p>{{ users[yourNum].name }}</p>
      </b-col>
      <div class="userAns">
        <h3>
          {{ answers[yourNum].answer }}
        </h3>
      </div>
    </b-raw>
    <hr />

    <div class="usersIconDisplayArea">
      <div v-for="(user, index) in users" :key="user.name">
        <b-raw v-if="index != yourNum" class="userAnsInfo">
          <b-col class="userIconArea">
            <img
              src="~/assets/userIconSample.png"
              style="border-radius: 50%"
              border="0"
              width="50"
              height="50"
              alt="icon"
            />
            <p>{{ user.name }}</p>
          </b-col>
          <div class="userAns">
            <h3>
              {{ answers[index].answer }}
            </h3>
          </div>
          <div class="evaluate">
            <input type="radio" name="point1" value="1" />小笑い
            <input type="radio" name="point2" value="2" />中笑い
            <input type="radio" name="point3" value="3" />大笑い
          </div>
        </b-raw>
      </div>
    </div>

    <b-button variant="outline-primary">決定</b-button>
    <button @click="returnTop">Topへ戻る</button>
  </div>
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
      answers: [
        { answer: '白米だけ' },
        { answer: 'のりべん' },
        { answer: '梅干しが男梅' },
        { answer: '占いのグラタンがない' },
      ],
      yourNum: 0,
      yourAnswer: '',
      done: false,
      roomId: this.$route.params.id,
      ready: false,
      resultId: this.$route.params.roomId,
    }
  },
  methods: {
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
  text-align: center;
  width: 200px;
}

.userAnsInfo,
.myAnsInfo {
  display: inline-flex;
}

.userAns {
  margin: 0, 0, 0, 0;
}
.evaluate {
  float: right;
}
</style>
