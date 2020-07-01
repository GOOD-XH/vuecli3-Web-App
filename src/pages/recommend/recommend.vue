<template>
  <div class="recommend" ref="recommend">
    <scroll ref="scroll" class="recommend-content" :data="disLists">
      <div>
          <Slider :recommends="recommends" :loading="loading"></Slider>
        <div class="recommend-list">
          <h1 class="list-title">热门歌单推荐</h1>
          <ul>
            <li class="item" v-for="(disList, index) in disLists" :key="index"
            @click="selectItem(disList)">
              <div class="icon">
                <img width="60" height="60" v-lazy="disList.imgurl">
              </div>
              <div class="text">
                <h2 class="name">{{disList.creator.name}}</h2>
                <p class="desc">{{disList.dissname}}</p>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div class="loading-content" v-show="!disLists.length">
        <loading></loading>
      </div>
    </scroll>
    <router-view></router-view>
  </div>
</template>

<script type="text/ecmascript-6">
import {playlistMixin} from 'src/common/js/mixin'
import Slider from 'src/components/Slider/Slider'
import {mapState} from 'vuex'
import Scroll from 'src/components/scroll/scroll'
import loading from 'src/components/loading/loading'
export default {
  mixins: [playlistMixin],
  components: {
    Slider,
    Scroll,
    loading
  },
  computed: {
    ...mapState({
      recommends: state => state.recommends,
      disLists: state => state.disLists,
    })
  },
  methods: {
    //添加mini播放栏的高度(减少自身的高度)
    handlePlaylist(playlist) {
      const bottom = playlist.length > 0 ? '60px' : ''
      this.$refs.recommend.style.bottom = bottom
      this.$refs.scroll.refresh()
    },
    loading(){
      this.$refs.scroll.refresh()
      /*this.checkLoader = true*/
    },
    //点击歌单，路由跳转，发送参数此歌单,
    selectItem(disList) {
      this.$router.push({
        path:`/recommend/${disList.dissid}`
      })
      this.$store.commit('SET_DISC', disList)
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .recommend
    position: fixed
    width: 100%
    top: 88px
    bottom: 0
    .recommend-content
      height: 100%
      overflow: hidden
      .recommend-list
        .list-title
          height: 65px
          line-height: 65px
          text-align: center
          font-size: $font-size-medium
          color: $color-theme
        .item
          display: flex
          box-sizing: border-box
          align-items: center
          padding: 0 20px 20px 20px
          .icon
            flex: 0 0 60px
            width: 60px
            padding-right: 20px
          .text
            display: flex
            flex-direction: column
            justify-content: center
            flex: 1
            line-height: 20px
            overflow: hidden
            font-size: $font-size-medium
            .name
              margin-bottom: 10px
              color: $color-text
            .desc
              color: $color-text-d
      .loading-container
        position: absolute
        width: 100%
        top: 50%
        transform: translateY(-50%)
</style>
