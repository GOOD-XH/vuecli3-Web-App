<template>
  <transition name="slide">
    <music-list :title="title" :bg-image="bgImage" :songs="songs" :rank="rank"></music-list>
  </transition>
</template>

<script>
import {mapState} from 'vuex'
import MusicList from 'src/components/music-list/music-list'
import {getMusicList} from "../../api/rank";
import {createSong} from "../../common/js/song";
import {getSongVkey} from "../../api/singer";

export default {
  name: "top-list",
  data() {
    return {
      songs: [],//歌单
      rank: true//排行，传给song-list
    }
  },
  components: {
    MusicList
  },
  computed: {
    ...mapState({
      topList: state => state.topList
    }),
    title() {
      return this.topList.topTitle
    },
    bgImage() { // 第一首个的图片
      if (this.songs.length) {
        return this.songs[0].image
      }
      return ''
    }
  },
  created() {
    this._getMusicList()
  },
  methods: {
    _getMusicList() {
      if (!this.topList.id) {
        this.$router.push('/rank')
        return
      }
      getMusicList(this.topList.id).then((res) => {
        if (res.code === 0) {
          this.songs = this._normalizeSongs(res.songlist)
        }
      })
    },
    _normalizeSongs(list) {
      let ret = []
      list.forEach((item) => {
        const musicData = item.data
        let getSongUrl = (async (musicData) => {
          const res = await getSongVkey(musicData.songmid)
          if (musicData.songid && musicData.albumid) {
            ret.push(createSong(musicData, res.data.musicUrl))
          }
        })
        getSongUrl(musicData)
      })
      return ret
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  .slide-enter-active, .slide-leave-active
    transition: all 0.3s ease

  .slide-enter, .slide-leave-to
    transform: translate3d(100%, 0, 0)
</style>
