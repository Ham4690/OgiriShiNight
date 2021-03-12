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
    <p>(1位:3pt, 2位:2pt, 3位:1pt)</p>
    <div>
      <span
        v-for="(user, index) in roomObj.users"
        :key="user.userNum"
        class="userAnsCard"
      >
        <template v-if="roomObj.answer[index] !== '[No Answer]'">
          <b-card v-if="index != myUserNum" class="userAnsInfo">
            <div class="userAns">
              <h3>
                {{ roomObj.answer[index] }}
              </h3>
            </div>
            <div>
              <b-form-group>
                <b-form-radio-group
                  v-if="checked == false"
                  v-model="points[index]"
                  :options="radioOptions.slice(0, getValidAnsNum())"
                  button-variant="outline-success"
                  size="sm"
                  buttons
                  @input="checkPoint(index)"
                >
                </b-form-radio-group>
                <b-form-radio-group
                  v-else
                  v-model="points[index]"
                  :options="getDisableOption(index)"
                  button-variant="outline-success"
                  size="sm"
                  buttons
                  @input="checkPoint(index)"
                >
                </b-form-radio-group>
              </b-form-group>
            </div>
            <template v-if="checked != false" class="mySelectScored">
              あなたの評価: {{ getSelectUserRank(points[index]) }}
            </template>
          </b-card>
        </template>
      </span>
    </div>
    <!-- kokomade -->
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
      <!-- add: -->

      <div class="themeArea">
        <h6>お題</h6>
        <h3>{{ roomObj.theme }}</h3>
      </div>
      <b-row v-for="(result, index) in sortedUsers" :key="result.userNum">
        <b-col class="icon">
          <b-avatar :src="roomObj.users[result.userNum].photoURL"></b-avatar>
          <h6>{{ roomObj.users[result.userNum].displayName }}</h6>
        </b-col>
        <b-col class="score">
          <div>
            <h4>{{ index + 1 }}位: {{ result.point }}pt</h4>
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
      radioOptions: [
        { text: '1位', value: 3, name: 'point3' },
        { text: '2位', value: 2, name: 'point2' },
        { text: '3位', value: 1, name: 'point1' },
      ],
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
      if (scored.filter((bl) => bl === true).length === 4) {
        // points[]が高い順にuserをソート
        for (let i = 0; i < this.roomObj.points.length; i++) {
          this.sortedUsers.push({ userNum: i, point: this.roomObj.points[i] })
        }
        console.log(this.sortedUsers)

        this.sortedUsers.sort((a, b) => {
          if (a.point > b.point) return -1
          if (a.point < b.point) return 1
          return 0
        })

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
    checkPoint(targetNum) {
      const checkValue = this.points[targetNum]
      for (let i = 0; i < 4; i++) {
        if (
          i !== this.myUserNum &&
          i !== targetNum &&
          this.points[i] === checkValue
        ) {
          this.points[i] = 0
        }
      }
    },
    gradingConfirmation(myUserNum) {
      let isCorrect = true
      const noAnsIndex = []

      for (let i = 0; i < 4; i++) {
        if (
          i !== parseInt(myUserNum) &&
          this.roomObj.answer[i] !== '[No Answer]' &&
          this.points[i] === 0
        ) {
          noAnsIndex.push(i)
          isCorrect = false
        }
      }

      const isEmptyNum = noAnsIndex.length
      if (isEmptyNum > 0) {
        this.confirmIsEmptyScored(isEmptyNum)
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
    confirmIsEmptyScored(isEmptyIndex) {
      this.$bvModal
        .msgBoxOk(`順位が入力されていない項目が${isEmptyIndex}つあります.`, {
          size: 'md',
          buttonSize: 'md',
          okVariant: 'success',
          headerClass: 'p-2 border-bottom-0',
          footerClass: 'p-2 border-top-0 mx-auto',
          centered: true,
        })
        .then((value) => {})
        .catch((err) => {
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
    getValidAnsNum() {
      let cnt = 0
      for (let i = 0; i < 4; i++) {
        if (i !== this.myUserNum && this.roomObj.answer[i] !== '[No Answer]') {
          cnt++
        }
      }
      return cnt
    },
    getDisableOption(index) {
      const disableOptions = [
        { text: '1位', value: 3, name: 'point3' },
        { text: '2位', value: 2, name: 'point2' },
        { text: '3位', value: 1, name: 'point1' },
      ]
      for (let i = 0; i < disableOptions.length; i++) {
        if (disableOptions[i].value !== this.points[index]) {
          disableOptions[i].disabled = true
        }
      }
      return disableOptions.slice(0, this.getValidAnsNum())
    },
    twitterShare() {
      // シェアする画面を設定
      const shareURL =
        'https://twitter.com/intent/tweet?text=' +
        'お題「' +
        this.roomObj.theme +
        '」自分の回答「' +
        this.roomObj.answer[this.myUserNum] +
        '」 %20%23OgiriShiNight' +
        ' &url=' +
        'https://ogiri-shi-night.web.app/'
      // シェア用の画面へ移行
      open(shareURL, '_blank')
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
