import {playMode} from 'src/common/js/config'
import {loadSearch, loadPlay, loadFavorite} from "../common/js/cache";
export default {
  recommends: [],
  disLists: [],
  singers: [],
  singer: {}, //当前选择的歌手数据
  playing: false,//播放
  fullScreen: false ,//全屏
  playlist: [],//播放列表
  sequenceList: [],//顺序列表
  mode: playMode.sequence, //播放模式
  currentIndex: -1,//播放索引
  disc: {},//热门歌单
  topList: {},//当前点击的排行列表
  searchHistory: loadSearch(),//搜索历史
  playHistory: loadPlay(),//播放历史
  favoriteList: loadFavorite() //我喜欢的收藏列表
}
