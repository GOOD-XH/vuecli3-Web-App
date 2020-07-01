export default {
  currentSong(state) {
    return state.playlist[state.currentIndex] || {}
  },
}
