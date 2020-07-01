<template>
  <transition name="slide">
    <music-list :songs="songs" :title="title" :bgImage="bgImage"></music-list>
  </transition>
</template>

<script>
import {mapState} from 'vuex'
import MusicList from 'src/components/music-list/music-list'
import {getSingerDetail, getSongVkey} from 'src/api/singer'
import {createSong} from 'src/common/js/song'
export default {
  name: "singer-detall",
  data() {
    return {
      songs: [],
    }
  },
  created() {
      this._getDetail()
    },
  components: {
    MusicList
  },
  methods: {
    async _getDetail() {
      if (!this.singer.id) {
        this.$router.push('/singer')
        return
      }
      const result = await getSingerDetail(this.singer.id)
      if (result.code === 0) {
        this.songs = this._normalizeSongs(result.data.list)
      }
    },
     _normalizeSongs(list) {
      let ret = []
       list.forEach((item) => {
        let {musicData} = item
         //axios获取数据
         let getSongUrl = (async ({musicData}) => {
           const res = await getSongVkey(musicData.songmid)
           if (musicData.songid) {
             ret.push(createSong(musicData,res.data.musicUrl))
           }
         })
         getSongUrl({musicData})
     })
      return ret
    },
  },
  computed: {
    ...mapState({
      singer: state => state.singer,
    }),

    title() {
      return this.singer.name
    },
    bgImage() {
      return this.singer.avatar
    },
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  @import "~common/stylus/variable"

  .slide-enter-active, .slide-leave-active
    transition: transform  .3s
  .slide-enter, .slide-leave-to
    transform: translateX(100%)
</style>
