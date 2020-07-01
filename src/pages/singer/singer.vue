<template>
  <div class="singer" ref="singer">
    <list-view :singerList="singerList" @selectSinger="selectSinger" ref="list"></list-view>
    <router-view></router-view>
  </div>
</template>

<script type="text/ecmascript-6">
import {playlistMixin} from 'src/common/js/mixin'
import {mapState, mapMutations} from 'vuex'
import Singer from 'src/common/js/singer'
import ListView from 'src/components/listview/listview'
export default {
  name: 'singer',
  mixins: [playlistMixin],
  data() {
    return {
      singerList: [],
      HOT_NAME: "热门",
      HOT_LIST_LEN: 10,
    }
  },
  created() {
    this.$store.dispatch('_getSingerList')
  },
  components: {
    ListView
  },
  computed:{
    ...mapState({
      singers: state => state.singers,
    }),
  },
  methods: {
    //添加mini播放栏的高度
    handlePlaylist(playlist) {
      const bottom = playlist.length > 0 ? '60px' : ''
      this.$refs.singer.style.bottom = bottom
      this.$refs.list.refresh()
    },
    _normalizeSingerList(list) {
      let map = {
        hot: {
          title: this.HOT_NAME,
          items: []
        }
      }
      list.forEach((item, index) => {
        if (index < this.HOT_LIST_LEN) {
          map.hot.items.push(new Singer({
            id: item.Fsinger_mid,
            name: item.Fsinger_name,
          }))
        }
        const key = item.Findex
        if (!map[key]) {
          map[key] = {
            title: key,
            items: []
          }
        }
        map[key].items.push(new Singer({
          id: item.Fsinger_mid,
          name: item.Fsinger_name,
        }))
      })
      let hot = []
      let ret = []
      for (let key in map) {
        let val = map[key]
        if (val.title.match(/[a-zA-Z]/)) {
          ret.push(val)
        } else if (val.title === this.HOT_NAME) {
          hot.push(val)
        }
      }
      ret.sort((a, b) => {
        return a.title.charCodeAt(0) - b.title.charCodeAt(0)
      })
      return hot.concat(ret)
    },
    selectSinger(singer) {
      this.$router.push({
        path:`/singer/${singer.id}`
      })
      this.getSinger(singer)
    },
    ...mapMutations({
      getSinger: 'GETSINGER'
    })
  },
  watch: {
    singers() {
      this.$nextTick(() => {
        this.singerList = this._normalizeSingerList(this.singers)
      })
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .singer
    position: fixed
    top: 88px
    bottom: 0
    width: 100%
</style>
