<template>
  <div class="container">
    <div v-if="done == false">
      <span>
        <!-- {{ randTheme.theme }} -->
        {{ themes }}
        {{ theme }}
        {{ selectThemeNum }}
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
      selectThemeNum: 0,
      theme: '',
      answer: '',
      done: false,
      themeMaxNum: 3,
    }
  },
  computed: {
    themes() {
      return this.$store.state.answer.themes
    },
  },
  created() {
    const num = Math.floor(Math.random() * this.themeMaxNum)
    this.$store.dispatch('answer/init')
    this.selectThemeNum = num
    this.theme = this.$store.dispatch('answer/fetchTheme', num)
  },
  methods: {
    toggle() {
      this.done = true
    },
  },
}
</script>
