// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

var rp = require('request-promise');

// 云函数入口函数
exports.main = async (event, context) => {
  
  return await rp(`https://api.douban.com/v2/movie/${event.movieid}?apikey=054022eaeae0b00e0fc068c0c0a2102a`)
  .then(function (res) {
    // console.log(res);
      return res;
  })
  .catch(function (err) {
      console.log(err)
  });
}