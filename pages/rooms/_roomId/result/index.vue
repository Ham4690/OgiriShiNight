<template>
  <div class="container">
    <div class="roomId">
      your Num:
      {{ myUserNum }}
    </div>

    <div class="themeArea">
      <h1>{{ roomObj.theme }}</h1>
      <hr />
    </div>

    <b-row class="usersIconDisplayArea">
      <b-col
        v-for="(user, index) in roomObj.users"
        :key="user.userNum"
        class="userIconArea"
      >
        <template v-if="roomObj.scored[index]">
          <b-avatar :src="user.photoURL" badge="ok" badge-variant="success">
          </b-avatar>
        </template>
        <template v-else>
          <b-avatar :src="user.photoURL"></b-avatar>
        </template>

        <h6>{{ user.displayName }}</h6>
      </b-col>
    </b-row>
    <hr />

    <div class="myAnsInfo">
      <h4>あなたの回答</h4>
      <div class="userAns">
        <h3>
          {{ roomObj.answer[myUserNum] }}
        </h3>
      </div>
    </div>
    <p>他の回答にそれぞれ自分の中で順位をつけてください</p>
    <p>(1位:3px, 2位:2pt, 3位:1pt)</p>

    <div>
      <span
        v-for="(user, index) in roomObj.users"
        :key="user.userNum"
        class="userAnsCard"
      >
        <b-card v-if="index != myUserNum" class="userAnsInfo">
          <b-col class="userIconArea">
            <!-- <b-avatar
              class="userIcon"
              :src="user.photoURL"
              size="3rem"
            ></b-avatar>
            <p>{{ user.displayName }}</p> -->
          </b-col>
          <div class="userAns">
            <h3>
              {{ roomObj.answer[index] }}
            </h3>
          </div>
          <div
            v-if="checked == false"
            :ref="`userEval-${index}`"
            class="evaluate"
          >
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
          <div v-else class="mySelectScored">
            {{ getSelectUserRank(points[index]) }}
          </div>
        </b-card>
      </span>
    </div>

    <b-button
      v-if="checked == false"
      variant="outline-primary"
      class="determinationBtn"
      @click="gradingConfirmation(myUserNum)"
      >決定</b-button
    >

    <b-button
      v-if="isAllUserScored"
      variant="primary"
      class="mt-3 mb-3"
      block
      @click="returnTop"
      >Topページへ戻る</b-button
    >

    <b-modal
      id="modal-scoped"
      size="xl"
      hide-footer
      title="結果発表"
      @ok="returnTop"
    >
      <b-row v-for="(result, index) in sortedUsers" :key="result.userNum">
        <b-col class="icon">
          <b-avatar :src="result.photoURL"></b-avatar>
          <h6>{{ result.displayName }}</h6>
        </b-col>
        <b-col class="score">
          <div>
            <h3>{{ index + 1 }}位: {{ roomObj.points[result.userNum] }}pt</h3>
          </div>
        </b-col>
        <b-col lg="8" class="answer">
          <h6>回答</h6>
          <h4>{{ roomObj.answer[result.userNum] }}</h4>
          <hr />
        </b-col>
      </b-row>
      <div class="twitter_share">
        <b-button size="sm" @click="twitterShare"
          >ツイッターでシェアする</b-button
        >
      </div>
      <b-button variant="primary" class="mt-3" block @click="returnTop"
        >Ok</b-button
      >
    </b-modal>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  data() {
    return {
      ready: false,
      checked: false,
      isAllUserScored: false,
      points: [0, 0, 0, 0],
      sortedUsers: [],
    }
  },
  computed: {
    roomObj() {
      return this.$store.state.room.roomObj
    },
    ...mapState('room', ['roomObj', 'myUserNum']),
  },
  watch: {
    'roomObj.scored'(scored) {
      // test
      if (scored.filter((bl) => bl === true).length === 4) {
        // points[]が高い順にuserをソート
        this.sortedUsers = this.roomObj.users
        let damy = {}
        for (let i = 0; i < 4; i++) {
          for (let j = i; j < 4; j++) {
            if (this.roomObj.points[i] < this.roomObj.points[j]) {
              damy = this.sortedUsers[i]
              this.sortedUsers[i] = this.sortedUsers[j]
              this.sortedUsers[j] = damy
            }
          }
        }
        this.isAllUserScored = true
        this.$bvModal.show('modal-scoped')
      }
    },
  },
  methods: {
    returnTop() {
      this.$store.dispatch('room/unsubRoom')
      this.$router.push('/')
    },
    checkPoint(targetNum, btnNum) {
      const prop = 'userEval-' + targetNum
      const refData = this.$refs[prop]
      this.points[targetNum] = Number(refData[0].children[btnNum].value) // 1 ~ 3
      const userNum = refData[0].children.length
      for (let i = 0; i < userNum; i++) {
        if (i !== btnNum) {
          refData[0].children[i].checked = false
        }
      }
    },
    gradingConfirmation(myUserNum) {
      const isNoCheck = (currentValue) => currentValue === false
      let isCorrect = true
      for (let i = 0; i < 4; i++) {
        if (i !== parseInt(myUserNum)) {
          const prop = 'userEval-' + i
          const refData = this.$refs[prop]
          // console.log(i + 'refData:' + refData)
          const userNum = refData[0].children.length
          const checkArray = []
          for (let j = 0; j < userNum; j++) {
            const check = refData[0].children[j].checked
            checkArray.push(check)
          }
          if (checkArray.every(isNoCheck)) {
            this.confirmIsEmptyScored()
            isCorrect = false
            break
          }
        }
      }
      if (isCorrect) {
        this.confirmScoredModal()
      }
    },
    confirmScoredModal() {
      this.$bvModal
        .msgBoxConfirm('この採点結果でよろしいですか?', {
          footerClass: 'mx-auto',
        })
        .then((value) => {
          if (value) {
            this.$store.dispatch('room/setPointAndScored', {
              points: this.points,
            })
            this.checked = true
          }
        })
        .catch((err) => {
          // An error occurred
          console.log(err)
        })
    },
    confirmIsEmptyScored() {
      this.$bvModal
        .msgBoxOk('順位が入力されていない項目があります.', {
          size: 'md',
          buttonSize: 'md',
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
    getSelectUserRank(pt) {
      switch (pt) {
        case 3:
          return '1位'
        case 2:
          return '2位'
        default:
          return '3位'
      }
    },
    twitterShare() {
      // シェアする画面を設定
      const shareURL =
        'https://twitter.com/intent/tweet?text=' +
        '「お題」' +
        this.roomObj.theme +
        '「自分の回答」' +
        this.roomObj.answer[this.myUserNum] +
        ' %20%23OgiriShiNight' +
        ' &url=' +
        'https://ogiri-shi-night.web.app/'
      // シェア用の画面へ移行
      location.href = shareURL
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

.col > .icon {
  vertical-align: middle; /* 「vertical-align」を指定してもテキストは縦方向中央揃いにならない */
  text-align: center;
}

.twitter_share {
  max-width: 1000px;
  margin: auto;
}
</style>
