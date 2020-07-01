<template>
  <div class="player" v-show="playlist.length>0">
    <transition name="normal"
                @enter="enter"
                @after-enter="afterEnter"
                @leave="leave"
                @after-leave="afterLeave"
    >
    <div class="normal-player" v-show="fullScreen">
      <div class="background">
        <img width="100%" height="100%" :src="currentSong.image">
      </div>
      <div class="top">
        <div class="back">
          <i class="icon-back" @click="back"></i>
        </div>
        <h1 class="title">{{currentSong.name}}</h1>
        <h2 class="subtitle">{{currentSong.singer}}</h2>
      </div>

      <div class="middle" @touchstart.prevent="middleTouchStart"
           @touchmove.prevent="middleTouchMove"
           @touchend.prevent="middleTouchEnd">
        <div class="middle-l" ref="middleL">
          <div class="cd-wrapper" ref="cdWrapper">
            <div class="cd" :class="cdClass">
              <img class="image" :src="currentSong.image">
            </div>
          </div>
          <div class="playing-lyric-wrapper">
            <div class="playing-lyric">{{playingLyric}}</div>
          </div>
        </div>
        <scroll class="middle-r" ref="lyricList" :data="currentLyric && currentLyric.lines">
          <div class="lyric-wrapper">
            <div v-if="currentLyric">
              <p ref="lyricLine"
                 class="text"
                 :class="{'current': currentLineNum === index}"
                 v-for="(line,index) in currentLyric.lines" :key="index">{{line.txt}}</p>
            </div>
          </div>
        </scroll>
      </div>

      <div class="bottom">
        <div class="dot-wrapper">
          <span class="dot" :class="{active:currentShow ==='cd'}"></span>
          <span class="dot" :class="{active:currentShow ==='lyric'}"></span>
        </div>
        <div class="progress-wrapper">
          <span class="time time-l">{{format(currentTime)}}</span>
          <div class="progress-bar-wrapper" >
            <progress-bar :percent="percent" @percentChange="onProgressBarChange"></progress-bar>
          </div>
          <span class="time time-r">{{format(currentSong.duration)}}</span>
        </div>
        <div class="operators">
          <div class="icon i-left" @click="changeMode">
            <i :class="iconMode"></i>
          </div>
          <div class="icon i-left" :class="disableClass">
            <i class="icon-prev" @click="prev"></i>
          </div>
          <div class="icon i-center" :class="disableClass">
            <i :class="playIcon" @click="toggePlaying"></i>
          </div>
          <div class="icon i-right" :class="disableClass">
            <i class="icon-next" @click="next"></i>
          </div>
          <div class="icon i-right">
            <i class="icon" @click="toggleFavorite(currentSong)" :class="getFavoriteIcon(currentSong)"></i>
          </div>
        </div>
      </div>
    </div>
    </transition>
    <transition name="mini">
    <div class="mini-player" v-show="!fullScreen" @click="open">
      <div class="icon">
        <img :class="cdClass" width="40" height="40" :src="currentSong.image">
      </div>
      <div class="text">
        <h2 class="name">{{currentSong.name}}</h2>
        <p class="desc">{{currentSong.singer}}</p>
      </div>
      <div class="control">
        <progress-corcle :radius="32" :percent="percent">
        <i :class="miniIcon" @click.stop="toggePlaying" class="icon-mini"></i>
        </progress-corcle>
      </div>
      <div class="control" @click.stop="showPlaylist">
        <i class="icon-playlist"></i>
      </div>
    </div>
    </transition>
    <audio ref="audio" :src="currentSong.url"
           @play="ready" @error="error" @timeupdate="updateTime" @ended="end"></audio>
    <play-list ref="playlist"></play-list>
  </div>
</template>

<script>
import ProgressBar from 'src/components/progress-bar/progress-bar'
import ProgressCorcle from 'src/components/progress-circle/progress-circle'
import {mapState} from 'vuex'
import animations from 'create-keyframe-animation'
import {prefixStyle} from 'src/common/js/dom'
import {playMode} from "src/common/js/config"
import Scroll from 'src/components/scroll/scroll'
import PlayList from 'src/components/playlist/playlist'
import {playerMixin} from "../../common/js/mixin";
import Lyric from "lyric-parser"  //是一个类class

const transform = prefixStyle('transform')
const transitionDuration = prefixStyle('transitionDuration')

export default {
  name: "player",
  mixins: [playerMixin],
  data() {
    return {
      songReady: false, //解决快速切歌报错的bug
      currentTime: 0,
      currentLyric: null, //全部歌词
      currentLineNum: 0, //当前歌词所处在的行
      currentShow: 'cd', //歌词状态（cd/lyric）
      playingLyric: '' //当前正在播放的歌词
    }
  },
  components: {
    ProgressBar,
    ProgressCorcle,
    Scroll,
    PlayList
  },
  created() {
    this.touch = {}
  },
  computed: {
    ...mapState({
      fullScreen: state => state.fullScreen,
      playing: state => state.playing,
    }),
    playIcon() {
      return this.playing ? 'icon-pause' : 'icon-play'
    },
    miniIcon() {
      return this.playing ? `icon-pause-mini` : `icon-play-mini`
    },
    cdClass() {
      return this.playing ? `play` : `play pause`
    },
    //报错的class
    disableClass() {
      return this.songReady ? "" : "disable"
    },
    percent() {
      //歌曲播放比例
      return this.currentTime / this.currentSong.duration
    },
  },
  methods: {
    showPlaylist() {
      this.$refs.playlist.show()
    },
    back() {
      this.$store.commit('SET_FULL_SCREEN', false)
    },
    open() {
      this.$store.commit('SET_FULL_SCREEN', true)
    },
    toggePlaying() {
      //歌曲加载失败
      if (!this.songReady) {
        return
      }
      this.$store.commit('SET_PLAYING_STATE', !this.playing)
      //歌词加载成功后
      if (this.currentLyric) {
        //调用Lyric内置api togglePlay()
        this.currentLyric.togglePlay()
      }
    },
    next() {
      //歌曲未加载完成，不允执行
      if (!this.songReady) {
        return
      }
      //当歌单只有1个，进行判断
      if (this.playlist.length === 1) {
        this.loop()
        return
      } else {
        let index = this.currentIndex + 1
        if (index === this.playlist.length) {
          index = 0
        }
        this.$store.commit('SET_CURRENT_INDEX', index)
        //如果在暂停时切换，因为watch会使音乐播放，但playing还是false，所有要改变playing
        if (!this.playing) {
          this.toggePlaying()
        }
      }
      //切换完成后songReady要重新变成为false 防止快速切换的bug
      this.songReady = false
    },
    prev() {
      if (!this.songReady) {
        return
      }
      if (this.playlist.length === 1) {
        this.loop()
        return
      } else {
        let index = this.currentIndex - 1
        if (index === -1) {
          index = this.playlist.length -1
        }
        this.$store.commit('SET_CURRENT_INDEX', index)
        if (!this.playing) {
          this.toggePlaying()
        }
      }

      this.songReady = false
    },
    ready() { //canplay:在播放前调用ready
      this.songReady = true
      //保存播放记录
      this.$store.dispatch('savePlayHistor', this.currentSong)
    },
    //歌曲加载失败
    error() {
      console.log('error')
      this.songReady = true
    },
    updateTime(e) {
      //audio内置timeupdata事件触发，改变audio可读写属性currentTime
      this.currentTime = e.target.currentTime
    },
    end() {
      //歌曲结束，判断下一首歌曲
      if (this.mode === playMode.loop) {
        this.loop()
      } else {
        this.next()
      }
    },
    loop() {
      //循环播放
      this.$refs.audio.currentTime = 0
      this.$refs.audio.play()
      //歌词偏移回去
      if (this.currentLyric) {
        this.currentLyric.seek(0)
      }
    },
    //歌词
    getLyric() {
      this.currentSong.getLyric().then((res) => {
        //当前的lyric 不等于res的lyric时，解决多次快速切换时，多个new Lyric
        if (this.currentSong.lyric !== res) {
          return
        }

        this.currentLyric = new Lyric(res, this.handleLyric) //将接收到的字符串解析成对象（引用库）
        if (this.playing) {
          this.currentLyric.play()//插件内置api
        }
      }).catch(() => { //歌词接收失败情况
        this.currentLyric = null
        this.playingLyric = ''
        this.currentLineNum = 0
      })
    },
    //歌词回调函数（当歌词每一行发生改变时回调）
    handleLyric({lineNum, txt}) {
      this.currentLineNum = lineNum
      //自动滚动
      if (lineNum > 5) {
        let lineEl = this.$refs.lyricLine[lineNum - 5]
        this.$refs.lyricList.scrollToElement(lineEl, 1000)
      } else {
        this.$refs.lyricList.scrollTo(0, 0, 1000)
      }
      //当前播放的歌词
      this.playingLyric = txt
    },
    //滑动cd和歌词列表
    middleTouchStart(e) {
      //初始化
      this.touch.initated = true
      // 用来判断是否是一次移动
      this.touch.moved = false
      const firstTouch = e.touches[0]
      this.touch.startX = firstTouch.pageX
      this.touch.startY = firstTouch.pageY
    },
    middleTouchMove(e) {
      if (!this.touch.initated) {
        return
      }
      const firstTouch = e.touches[0]
      const deltaX = firstTouch.pageX - this.touch.startX
      const deltaY = firstTouch.pageY - this.touch.startY
      if (Math.abs(deltaY) > Math.abs(deltaX)) { //认为此时在纵向滚动（上下滚动歌词）
        return
      }
      if (!this.touch.moved) {
        this.touch.moved = true
      }
      //不同状态下（歌词隐藏或显示） 歌词的left 值
      const left = this.currentShow === 'cd' ? 0 : -window.innerWidth
      //滑动的宽度
      const offsetwidth = Math.min(0, Math.max(-window.innerWidth, left + deltaX))
      //滑动的比例
      this.touch.percent = Math.abs(offsetwidth/ window.innerWidth)
      //改变样式 css移动
      this.$refs.lyricList.$el.style[transform] = `translateX(${offsetwidth}px)`
      this.$refs.lyricList.$el.style[transitionDuration] = 0
      this.$refs.middleL.style.opacity = 1 - this.touch.percent
      this.$refs.middleL.style[transitionDuration] = 0
    },
    middleTouchEnd() {
      if (!this.touch.moved) {
        return
      }
      let offsetwidth
      let opacity
      if (this.currentShow === 'cd') { //从右向左滑
        //当滑动到10%时，歌词列表显示
        if (this.touch.percent > 0.1) {
          offsetwidth = -window.innerWidth
          opacity = 0
          this.currentShow = 'lyric'
        } else {
          offsetwidth = 0
          opacity = 1
        }
      } else {                         //从左向右滑
        if (this.touch.percent < 0.9) {
          offsetwidth = 0
          this.currentShow = 'cd'
          opacity = 1
        } else {
          offsetwidth = -window.innerWidth
          opacity = 0
        }
      }
      this.$refs.lyricList.$el.style[transform] = `translateX(${offsetwidth}px)`
      this.$refs.lyricList.$el.style[transitionDuration] = `0.3s`
      this.$refs.middleL.style.opacity = opacity
      this.$refs.middleL.style[transitionDuration] = `0.3s`
    },
    //格式化时间
    format(interval) {
      interval = interval | 0 //向下取整
      const minute = interval /60 | 0
      const second = this._pad(interval % 60)
      return `${minute}:${second}`
    },
    //加‘0’
    _pad(num, n = 2) {
      let len = num.toString().length
      while (len < n) {
        num = '0' + num
        len ++
      }
      return num
    },
    //接收新percent比例（通过滑动后得到新的比例）
    onProgressBarChange(percent) {
      const currentTime = this.currentSong.duration * percent
      this.$refs.audio.currentTime = currentTime
      //【原理】：通过得到新的比例改变audio内置可读写属性currentTime，再通过audio内置timeupdate事件触发updateTime方法，改变data的currentTime值；因为this.currentTime的改变计算属性percent（）也因此改变。
      //【实现】：当进度条手动移动时，音乐播放的currentTime也跟着改变且相等

      //歌词位置
      if (this.currentLyric) {
        this.currentLyric.seek(currentTime * 1000)
      }
    },
    //动画
    _getPosAndScale() {
      const targetWidth = 40  //小圆圈宽度
      const paddingLeft = 40  //中心坐标距离左屏幕宽度
      const paddingBottom = 30  //中心坐标距离底部高度
      const paddingTop = 80  //大圆圈Top的高度
      const width = window.innerWidth * 0.8  //大圆圈的宽度（高度）（自适应80%）
      const scale = targetWidth / width  //初始缩放比例
      const x = -(window.innerWidth / 2 - paddingLeft)  //中心点偏移量x
      const y = window.innerHeight - paddingTop - width / 2 - paddingBottom //中心点偏移量x
      return {x, y, scale}
    },
    enter(el, done) {
      const {x, y, scale} = this._getPosAndScale()
      //动画名animation
      let animation = {
        0: {
          //小圆（相对于大圆的）位置
          transform: `translate(${x}px,${y}px) scale(${scale})`
        },
        60: {
          transform: `translate(0,0) scale(1.1)`
        },
        100: {
          transform: `translate(0,0) scale(1)`
        }
      }
      //使用库create-keyframe-animation
      // 1.注册并配置
      animations.registerAnimation({
        name: 'move', //动画名称
        animation, //动画 （刚刚let的）
        presets: { //间隔
          duration: 400, //时间
          easing: 'linear',// 速度
        }
      })
      //2.运行
      animations.runAnimation(this.$refs.cdWrapper, 'move' ,done)
    },
    afterEnter() {
      //运行完动画之后，注销掉动画
      animations.unregisterAnimation('move')
      this.$refs.cdWrapper.style.animation = ''
    },
    leave(el, done) {
      const {x, y, scale} = this._getPosAndScale()
      this.$refs.cdWrapper.style.transition = `all 0.4s`
      //【注】 下面的transform为兼容性判断dom.js的变量，不是属性名
      this.$refs.cdWrapper.style[transform] = `translate(${x}px,${y}px) scale(${scale})`
      //动画结束，执行回调函数done 监听transitionend 事件在 CSS 完成过渡后触发done回调
      this.$refs.cdWrapper.addEventListener('transitionend', done)
    },
    afterLeave() {
      //运行完动画之后，注销掉动画
      this.$refs.cdWrapper.style.transition = '',
      this.$refs.cdWrapper.style[transform] = ''
    },
  },
  watch: {
    currentSong(newSong, oldSong) {
      //playlist没有歌曲时
      if (!newSong.id || newSong.id === oldSong.id) {
        return
      }
      //清除歌词的计时器
      if (this.currentLyric) {
        this.currentLyric.stop()
      }
      /* 原因： 手机后台不执行js的，当audio播放完成后无法调用end函数 和ready函数  //songReady 一直等于 false
             this.$nextTick(() => {
            this.$refs.audio.play()
            this.getLyric()
          })
          */

      clearTimeout(this.timer)
      this.timer = setTimeout(() => {//当手机从后台切到前台可以重新播放 //歌曲加载完成后播放

        this.$refs.audio.play()
        //加载歌词
        this.getLyric()
      }, 500)
    },
    playing(newPlaying) {
      this.$nextTick(()=>{
        const audio = this.$refs.audio
        //根据playing的布尔值判断是否播放
        newPlaying ? audio.play() : audio.pause()
      })
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .player
    .normal-player
      position: fixed
      left: 0
      right: 0
      top: 0
      bottom: 0
      z-index: 150
      background: $color-background
      .background
        position: absolute
        left: 0
        top: 0
        width: 100%
        height: 100%
        z-index: -1
        opacity: 0.6
        filter: blur(20px)
      .top
        position: relative
        margin-bottom: 25px
        .back
          position absolute
          top: 0
          left: 6px
          z-index: 50
          .icon-back
            display: block
            padding: 9px
            font-size: $font-size-large-x
            color: $color-theme
            transform: rotate(-90deg)
        .title
          width: 70%
          margin: 0 auto
          line-height: 40px
          text-align: center
          no-wrap()
          font-size: $font-size-large
          color: $color-text
        .subtitle
          line-height: 20px
          text-align: center
          font-size: $font-size-medium
          color: $color-text
      .middle
        position: fixed
        width: 100%
        top: 80px
        bottom: 170px
        white-space: nowrap
        font-size: 0
        .middle-l
          display: inline-block
          vertical-align: top
          position: relative
          width: 100%
          height: 0
          padding-top: 80%
          .cd-wrapper
            position: absolute
            left: 10%
            top: 0
            width: 80%
            height: 100%
            .cd
              width: 100%
              height: 100%
              box-sizing: border-box
              border: 10px solid rgba(255, 255, 255, 0.1)
              border-radius: 50%
              &.play
                animation: rotate 20s linear infinite
              &.pause
                animation-play-state: paused
              .image
                position: absolute
                left: 0
                top: 0
                width: 100%
                height: 100%
                border-radius: 50%

          .playing-lyric-wrapper
            width: 80%
            margin: 30px auto 0 auto
            overflow: hidden
            text-align: center
            .playing-lyric
              height: 20px
              line-height: 20px
              font-size: $font-size-medium
              color: $color-text-l
        .middle-r
          display: inline-block
          vertical-align: top
          width: 100%
          height: 100%
          overflow: hidden
          .lyric-wrapper
            width: 80%
            margin: 0 auto
            overflow: hidden
            text-align: center
            .text
              line-height: 32px
              color: $color-text-l
              font-size: $font-size-medium
              &.current
                color: $color-text
      .bottom
        position: absolute
        bottom: 50px
        width: 100%
        .dot-wrapper
          text-align: center
          font-size: 0
          .dot
            display: inline-block
            vertical-align: middle
            margin: 0 4px
            width: 8px
            height: 8px
            border-radius: 50%
            background: $color-text-l
            &.active
              width: 20px
              border-radius: 5px
              background: $color-text-ll
        .progress-wrapper
          display: flex
          align-items: center
          width: 80%
          margin: 0px auto
          padding: 10px 0
          .time
            color: $color-text
            font-size: $font-size-small
            flex: 0 0 30px
            line-height: 30px
            width: 30px
            &.time-l
              text-align: left
            &.time-r
              text-align: right
          .progress-bar-wrapper
            flex: 1
        .operators
          display: flex
          align-items: center
          .icon
            flex: 1
            color: $color-theme
            &.disable
              color: $color-theme-d
            i
              font-size: 30px
          .i-left
            text-align: right
          .i-center
            padding: 0 20px
            text-align: center
            i
              font-size: 40px
          .i-right
            text-align: left
          .icon-favorite
            color: $color-sub-theme
      &.normal-enter-active, &.normal-leave-active
        transition: all 0.4s
        .top, .bottom
          transition: all 0.4s cubic-bezier(0.86, 0.18, 0.82, 1.32)//先快中间慢再快（产生回弹效果）
      &.normal-enter, &.normal-leave-to
        opacity: 0
        .top
          transform: translateY(-100px)
        .bottom
          transform: translateY(100px)
    .mini-player
      display: flex
      align-items: center
      position: fixed
      left: 0
      bottom: 0
      z-index: 180
      width: 100%
      height: 60px
      background: $color-highlight-background
      &.mini-enter-active, &.mini-leave-active
        transition: all 0.4s
      &.mini-enter, &.mini-leave-to
        opacity: 0
      .icon
        flex: 0 0 40px
        width: 40px
        padding: 0 10px 0 20px
        img
          border-radius: 50%
          &.play
            animation: rotate 10s linear infinite
          &.pause
            animation-play-state: paused
      .text
        display: flex
        flex-direction: column
        justify-content: center
        flex: 1
        line-height: 20px
        overflow: hidden
        .name
          margin-bottom: 2px
          no-wrap()
          font-size: $font-size-medium
          color: $color-text
        .desc
          no-wrap()
          font-size: $font-size-small
          color: $color-text-d
      .control
        flex: 0 0 30px
        width: 30px
        padding: 0 10px
        .icon-play-mini, .icon-pause-mini, .icon-playlist
          font-size: 30px
          color: $color-theme-d
        .icon-mini
          font-size: 32px
          position: absolute
          left: 0
          top: 0

  @keyframes rotate
    0%
      transform: rotate(0)
    100%
      transform: rotate(360deg)
</style>
