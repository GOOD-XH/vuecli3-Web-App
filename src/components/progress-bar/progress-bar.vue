<template>
  <div class="progress-bar" ref="progressBar" @click="progressClick">
    <div class="bar-inner">
      <div class="progress" ref="progress"></div>
      <div class="progress-btn-wrapper" ref="progressBtn"
           @touchstart.prevent="progressTouchStart"
           @touchmove.prevent="progressTouchMove"
           @touchend="progressTouchEnd"
      >
        <div class="progress-btn"></div>
      </div>
    </div>
  </div>
</template>

<script>
import {prefixStyle} from "../../common/js/dom";

const progressBtnWidth = 16 //按钮宽度
const transform = prefixStyle('transform')
export default {
  name: "progress-bar",
  props: {
    percent: {
      type: Number,
      default: 0
    }
  },
  created() {
    this.touch = {} //共享touch事件数据
  },
  methods: {
    progressTouchStart(e) {
      this.touch.initiated = true //初始化
      this.touch.startX = e.touches[0].pageX  //事件x轴坐标
      this.touch.left = this.$refs.progress.clientWidth //此时按钮的偏移量
    },
    progressTouchMove(e) {
      if(!this.touch.initiated) {
        return
      }
      const deltaX = e.touches[0].pageX - this.touch.startX //移动的偏移量
      const offsetWidth = Math.min(this.$refs.progressBar.clientWidth - progressBtnWidth, Math.max(0, this.touch.left + deltaX))//此时进度条的移动距离
      this._offset(offsetWidth)
    },
    progressTouchEnd() {
      this.touch.initiated = false
      this._triggerPercent()
    },
    //点击事件
    progressClick(e) {
      //  这里当我们点击 progressBtn 的时候，e.offsetX 获取不对this._offset(e.offsetX)
      const rect = this.$refs.progressBar.getBoundingClientRect()
      //点击偏差值
      const maxWidth = this.$refs.progressBar.clientWidth - progressBtnWidth  //最大值
      const clickWidth = e.pageX - rect.left - progressBtnWidth/2 //点击时，按钮中心点位置（-progressBtnWidth/2为了使点击时按钮在中心）
      //当clickWidth为负数时，为0，大于maxWidth时，为maxWidth
      const offsetWidth = Math.max(0, Math.min(clickWidth, maxWidth))
      this._offset(offsetWidth)
      this._triggerPercent()
    },
    _offset(offsetWidth) {
      //封装函数 改变style的样式
      this.$refs.progress.style.width = `${offsetWidth}px`
      this.$refs.progressBtn.style[transform] = `translateX(${offsetWidth}px)`
    },
    _triggerPercent() {
      const barWidth = this.$refs.progressBar.clientWidth - progressBtnWidth //总宽度
      const percent = Math.min(this.$refs.progress.clientWidth / barWidth,1) //新的比例percent
      this.$emit('percentChange', percent) //派发percentChange，此时percent改变
    }
  },
  watch: {
    percent(newPercent) {
      //进度条托动过程中（this.touch.initiated = true）不受影响
      if (newPercent >= 0 && !this.touch.initiated) {
        const barWidth = this.$refs.progressBar.clientWidth - progressBtnWidth //总宽度
        const offsetWidth = newPercent * barWidth
        this._offset(offsetWidth)
      }
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .progress-bar
    height: 30px
    .bar-inner
      position: relative
      top: 13px
      height: 4px
      background: rgba(0, 0, 0, 0.3)
      .progress
        position: absolute
        height: 100%
        background: $color-theme
      .progress-btn-wrapper
        position: absolute
        left: -8px
        top: -13px
        width: 30px
        height: 30px
        .progress-btn
          position: relative
          top: 7px
          left: 7px
          box-sizing: border-box
          width: 16px
          height: 16px
          border: 3px solid $color-text
          border-radius: 50%
          background: $color-theme
</style>
