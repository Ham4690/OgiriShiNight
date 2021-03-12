/* eslint-disable vue/no-lone-template */
<template>
  <div class="container">
    <div>
      <h1 class="title">ogiri-shi-night</h1>
      <hr />

      <br />
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
      roomId: '',
    }
  },
  computed: {},
  watch: {},
  mounted() {},
  created() {},
  methods: {
    signInWithGoogle() {
      this.$store.dispatch('login/signInWithGoogle')
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
