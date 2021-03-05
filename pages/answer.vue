<template>
  <div class="container">
    <div v-if="done == false">
      <span v-if="$store.state.answer.theme">
        {{ themeName }}
      </span>
      <input v-model="answer" placeholder="Please your answer" />
      <button @click="checkInput">決定</button>
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
    checkInput() {
      if (!this.answer) {
        console.log('empty')
      } else {
        const check = window.confirm('この回答でよろしいですか?')
        if (check) {
          this.done = true
        }
      }
    },
  },
}
</script>
