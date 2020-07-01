<template>
  <transition name="slide">
    <music-list :title="title" :bg-image="bgImage" :songs="songs"></music-list>
  </transition>
</template>

<script>
import MusicList from 'src/components/music-list/music-list'
import {getSongList} from "../../api/recommend";
import {mapState} from 'vuex'
import {createDiscSong} from "../../common/js/song";
import {getSongVkey} from 'src/api/singer'
export default {
  name: "disc",
  data() {
    return {
      songs: []
    }
  },
  components: {
    MusicList
  },
  computed: {
    ...mapState({
      disc: state => state.disc
    }),
    title() {
      return this.disc.dissname
    },
    bgImage() {
      return this.disc.imgurl
    }
  },
  created() {
    this._getSongList()
  },
  methods: {
    async _getSongList() {
      if (!this.disc.dissid) {
        this.$router.push('/recommend')
      }
      const result = await  getSongList(this.disc.dissid)
      if (result.code === 0) {
        console.log(result.cdlist[0].songlist)
        this.songs = this._normalizeSongs(result.cdlist[0].songlist)
      }
    },
    _normalizeSongs(list) {
      let ret = []
      list.forEach((musicData)=>{
        let getSongUrl = (async (musicData) => {
          const res = await getSongVkey(musicData.mid)
          if (musicData.file && musicData.album) {
            ret.push(createDiscSong(musicData, res.data.musicUrl))
          }
        })
        getSongUrl(musicData)
      })
      return ret
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .slide-enter-active, .slide-leave-active
    transition: all 0.3s

  .slide-enter, .slide-leave-to
    transform: translate3d(100%, 0, 0)
</style>
