<template>
  <scroll ref="suggest" class="suggest"
          :data="result" :pullup="pullup"
          @scrollToEnd="searchMore"
          :beforeScroll="beforeScroll"
          @beforeScroll="listScroll"
  >
    <ul class="suggest-list">
      <li class="suggest-item" v-for="(item, index) in result" :key="index"
          @click="selectItem(item)"
      >
        <div class="icon">
          <i :class="getIconCls(item)"></i>
        </div>
        <div class="name">
          <p class="text" v-html="getDisplayName(item)"></p>
        </div>
      </li>
      <loading v-show="hasMore" title=""></loading>
    </ul>
    <div class="no-result-wrapper" v-show="!hasMore && !result.length">
      <no-eesult title="暂无搜索结果"></no-eesult>
    </div>
  </scroll>
</template>

<script>
import {search} from "../../api/search"
import {createSong} from "../../common/js/song"
import Scroll from 'src/components/scroll/scroll'
import Loading from 'src/components/loading/loading'
import Singer from 'src/common/js/singer'
import NoEesult from 'src/components/no-result/no-result'

const TYPE_SINGER = 'singer'
const perpage = 20 //每一页的最大数据
const SONGURL = `http://ws.stream.qqmusic.qq.com/C400003mBrF72dILfK.m4a?guid=358840384&vkey=E565AF473BAD38B64ADE9AE11C480111D11C2D8857D02BC502078FC65D3CF6F00FF76469AC64602625F7AA4F61E529024AB5500B8D725C3E&uin=0&fromtag=66`
export default {
  name: "suggest",
  props: {
    query: {
      type: String,
      default: ''
    },
    showSinger: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      page: 1, //页数，下滑刷新
      result: [],
      pullup: true,
      hasMore: true, //下滑刷新,是否还有数据
      song: [],
      beforeScroll: true
    }
  },
  components: {
    Scroll,
    Loading,
    NoEesult
  },
  methods: {
    //在滚动条滚动之前，向父组件发射方法
    listScroll() {
      this.$emit('listScroll')
    },
    //路由跳转
    selectItem(item) {
      //点击的item为歌手singer时
      if (item.type === TYPE_SINGER) {
        const singer = new Singer({
          id: item.singermid,
          name: item.singername
        })
        this.$router.push({
          path: `/search/${singer.id}`
        })
        this.$store.commit('GETSINGER', singer)
      } else {//是歌sing时
        this.$store.dispatch('_insertSong', item)
      }
      //向外发射搜索历史
      this.$emit('select')
    },
    //判读是否是歌手singer
    getIconCls(item) {
      if (item.type === TYPE_SINGER) {
        return 'icon-mine'
      } else {
        return 'icon-music'
      }
    },
    //添加内容
    getDisplayName(item) {
      if (item.type === TYPE_SINGER) {
        return item.singername
      }else {
        return `${item.name}-${item.singer}`
      }
    },
    //当滑动到底部是触发下拉刷新
    searchMore() {
      if (!this.hasMore) {
        return
      }
      //页数增加，重新获取数据
      this.page ++
      search(this.query,this.page,this.showSinger, perpage).then((res) =>{
        if (res.code === 0) {
          //将获取的数据与原本的数据进行拼接
          this.result = this.result.concat(this._getResult(res.data))
          this._checkMore(res.data)
        }
      })
    },
    //第一次数据获取
     search() {
      this.page = 1 //当query改变时，必须从第一页开始加载
      this.$refs.suggest.scrollTo(0,0)
      this.hasMore = true
      search(this.query,this.page,this.showSinger, perpage).then(res => {
        if (res.code === 0) {
          this.result = this._getResult(res.data)
          //格式化数据song
          //检测下次下拉是否还有数据
          this._checkMore(res.data)
        }
      })
    },
    //检测下拉刷新是否还有数据
    _checkMore(data) {
      const song = data.song
      if (!song.list.length || (song.curnum + song.curpage * perpage) >= song.totalnum) {
        this.hasMore = false
      }
    },
    _getResult(data) {
      let ret = []
      if (data.zhida && data.zhida.singerid) { //返回数据有singerid时
        ret.push({...data.zhida, type: TYPE_SINGER})
      }
      if (data.song) {
        ret = ret.concat(this._normalizeSongs(data.song.list))
      }
      return ret
    },
    _normalizeSongs(list) {
      let ret = []
      list.forEach((musicData) => {
        if (musicData.songid && musicData.albummid) {
          ret.push(createSong(musicData, SONGURL))
        }
      })
      return ret
    },
    refresh() {
      this.$refs.suggest.refresh()
    }
  },
  watch: {
    query() { //当关键词改变时，重新抓取数据
      this.search()
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .suggest
    height: 100%
    overflow: hidden
    .suggest-list
      padding: 0 30px
      .suggest-item
        display: flex
        align-items: center
        padding-bottom: 20px
      .icon
        flex: 0 0 30px
        width: 30px
        [class^="icon-"]
          font-size: 14px
          color: $color-text-d
      .name
        flex: 1
        font-size: $font-size-medium
        color: $color-text-d
        overflow: hidden
        .text
          no-wrap()
    .no-result-wrapper
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>
