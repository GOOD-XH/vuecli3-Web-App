<template>
  <div class="music-list">
    <div class="back" @click="back">
      <i class="icon-back"></i>
    </div>
    <h1 class="title" ref="title">{{title}}</h1>
    <div class="bg-image" ref="bgImage" :style="bgStyle">
      <div class="play-wrapper">
        <div class="play" ref="playBtn" v-show="songs.length>0" @click="random">
          <i class="icon-play"></i>
          <span class="text">随机播放全部</span>
        </div>
      </div>
      <div class="filter" ref="filter"></div>
    </div>
    <div class="bg-layer" ref="layer"></div>
    <scroll class="list" ref="list" @scroll="scroll"
            :data="songs" :listenScroll="listenScroll" :probeType="probeType">
      <div class="song-list-wrapper">
        <song-list :songs="songs" :rank="rank" @select="selectItem"></song-list>
      </div>
      <div v-show="!songs.length" class="loading-container">
        <loading></loading>
      </div>
    </scroll>
  </div>
</template>

<script>
import {playlistMixin} from 'src/common/js/mixin'
import Scroll from 'src/components/scroll/scroll'
import SongList from 'src/components/song-list/song-list'
import Loading from 'src/components/loading/loading'
import {prefixStyle} from 'src/common/js/dom'
const transform = prefixStyle('transform')
export default {
  name: "musci-list",
  mixins: [playlistMixin],
  props: {
    bgImage: {
      type: String,
      default: ''
    },
    songs: {
      type: Array,
    },
    title: {
      type: String,
      default: ''
    },
    rank: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      scrollY: 0,
    }
  },
  components: {
    Scroll,
    SongList,
    Loading
  },
  computed: {
    bgStyle() {
      return `background-image:url(${this.bgImage})`
    }
  },
  methods: {
    back() {
      this.$router.back()
    },
    scroll(pos) {
      this.scrollY = pos.y
    },
    selectItem({item, index}) {
      //发射songs得到歌曲列表playlist，发射索引index，得到播放歌曲的索引currentIndex
      this.$store.dispatch('_selectPlay', {list:this.songs, index})
    },
    //随机播放
    random() {
      this.$store.dispatch('_randomPlay', {list: this.songs})
    },
    //添加mini播放栏的高度
    handlePlaylist(playlist) {
      const bottom = playlist.length > 0 ? '60px' : ''
      this.$refs.list.$el.style.bottom = bottom
      this.$refs.list.refresh()
    }
  },
  created() {
    this.probeType = 3
    this.listenScroll = true
  },
  mounted() {
    this.titleHeight = this.$refs.title.clientHeight
    this.imageHeight = this.$refs.bgImage.clientHeight
    this.minTranslateY = -this.imageHeight + this.titleHeight
    this.$refs.list.$el.style.top = `${this.imageHeight}px`
  },
  watch: {
    scrollY (newY) {
      let zIndex = 0
      let scale = 1
      let blur = 0
      let tranlateY = Math.max(this.minTranslateY, newY)
      this.$refs.layer.style['transform'] = `translateY(${tranlateY}px)`
      const percent = Math.abs(newY / this.imageHeight)
      if (newY > 0) {
        scale =Math.min(1 + percent, 1.2)
        zIndex = 10
      } else {
        blur = Math.min(4*percent,2)
      }
      if (newY < this.minTranslateY) {
        zIndex = 10
        this.$refs.bgImage.style.paddingTop = `0`
        this.$refs.bgImage.style.height = `${this.titleHeight}px`
        this.$refs.playBtn.style.display = `none`
        blur = 0
      } else {
        this.$refs.bgImage.style.paddingTop = `70%`
        this.$refs.bgImage.style.height = `0`
        this.$refs.playBtn.style.display = ''
      }
      this.$refs.bgImage.style.zIndex = zIndex
      this.$refs.bgImage.style['transform'] = `scale(${scale})`
      this.$refs.bgImage.style['filter'] = `blur(${blur}px)`
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .music-list
    position: fixed
    z-index: 100
    top: 0
    left: 0
    bottom: 0
    right: 0
    background: $color-background
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
    .title
      position: absolute
      top: 0
      left: 10%
      z-index: 40
      width: 80%
      no-wrap()
      text-align: center
      line-height: 40px
      font-size: $font-size-large
      color: $color-text
    .bg-image
      position: relative
      width: 100%
      height: 0
      padding-top: 70%
      transform-origin: top
      background-size: cover
      .play-wrapper
        position: absolute
        bottom: 20px
        z-index: 50
        width: 100%
        .play
          box-sizing: border-box
          width: 135px
          padding: 7px 0
          margin: 0 auto
          text-align: center
          border: 1px solid $color-theme
          color: $color-theme
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
      .filter
        position: absolute
        top: 0
        left: 0
        width: 100%
        height: 100%
        background: rgba(7, 17, 27, 0.4)
    .bg-layer
      position: relative
      height: 100%
      background: $color-background
    .list
      position: fixed
      top: 0
      bottom: 0
      width: 100%
      background: $color-background
      .song-list-wrapper
        padding: 20px 30px
      .loading-container
        position: absolute
        width: 100%
        top: 50%
        transform: translateY(-50%)
</style>
