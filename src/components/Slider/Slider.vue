<template>
  <div class="slider-nav"  v-if="recommends.length" ref="sliderWrapper">
  <div class="swiper-container" ref="slider">
    <div class="swiper-wrapper" ref="sliderGroup">
      <div class="swiper-slide" v-for="(recommend, index) in recommends" :key="index">
        <a :href="recommend.linkUrl">
          <img class="needsclick" @load="loadImage" :src="recommend.picUrl" >
        </a>
      </div>
    </div>
    <div class="swiper-pagination"></div>
  </div>
  </div>
</template>

<script>
import Swiper from 'swiper'
import 'swiper/css/swiper.min.css'
export default {
  name: "Slider",
  props: {
    recommends: Array,
    loading: Function
  },
  methods: {
    loadImage() {
      this.loading()
    }
  },
  watch: {
    recommends() {
      this.$nextTick(() =>{
        let mySwiper = new Swiper('.swiper-container', {
          loop: true,
          autoplay: {
            delay: 3000,
            stopOnLastSlide: false,
            disableOnInteraction: false,
          },
          pagination: {
            el: '.swiper-pagination',
            clickable :true,
          },
        })
        for( let i = 0;i< mySwiper.pagination.bullets.length;i++){
          mySwiper.pagination.bullets[i].onmouseover=function(){
            this.click();
          };
        }
      })
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  .swiper-container
    min-height: 1px
    width 100%
    .swiper-wrapper
      position: relative
      white-space: nowrap
      .swiper-slide
        box-sizing: border-box
        text-align: center
        height 100%
        a
          display: block
          width: 100%
          text-decoration: none
        img
          display: block
          width: 100%
    .swiper-pagination
      --swiper-pagination-color white
      opacity .6
</style>
