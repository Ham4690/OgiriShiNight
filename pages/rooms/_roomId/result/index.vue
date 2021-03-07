<template>
  <div class="container">
    <div class="roomId">
      result Id--
      {{ resultId }}
    </div>

    <div class="themeArea">
      <h1>{{ theme }}</h1>
      <hr />
    </div>

    <div class="myAnsInfo">
      <h4>あなたの回答</h4>
      <div class="userAns">
        <h3>
          {{ answers[myNum].answer }}
        </h3>
      </div>
    </div>
    <hr />
    <p>他の回答にそれぞれ自分の中で順位をつけてください</p>
    <p>(1位:3px, 2位:2pt, 3位:3pt)</p>

    <div class="usersIconDisplayArea">
      <span v-for="(user, index) in users" :key="user.name" class="userAnsCard">
        <b-card v-if="index != myNum" class="userAnsInfo">
          <b-col class="userIconArea">
            <b-avatar
              class="userIcon"
              src="~/assets/userIconSample.png"
              size="3rem"
            ></b-avatar>
            <p>{{ user.name }}</p>
          </b-col>
          <div class="userAns">
            <h3>
              {{ answers[index].answer }}
            </h3>
          </div>
          <div :ref="`userEval${index}`" class="evaluate">
            <input
              type="radio"
              name="point3"
              value="3"
              @click="checkPoint(index, 0)"
            />1位
            <input
              type="radio"
              name="point2"
              value="2"
              @click="checkPoint(index, 1)"
            />2位
            <input
              type="radio"
              name="point1"
              value="1"
              @click="checkPoint(index, 2)"
            />3位
          </div>
        </b-card>
      </span>
    </div>

    <b-button variant="outline-primary" @click="gradingConfirmation(myNum)"
      >決定</b-button
    >
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
      points: [{ point: 0 }, { point: 0 }, { point: 0 }, { point: 0 }],
      myNum: 0,
      myAnswer: '',
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
    checkPoint(targetNum, btnNum) {
      const prop = 'userEval' + targetNum
      const refData = this.$refs[prop]
      const p = refData[0].children[0].value
      this.points[targetNum].point = p
      // console.log(refData[0].children[0])
      // console.log(refData[0].children[0].value)
      const userNum = refData[0].children.length
      for (let i = 0; i < userNum; i++) {
        if (i !== btnNum) {
          refData[0].children[i].checked = false
        }
      }
    },
    gradingConfirmation(myNum) {
      const isNoCheck = (currentValue) => currentValue === false
      let isCorrect = true
      for (let i = 0; i < 4; i++) {
        if (i !== myNum) {
          const prop = 'userEval' + i
          const refData = this.$refs[prop]
          console.log(refData)
          const userNum = refData[0].children.length
          const checkArray = []
          for (let j = 0; j < userNum; j++) {
            const check = refData[0].children[j].checked
            checkArray.push(check)
          }
          if (checkArray.every(isNoCheck)) {
            window.alert('順位が入力されていない項目があります.')
            isCorrect = false
            break
          }
        }
      }
      if (isCorrect) {
        window.alert(
          'ok, ここで得点の加算処理を行う(.vueに保存してるpointsをstoreに移す)'
        )
        this.done = true
      }
    },
  },
}
</script>

<style>
.roomId {
  text-align: left;
}
.container {
  text-align: center;
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
}

.myAnsInfo {
  text-align: center;
}

.userAnsInfo {
  margin: 5px, 0, 5px, 5px;
  text-align: center;
}
.myAnsInfo > div {
  justify-content: center; /*左右中央揃え*/
  align-items: center;
}

.userAnsCard {
  margin-bottom: 5px;
}
</style>
