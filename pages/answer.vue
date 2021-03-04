<template>
  <div class="container">
    <div v-if="done == false">
      <span>
        <!-- {{ randTheme.theme }} -->
        <!-- {{ themes }} -->
        {{ randomTheme }}
      </span>
      <input v-model="answer" />
      <button @click="toggle">決定</button>
    </div>
    <div v-else>
      <h2></h2>
      <hr />
      <p>あなたの回答: {{ answer }}</p>
      <nuxt-link to="/">Top Page</nuxt-link>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      answer: '',
      done: false,
      themeMaxNum: 3,
    }
  },
  computed: {
    themes() {
      return this.$store.state.answer.themes
    },
    randomTheme() {
      const num = Math.floor(Math.random() * this.themeMaxNum)
      const theme = this.$store.state.answer.themes
      return theme[num]
    },
  },
  created() {
    // this.$store.dispatch('answer/init')
    this.$store.dispatch('answer/fetchThemes')
  },
  methods: {
    toggle() {
      this.done = true
    },
  },
}
</script>
