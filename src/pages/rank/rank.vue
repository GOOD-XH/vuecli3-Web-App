<template>
  <div class="rank" ref="rank">
    <Scroll class="toplist" ref="toplist" :data="topLists">
      <ul>
        <li class="item" v-for="(topList, index) in topLists" :key="index" @click="selectItem(topList)">
          <div class="icon">
            <img width="100" height="100" v-lazy="topList.picUrl"/>
          </div>
          <ul class="songlist">
            <li class="song" v-for="(song, index) in topList.songList" :key="index">
              <span>{{index + 1}}.</span>
              <span>{{song.songname}}-{{song.singername}}</span>
            </li>
          </ul>
        </li>
      </ul>
      <div class="loading-container" v-show="!topLists.length">
        <loading></loading>
      </div>
    </Scroll>
    <router-view></router-view>
  </div>
</template>

<script type="text/ecmascript-6">
import {getTopList} from "../../api/rank";
import Scroll from 'src/components/scroll/scroll'
import Loading from 'src/components/loading/loading'
import {playlistMixin} from "../../common/js/mixin";

export default {
  mixins: [playlistMixin],
    data() {
      return {
        topLists: [] //排行歌单列表
      }
    },
    components: {
      Scroll,
      Loading
    },
    created() {
      this._getTopList()
    },
    methods: {
      //添加mini播放栏的高度(减少自身的高度)
      handlePlaylist(playlist) {
        const bottom = playlist.length > 0 ? '60px' : ''
        this.$refs.rank.style.bottom = bottom
        this.$refs.toplist.refresh()
      },
      selectItem(topList) {
        this.$router.push({
          path: `/rank/${topList.id}`
        })
        this.$store.commit('SET_TOP_LIST', topList)
      },
      _getTopList() {
        getTopList().then((res) => {
          if (res.code === 0) {
            this.topLists = res.data.topList
          }
        })
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .rank
    position: fixed
    width: 100%
    top: 88px
    bottom: 0
    .toplist
      height: 100%
      overflow: hidden
      .item
        display: flex
        margin: 0 20px
        padding-top: 20px
        height: 100px
        &:last-child
          padding-bottom: 20px
        .icon
          flex: 0 0 100px
          width: 100px
          height: 100px
        .songlist
          flex: 1
          display: flex
          flex-direction: column
          justify-content: center
          padding: 0 20px
          height: 100px
          overflow: hidden
          background: $color-highlight-background
          color: $color-text-d
          font-size: $font-size-small
          .song
            no-wrap()
            line-height: 26px
      .loading-container
        position: absolute
        width: 100%
        top: 50%
        transform: translateY(-50%)
</style>
