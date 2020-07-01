import storage from 'good-storage'

const SEARCH_KEY = '__search__' //搜索历史
const SEARCH_MAX_LEN = 15 //最大存储

const PLAY_KEY = '__play__'  //播放历史
const PLAY_MAX_LEN = 200

const FAVORITE_KEY = '__favorite__'
const FAVORITE_MAX_LEN = 200

//插入方法
function insertArray(arr, val, compare, maxLen) {
  //arr：数组， val：新值，compare：findIndex的比较函数， maxLen：最大长度
//[注]fingIndex传入函数
  const index = arr.findIndex(compare)
  //如果原数组中有compare，且为第一个时，return
  if (index === 0) {
    return
  }
  //如果原数组中有compare，不为第一个时，删除原数组中的值
  if (index > 0) {
    arr.splice(index, 1)
  }
  //头部插入val（不管原数组有无）
  arr.unshift(val)
  //插入后，数组长度大于最大值maxLen时，数组末尾删除
  if (maxLen && arr.length > maxLen) {
    arr.pop()
  }
}
//删除方法
function deleteFromArray(arr, compare) {
  const index = arr.findIndex(compare)
  //找到对应下标
  if (index > -1) {
    arr.splice(index, 1)
  }
}
//保存搜索历史
export function saveSearch(query) {
  //1.先得到当前SEARCH_KEY存储空间的情况， 默认为空数组
  let searches = storage.get(SEARCH_KEY, [])
  //2.插入数据
  insertArray(searches, query, (item) => {
    return item === query
  }, SEARCH_MAX_LEN)
  storage.set(SEARCH_KEY, searches)
  //返回新的列表
  return searches
}
//从本地locaStrorage中获取默认值，给state的searchHistory
export function loadSearch() {
  return storage.get(SEARCH_KEY, [])
}
//删除单个
export function deleteSearch(query) {
  let searches = storage.get(SEARCH_KEY, [])
  deleteFromArray(searches, (item) => {
    return item === query
  })
  storage.set(SEARCH_KEY, searches)
  return searches
}
//清理所有
export function clearSearch() {
  storage.remove(SEARCH_KEY)
  return []
}

//保存播放历史
export function savePlay(song) {
  let songs = storage.get(PLAY_KEY, [])
  insertArray(songs, song, (item) => {
    return song.id === item.id
  }, PLAY_MAX_LEN)
  storage.set(PLAY_KEY, songs)
  return songs
}
//读取
export function loadPlay() {
  return storage.get(PLAY_KEY, [])
}
//保存我喜欢的
export function saveFavorite(song) {
  let songs = storage.get(FAVORITE_KEY, [])
  insertArray(songs, song, (item) => {
    return song.id === item.id
  }, FAVORITE_MAX_LEN)
  storage.set(FAVORITE_KEY, songs)
  return songs
}
//删除我喜欢的
export function deleteFavorite(song) {
  let songs = storage.get(FAVORITE_KEY, [])
  deleteFromArray(songs, (item) => {
    return item.id === song.id
  })
  storage.set(FAVORITE_KEY, songs)
  return songs
}
//读取
export function loadFavorite() {
  return storage.get(FAVORITE_KEY, [])
}

