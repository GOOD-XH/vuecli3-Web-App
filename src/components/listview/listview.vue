<template>
  <scroll class="listview"
          ref="listview"
          :data="singerList"
          :probeType="3"
          :listen-scroll="listenScroll"
          @scroll="scroll"
  >
    <ul ref="leftUl">
      <li class="list-group" v-for="(group) in singerList" :key="group.title" ref="listGroup">
        <h2 class="list-group-title">{{group.title}}</h2>
        <ul>
          <li class="list-group-item" v-for="(item) in group.items" :key="item.id"
          @click="selectItem(item)">
            <img class="avatar" v-lazy="item.avatar">
            <span class="name">{{item.name}}</span>
          </li>
        </ul>
      </li>
    </ul>
    <div class="list-shortcut" @touchstart.stop.prevent="onShortcutTouchStart" @touchmove.stop.prevent="onShortcutTouchMove">
      <ul ref="rightUl">
        <li class="item" v-for="(item, index) in shortcutList" :key="index" ref="rightLi"
            :data-index="index"
        :class="{current: currentIndex === index}">
          {{item}}
        </li>
      </ul>
    </div>
    <div class="list-fixed" ref="fixed" v-show="fixedTitle">
      <div class="fixed-title">{{fixedTitle}} </div>
    </div>
    <div v-show="!singerList.length" class="loading-container">
      <loading></loading>
    </div>
  </scroll>
</template>

<script type="text/ecmascript-6">
import Scroll from 'src/components/scroll/scroll'
import loading from 'src/components/loading/loading'
import {getData} from "../../common/js/dom";

export default {
  props: ['singerList'],
  data () {
    return {
      scrollY: -1,
      tops: [],
    }
  },
  components: {
    Scroll,
    loading
  },
  computed: {
    shortcutList() {
      return this.singerList.map((group) => {
        return group.title.substring(0,1)
      })
    },
    currentIndex () {
      const {scrollY, tops} = this
      let index
      if (scrollY > 0) {
        index = 0
      } else {
        index = tops.findIndex((top, index) => scrollY <= top && scrollY > tops[index + 1])
      }
      return index
    },
    fixedTitle () {
      if (this.scrollY > 0) {
        return ''
      }
      return this.singerList[this.currentIndex] ? this.singerList[this.currentIndex].title : ''
    },
  },
  methods: {
    initTops () {
      const tops = []
      let top = 0
      tops.push(top)
      const lis = this.$refs.leftUl.children
      Array.from(lis).reduce((pre, li) => {
        top += (-li.clientHeight)
        pre.push(top)
        return pre
      }, tops)
      return this.tops = tops
    },
    scroll (pos) {
      this.scrollY = pos.y
    },
    onShortcutTouchStart (event) {
      let anchorIndex = getData(event.target, 'index')
      let firstTouch = event.touches[0]
      this.touch.y1 = firstTouch.pageY
      this.touch.anchorIndex = anchorIndex
      this._scrollToElement(anchorIndex)
    },
    onShortcutTouchMove(event) {
      let firstTouch = event.touches[0]
      this.touch.y2 = firstTouch.pageY
      let delta = (this.touch.y2 - this.touch.y1)/18 | 0

      let anchorIndex = parseInt(this.touch.anchorIndex) + delta
      this._scrollToElement(anchorIndex)
    },
    _scrollToElement(index) {
      if (!index && index !== 0) {
        return
      }
      if (index < 0) {
        index = 0
      } else if (index > this.$refs.rightLi.length - 1) {
        index = this.$refs.rightLi.length - 1
      }
      this.$refs.listview.scrollToElement(this.$refs.listGroup[index], 0)
    },
    selectItem(item) {
      this.$emit('selectSinger', item)
    },
    //导航条重新刷新（暴露给singer）
    refresh() {
      this.$refs.listview.refresh()
    }
  },
  created() {
    this.touch = {}
    this.listenScroll = true
  },
  mounted() {
    this.$nextTick(() => {
      this.initTops()
    })
  },
  watch: {
    singerList() {
      this.$nextTick(() => {
        this.initTops()
      })
    },
    scrollY(newVal) {
      const {tops, currentIndex} = this
      let height = newVal - tops[currentIndex+1]
      const TITLE_HEIGHT = 28
      let fixedTop = (height > 0 && height < TITLE_HEIGHT) ? (height - TITLE_HEIGHT) : 0
      this.$refs.fixed.style.transform = `translateY(${fixedTop}px)`
    }
  }
}

</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .listview
    position: relative
    width: 100%
    height: 100%
    overflow: hidden
    background: $color-background
    .list-group
      padding-bottom: 30px
      .list-group-title
        height: 30px
        line-height: 30px
        padding-left: 20px
        font-size: $font-size-small
        color: $color-text-l
        background: $color-highlight-background
      .list-group-item
        display: flex
        align-items: center
        padding: 20px 0 0 30px
        .avatar
          width: 50px
          height: 50px
          border-radius: 50%
        .name
          margin-left: 20px
          color: $color-text-l
          font-size: $font-size-medium
    .list-shortcut
      position: absolute
      z-index: 30
      right: 0
      top: 50%
      transform: translateY(-50%)
      width: 20px
      padding: 20px 0
      border-radius: 10px
      text-align: center
      background: $color-background-d
      font-family: Helvetica
      .item
        padding: 3px
        line-height: 1
        color: $color-text-l
        font-size: $font-size-small
        &.current
          color: $color-theme
    .list-fixed
      position: absolute
      top: 0
      left: 0
      width: 100%
      .fixed-title
        height: 30px
        line-height: 30px
        padding-left: 20px
        font-size: $font-size-small
        color: $color-text-l
        background: $color-highlight-background
    .loading-container
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>

