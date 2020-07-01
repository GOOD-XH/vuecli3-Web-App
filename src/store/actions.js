import {
  GETRECOMMEND, GETDISCLIST, GETSINGERLIST,
  SET_PLAYING_STATE, SET_FULL_SCREEN, SET_PLAYLIST,
  SET_SEQUENCE_LIST, SET_PLAY_MODE, SET_CURRENT_INDEX,
  SET_SEARCH_HISTORY , SET_PLAY_HISTORY, SET_FAVORITE_LIST,}
  from './mutation-types'
import {getRecommend, getDiscList,} from 'src/api/recommend'
import {getSingerList} from 'src/api/singer'
import {ERR_OK} from  'src/api/config'
import {playMode} from "../common/js/config";
import {shuffle} from "../common/js/util";
import {saveSearch, deleteSearch, clearSearch,
  savePlay, saveFavorite, deleteFavorite}
from "../common/js/cache";

//查找歌曲中有无这首歌曲，放回索引
function findIndex(list, song) {
  return list.findIndex((item) => {
    return item.id === song.id
  })
}

export default {
  async _getRecommend({commit}) {
    const result = await getRecommend()
    if (result.code === ERR_OK) {
      const recommends = result.data.slider
      commit(GETRECOMMEND, {recommends})
    }
  },
  async _getDiscList({commit}) {
    const result = await getDiscList()
    if (result.code === ERR_OK) {
      const disLists = result.data.list
      commit(GETDISCLIST, {disLists})
    }
  },
  async _getSingerList({commit}) {
    const result = await getSingerList()
    if (result.code === ERR_OK) {
      const list = result.data.list
      commit(GETSINGERLIST, {list})
    }
  },
  //选择播放
  _selectPlay({commit, state}, {list, index}) {
    commit(SET_SEQUENCE_LIST, list)
    if (state.mode === playMode.random) {
      let randomList = shuffle(list)
      commit(SET_PLAYLIST, randomList)
      index = findIndex(randomList, list[index])
    } else {
      commit(SET_PLAYLIST, list)
    }
    commit(SET_CURRENT_INDEX, index)
    commit(SET_FULL_SCREEN, true)
    commit(SET_PLAYING_STATE, true)
  },
  //随机播放
  _randomPlay({commit, state}, {list}) {
    commit(SET_PLAY_MODE, playMode.random)
    commit(SET_SEQUENCE_LIST, list)
    //随机播放列表
    let randomList = shuffle(list)
    commit(SET_PLAYLIST, randomList)
    commit(SET_CURRENT_INDEX, 0)
    commit(SET_FULL_SCREEN, true)
    commit(SET_PLAYING_STATE, true)
  },
  //往player中插入歌曲
  _insertSong({commit, state}, song) {
    let playlist = state.playlist.slice()
    let sequenceList = state.sequenceList.slice()
    let currentIndex = state.currentIndex
    //二.记录当前播放歌曲
    let currentSong = playlist[currentIndex]
    //一.播放列表playlist中
    //1.查找播放列表playlist中是否有待插入歌曲并返回其索引
    let fpIndex = findIndex(playlist, song)
    //2.因为是插入歌曲，所以索引+1（下一首中）
    currentIndex++
    //3.插入歌曲的索引为当前索引currentIndex
    playlist.splice(currentIndex, 0, song)
    //4.如果已经包含这首歌
    if (fpIndex > -1) {
      //如果当前插入的索引大于列表中的序号（在插入歌曲的前面）
      if (currentIndex > fpIndex) {
        //直接删除
        playlist.splice(fpIndex, 1)
        //删除后currentIndex 也因-1
        currentIndex--
      } else { //当前插入的索引小于列表中的序号（在插入歌曲的后面）
        //因为有新歌插入，所以删除时应将索引 fpIndex +1
        playlist.splice(fpIndex + 1, 1)
      }
    }
    //二.顺序列表sequenceList中
    //1.查找插入的歌曲在顺序列表sequenceList中的索引
    let currentSIndex = findIndex(sequenceList, currentSong) + 1
    //2.查找顺序列表sequenceList中是否有待插入歌曲并返回其索引
    let fsIndex = findIndex(sequenceList, song)
    //3.插入歌曲
    sequenceList.splice(currentSIndex, 0, song)
    if (fsIndex > -1) {
      if (currentSIndex > fsIndex) {
        sequenceList.splice(fsIndex, 1)
      } else {
        sequenceList.splice(fsIndex + 1, 1)
      }
    }
    commit(SET_PLAYLIST, playlist)
    commit(SET_SEQUENCE_LIST, sequenceList)
    commit(SET_CURRENT_INDEX, currentIndex)
    commit(SET_FULL_SCREEN, true)
    commit(SET_PLAYING_STATE, true)
  },
  //playlist.vue 删除歌曲
  _deleteSong({commit, state}, song) {
    let playlist = state.playlist.slice()
    let sequenceList = state.sequenceList.slice()
    let currentIndex = state.currentIndex

    let pIndex = findIndex(playlist, song)
    playlist.splice(pIndex, 1)
    let sIndex = findIndex(sequenceList, song)
    sequenceList.splice(sIndex, 1)

    if (currentIndex > pIndex || currentIndex === playlist.length) {
      currentIndex --
    }
    commit(SET_PLAYLIST, playlist)
    commit(SET_SEQUENCE_LIST, sequenceList)
    commit(SET_CURRENT_INDEX, currentIndex)
    //当全部删除时,播放暂停
    const playlistState = playlist.length > 0
    commit(SET_PLAYING_STATE, playlistState)
  },
  //清空歌曲播放列表
  _deleteSonglist({commit}) {
    commit(SET_PLAYLIST, [])
    commit(SET_SEQUENCE_LIST, [])
    commit(SET_CURRENT_INDEX, -1)
    commit(SET_PLAYING_STATE, false)
  },
  //保存搜索历史
  saveSearchHistory({commit}, query) {
    commit(SET_SEARCH_HISTORY, saveSearch(query))
  },
  //删除单个搜索历史
  deleteSearchHistory({commit}, query) {
    commit(SET_SEARCH_HISTORY, deleteSearch(query))
  },
  //（垃圾桶）清理所有
  clearSearchHistory({commit}) {
    commit(SET_SEARCH_HISTORY, clearSearch())
  },
  //保存播放历史
  savePlayHistor({commit}, song) {
    commit(SET_PLAY_HISTORY, savePlay(song))
  },
  //保存我喜欢的
  saveFavoriteList ({commit}, song) {
    commit(SET_FAVORITE_LIST, saveFavorite(song))
  },
  //删除我喜欢的
  deleteFavoriteList({commit}, song) {
    commit(SET_FAVORITE_LIST, deleteFavorite(song))
  }
}
