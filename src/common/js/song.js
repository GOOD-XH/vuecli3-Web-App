import {getLyric} from "../../api/song";
import {ERR_OK} from "../../api/config";
import {Base64} from 'js-base64'
export default class Song {
  constructor({id, mid, singer, name, album, duration, image, url}) {
    this.id = id
    this.mid = mid
    this.singer = singer
    this.name = name
    this.album = album
    this.duration = duration
    this.image = image
    this.url = url
  }
  getLyric() {
    if (this.lyric) {
      return Promise.resolve(this.lyric)
    }
    return new Promise((resolve, reject) => {
      getLyric(this.mid).then((res) => { //接收数据res
        if (res.retcode === ERR_OK) {
          this.lyric = Base64.decode(res.lyric) //把接收的Base64数据解析成字符串
          resolve(this.lyric) //向外发出成功数据lyric
        } else {
          reject('no lyric')
        }
      })
    })
  }
}
//歌手singer的歌
export function createSong(musicData, songVkey) {
  return new Song({
    id: musicData.songid,
    mid: musicData.songmid,
    singer: filterSinger(musicData.singer),
    name: musicData.songname,
    album: musicData.albumname +"  "+ musicData.albumdesc,
    duration: musicData.interval,
    image: `https://y.gtimg.cn/music/photo_new/T002R300x300M000${musicData.albummid}.jpg?max_age=2592000`,
    url: filterUrl(musicData, songVkey)//报错时，url也改变
 })
}
//热门歌单的歌
export function createDiscSong(musicData ,songVkey) {
  return new Song({
    id:  musicData.id,
    mid: musicData.mid,
    singer: filterSinger(musicData.singer),
    name: musicData.name,
    album: musicData.album.name,
    duration: musicData.interval,
    image: `https://y.gtimg.cn/music/photo_new/T002R300x300M000${musicData.album.mid}.jpg?max_age=2592000`,
    url: filterUrl(musicData, songVkey)
  })
}
function filterSinger(singer) {
  let ret = []
  if (!singer) {
    return ''
  }
  singer.forEach((s)=> {
    ret.push(s.name)
  })
  return ret.join('/')
}
function filterUrl(musicData, songUrl) {
  if (!songUrl) { //没有参数直接return
    return
  }
  if (songUrl.length>50) {
    return songUrl
  } else {
    return `${musicData.songid}`
  }
}


