<template>
  <div>
    <label v-for="r in radioOptions" :key="r.label">
      <input v-model="radio" :value="r.value" type="radio" />
      {{ r.label }}
    </label>
  </div>
</template>

<script>
export default {
  data() {
    return {
      radioOptions: [
        { label: 'ラジオ1', value: 'radio1' },
        { label: 'ラジオ2', value: 'radio2' },
        { label: 'ラジオ3', value: 'radio3' },
        { label: 'ラジオ4', value: 'radio4' },
        { label: 'ラジオ5', value: 'radio5' },
      ],
    }
  },
}
</script>
