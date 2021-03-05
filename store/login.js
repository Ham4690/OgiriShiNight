export const state = () => ({
  value: 1,
})

// export const getters = () => ({
//   value(state) {
//     return state.value
//   },
// })

export const getters = {
  value: (state) => {
    return state.value
  },
}
