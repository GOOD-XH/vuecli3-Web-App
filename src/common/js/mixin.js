import {mapState, mapGetters} from 'vuex'
import {playMode} from 'src/common/js/config'
import {shuffle} from 'src/common/js/util'

export const playlistMixin = {
  computed: {
    ...mapState({
      playlist: state => state.playlist
    })
  },
  mounted() {
    this.handlePlaylist(this.playlist)
  },
  activated() {
    this.handlePlaylist(this.playlist)
  },
  watch: {
    playlist(newVal) {
      this.handlePlaylist(newVal)
    }
  },
  methods: {
    handlePlaylist() {
      throw new Error('component must implement handlePlaylist method')
    }
  }
}


export const playerMixin = {
  computed: {
    ...mapState({
      sequenceList: state => state.sequenceList,
      playlist: state => state.playlist,
      mode: state => state.mode,
      currentIndex: state => state.currentIndex,
      favoriteList: state => state.favoriteList
    }),
    ...mapGetters(['currentSong']),

    iconMode() {
      return this.mode === playMode.sequence ? 'icon-sequence' : this.mode === playMode.loop ? 'icon-loop' : 'icon-random'
    }
  },
  methods: {
    //改变歌曲播放模式
    changeMode() {
      const mode = (this.mode + 1) % 3
      this.$store.commit('SET_PLAY_MODE', mode)
      //得到新的播放列表
      let list = null
      if (mode === playMode.random) {
        list = shuffle(this.sequenceList)
      } else {
        list = this.sequenceList
      }
      //解决bug：歌单改变时，正在播放的歌曲也改变
      this.resetCurrentIndex(list)
      //修改播放列表
      this.$store.commit('SET_PLAYLIST', list)
    },
    // 根据当前正在播放的歌曲寻找到对应新的播放列表的下标，并修改currentIndex播放索引
    resetCurrentIndex(list) {
      let index = list.findIndex((item)=> {
        return item.id === this.currentSong.id
      })
      this.$store.commit("SET_CURRENT_INDEX" , index)
    },

    //我喜欢的 样式
    getFavoriteIcon(song) {
      if (this.isFavorite(song)) {
        return 'icon-favorite'
      }
      return 'icon-not-favorite'
    },
    //切换我喜欢
    toggleFavorite(song) {
      if (this.isFavorite(song)) {
        this.$store.dispatch('deleteFavoriteList', song)
      } else {
        this.$store.dispatch('saveFavoriteList', song)
      }
    },
    //是否在我喜欢的列表
    isFavorite(song) {
      const index = this.favoriteList.findIndex((item) => {
        return item.id === song.id
      })
      return index > -1
    }
  }
}

export const searchMixin = {
  data() {
    return {
      query: '',
      refreshDelay: 120
    }
  },
  computed: {
    ...mapState({
      searchHistory: state => state.searchHistory
    }),
  },
  methods: {
    //保存搜索结果
    saveSearch() {
      this.$store.dispatch('saveSearchHistory',this.query)
    },
    //在滚动条滚动之前，让input失去焦点
    //实现：在移动端滚动时，键盘隐藏
    blurInput() {
      this.$refs.searchBox.blur()
    },
    //由子组件search-box传出参数newQuery
    onQueryChange(newQuery) {
      this.query = newQuery
    },
    //给searchBox添加点击的query
    addQuery(query) {
      this.$refs.searchBox.setQuery(query)
    },
    //删除一个搜索结果
    deleteOne(item) {
      this.$store.dispatch('deleteSearchHistory', item)
    },
  }
}
