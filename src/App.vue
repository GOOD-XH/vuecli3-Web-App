<template>
  <div id="app">
    <m-header></m-header>
    <tab></tab>
    <keep-alive>
    <router-view></router-view>
    </keep-alive>
    <player></player>
  </div>
</template>

<script>
import MHeader from 'components/m-header/m-header'
import Tab from 'components/tab/tab'
import Player from 'components/player/player'
import {getBaidu} from "./api/song";
import {getMusicList} from "./api/rank";

export default {
  name: 'App',
  components: {
    MHeader,
    Tab,
    Player
  },
  mounted () {
    this.$store.dispatch('_getRecommend')
    this.$store.dispatch('_getDiscList')
/*    getBaidu()*/
/*    getMusicList(4)*/
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>

</style>
