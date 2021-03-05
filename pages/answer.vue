<template>
  <div class="container">
    <div v-if="done == false">
      <span v-if="$store.state.answer.theme">
        {{ themeName }}
      </span>
      <input v-model="answer" />
      <button @click="toggle">決定</button>
    </div>
    <div v-else>
      <h2>{{ themeName }}</h2>
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
    }
  },
  computed: {
    themeName() {
      return this.$store.state.answer.themeName
    },
  },
  created() {
    this.$store.dispatch('answer/fetchRandomTheme')
  },
  methods: {
    toggle() {
      this.done = true
    },
  },
}
</script>
