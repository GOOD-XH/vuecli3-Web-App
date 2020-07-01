import {
  GETRECOMMEND, GETDISCLIST, GETSINGERLIST, GETSINGER,
  SET_PLAYING_STATE, SET_FULL_SCREEN, SET_PLAYLIST,
  SET_SEQUENCE_LIST, SET_PLAY_MODE, SET_CURRENT_INDEX,
  SET_DISC , SET_TOP_LIST, SET_SEARCH_HISTORY ,
  SET_PLAY_HISTORY, SET_FAVORITE_LIST,}
  from './mutation-types'

export default {
  [GETRECOMMEND] (state, {recommends}) {
    state.recommends = recommends
  },
  [GETDISCLIST] (state, {disLists}) {
    state.disLists = disLists
  },
  [GETSINGERLIST] (state, {list}) {
    state.singers = list
  },
  [GETSINGER] (state, singer) {
    state.singer = singer
  },

  [SET_PLAYING_STATE](state, flag) {
    state.playing = flag
  },
  [SET_FULL_SCREEN](state, flag) {
    state.fullScreen = flag
  },
  [SET_PLAYLIST](state, list) {
    state.playlist = list
  },
  [SET_SEQUENCE_LIST](state, list) {
    state.sequenceList = list
  },
  [SET_PLAY_MODE](state, mode) {
    state.mode = mode
  },
  [SET_CURRENT_INDEX](state, index) {
    state.currentIndex = index
  },
  [SET_DISC](state, disc) {
    state.disc = disc
  },
  [SET_TOP_LIST](state, topList) {
    state.topList = topList
  },
  [SET_SEARCH_HISTORY](state, history) {
    state.searchHistory = history
  },
  [SET_PLAY_HISTORY](state, history) {
    state.playHistory = history
  },
  [SET_FAVORITE_LIST](state, list) {
    state.favoriteList = list
  }
}
