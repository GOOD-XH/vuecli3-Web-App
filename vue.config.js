const path = require('path')
function resolve(dir) {
  return path.join(__dirname, dir)
}
module.exports = {
  devServer: {
    proxy: {
      '/baidu': {
        target: 'https://u.y.qq.com/cgi-bin/musicu.fcg',
        bypass: function(req, res,proxyOptions){
          req.headers.referer = 'https://y.qq.com/portal/player.html';
          req.headers.host = 'c.y.qq.com';
        },
        changeOrigin: true,
        pathRewrite: {
          '^/baidu': ''
        }
      },
      '/api/getDiscList': {
        target: 'https://c.y.qq.com/splcloud/fcgi-bin/fcg_get_diss_by_tag.fcg',
        bypass: function(req, res,proxyOptions){
          req.headers.referer = 'https://c.y.qq.com/';
          req.headers.host = 'c.y.qq.com';
        },
        changeOrigin: true,
        pathRewrite: {
          '^/api/getDiscList': ''
        }
      },
      '/api/lyric': {
        target: 'https://c.y.qq.com/lyric/fcgi-bin/fcg_query_lyric_new.fcg',
        bypass: function(req, res,proxyOptions){
          req.headers.referer = 'https://c.y.qq.com/';
          req.headers.host = 'c.y.qq.com';
        },
        changeOrigin: true,
        pathRewrite: {
          '^/api/lyric': ''
        }
      },
      '/api/getSongList': {
        target: 'https://c.y.qq.com/qzone/fcg-bin/fcg_ucc_getcdinfo_byids_cp.fcg',
        bypass: function(req, res,proxyOptions){
          req.headers.referer = 'https://c.y.qq.com/';
          req.headers.host = 'c.y.qq.com';
        },
        changeOrigin: true,
        pathRewrite: {
          '^/api/getSongList': ''
        }
      },
      '/api/search': {
        target: 'https://c.y.qq.com/soso/fcgi-bin/search_for_qq_cp',
        bypass: function(req, res,proxyOptions){
          req.headers.referer = 'https://c.y.qq.com/';
          req.headers.host = 'c.y.qq.com';
        },
        changeOrigin: true,
        pathRewrite: {
          '^/api/search': ''
        }
      },
    }
  },
  chainWebpack: config => {
    config
      .plugin('html')
        .tap(args => {
          args[0].title = 'music'
          return args
        })
  },
  configureWebpack: {
    resolve: {
      extensions: ['.js', '.vue', '.json'],
      alias: {
        'vue$': 'vue/dist/vue.esm.js',
        '@': resolve('src'),
        'src': resolve('src'),
        'components': resolve('src/components'),
        'common': resolve('src/common')
      }
    }
  },
}
