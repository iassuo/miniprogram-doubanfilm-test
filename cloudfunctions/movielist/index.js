// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

var rp = require('request-promise');

// 云函数入口函数
exports.main = async (event, context) => {

  // 不可能一次性把所有数据都拿过来。start指从多少条开始取，count指一次取多少条数据
  return rp(`https://frodo.douban.com/api/v2/subject_collection/movie_showing/items?start=${event.start}&count=${event.count}&apiKey=054022eaeae0b00e0fc068c0c0a2102a`)
  .then(function (res) {
    console.log(res);
      return res;
  })
  .catch(function (err) {
      console.log(err)
  });
}