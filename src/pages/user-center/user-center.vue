<template>
  <transition name="slide">
    <div class="user-center">
      <div class="back" @click="$router.back()">
        <i class="icon-back"></i>
      </div>
      <div class="switches-wrapper">
        <switches @switch="switchItem" :switches="switches" :current-index="currentIndex"></switches>
      </div>
      <div ref="playBtn" class="play-btn" @click="random">
        <i class="icon-play"></i>
        <span class="text">随机播放全部</span>
      </div>
      <div class="list-wrapper" ref="listWrapper">
        <scroll ref="favoriteList" v-if="currentIndex === 0" class="list-scroll" :data="favoriteList">
          <div class="list-inner">
            <song-list :songs="favoriteList" @select="selectSong"></song-list>
          </div>
        </scroll>
        <scroll  ref="playList"  v-if="currentIndex===1" class="list-scroll"
                :data="playHistory">
          <div class="list-inner">
            <song-list :songs="playHistory" @select="selectSong"></song-list>
          </div>
        </scroll>
      </div>
      <div class="np-result-wrapper" v-show="noResult">
        <no-result :title="noResultDesc"></no-result>
      </div>
    </div>
  </transition>
</template>

<script>
import Switches from 'src/components/switches/switches'
import Scroll from 'src/components/scroll/scroll'
import SongList from 'src/components/song-list/song-list'
import {mapState} from 'vuex'
import Song from 'src/common/js/song'
import NoResult from 'src/components/no-result/no-result'
import {playlistMixin} from 'src/common/js/mixin'
export default {
  name: "user-center",
  mixins: [playlistMixin],
  data() {
    return {
      currentIndex: 0,
      switches: [
        {name: '我喜欢的'},
        {name: '最近播放'}
      ],
    }
  },
  components: {
    Switches,
    Scroll,
    SongList,
    NoResult
  },
  computed: {
    ...mapState({
      playHistory: state => state.playHistory,
      favoriteList: state => state.favoriteList
    }),
    //显示/隐藏
    noResult() {
      if (this.currentIndex === 0) {
        return !this.favoriteList.length
      } else {
        return !this.playlist.length
      }
    },
    noResultDesc() {
      if (this.currentIndex === 0) {
        return '暂无收藏歌曲'
      } else {
        return '你还没有听过歌曲'
      }
    }
  },
  methods: {
    handlePlaylist(playlist) {
      const bottom = playlist.length > 0 ? '60px' : ''
      this.$refs.listWrapper.style.bottom = bottom
      //判断是否存在
      this.$refs.favoriteList && this.$refs.favoriteList.refresh()
      this.$refs.playHistory && this.$refs.playList.refresh()
    },
    switchItem(index) {
      this.currentIndex = index
    },
    selectSong({song}) {
      this.$store.dispatch('_insertSong', new Song(song))
    },
    //随机播放
    random() {
      let list = this.currentIndex === 0 ? this.favoriteList : this.playHistory
      if (list.length === 0) {
        return
      }
      list = list.map((song)=> {
        return new Song(song)
      })
      this.$store.dispatch('_randomPlay', {list})
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .user-center
    position: fixed
    top: 0
    bottom: 0
    z-index: 100
    width: 100%
    background: $color-background
    &.slide-enter-active, &.slide-leave-active
      transition: all 0.3s
    &.slide-enter, &.slide-leave-to
      transform: translate3d(100%, 0, 0)
    .back
      position absolute
      top: 0
      left: 6px
      z-index: 50
      .icon-back
        display: block
        padding: 10px
        font-size: $font-size-large-x
        color: $color-theme
    .switches-wrapper
      margin: 10px 0 30px 0
    .play-btn
      box-sizing: border-box
      width: 135px
      padding: 7px 0
      margin: 0 auto
      text-align: center
      border: 1px solid  $color-text-l
      color: $color-text-l
      border-radius: 100px
      font-size: 0
      .icon-play
        display: inline-block
        vertical-align: middle
        margin-right: 6px
        font-size: $font-size-medium-x
      .text
        display: inline-block
        vertical-align: middle
        font-size: $font-size-small
    .list-wrapper
      position: absolute
      top: 110px
      bottom: 0
      width: 100%
      .list-scroll
        height: 100%
        overflow: hidden
        .list-inner
          padding: 20px 30px
    .no-result-wrapper
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>
