// pages/comment/comment.js
const db = wx.cloud.database();

Page({

  /**
   * 页面的初始数据
   */
  data: {
      detail: {},
      content : '', // 用户评价
      score: 5, // 默认评分
      images: [], // 用户选择的图片
      fileids: [],  // 图片id
      movieid: -1
    },
    onChange:function(event){
      this.setData({
        content: event.detail
      })
    },
    onScoreChange: function(event){
      this.setData({
        score: event.detail
      })
    },
    chooseImages:function(){
      wx.chooseImage({
        count: 3,
        sizeType: ['original', 'compressed'],
        sourceType: ['album', 'camera'],
        success: res => {
          // tempFilePath可以作为img标签的src属性显示图片
          const tempFilePaths = res.tempFilePaths;
          console.log(tempFilePaths);
          this.setData({
            images: this.data.images.concat(tempFilePaths)
          })
        }
      })
    },
    submit:function(){
      wx.showLoading({
        title: '评论中...',
      })
      // 上传图片到云存储
      let promiseArr = [];
      for(let i = 0; i< this.data.images.length; i++){
        promiseArr.push(new Promise((resolve,reject)=>{
          let item = this.data.images[i];
          let suffix = /\.\w+$/.exec(item)[0];  // 正则额表达式，返回文件扩展名
          wx.cloud.uploadFile({
            // 指定上传到的云路径
            cloudPath: new Date().getTime() + suffix, //上传到云端的路径
            // 指定要上传的文件的小程序临时文件路径
            filePath: item,
            // 成功回调
            success: res => {
              // console.log('上传成功', res)
              this.setData({
                fileids: this.data.fileids.concat(res.fileID)
              });
              resolve()
            },
            fail: console.error
          })
        }))
      }

      Promise.all(promiseArr).then(res=>{
        db.collection('comments').add({
          data: {
            content: this.data.content,
            score: this.data.score,
            movieid: this.data.movieid,
            fileids: this.data.fileids
          }
        }).then(res=>{
          wx.hideLoading()
        }).catch(err=>{
          wx.hideLoading();
          wx.showToast({
            title: '提交失败',
          })
        })
      })
    },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      movieid: options.movieid
    })
    var that = this;
    // console.log(options.movieid); // options包含了该条电影的movieid
    wx.request({
      url:  `https://frodo.douban.com/api/v2/movie/${options.movieid}?apiKey=054022eaeae0b00e0fc068c0c0a2102a`,
      method: 'GET',
      success(res){
        console.log(res.data);
        that.setData({
          detail: res.data
        })
      }
    })
    // wx.cloud.callFunction({
    //   name: 'getDetail',
    //   data: {
    //     movieid: options.movieid
    //   }
    // }).then(res=>{
    //   console.log(res)
    // }).catch(err=>{
    //   console.log(err)
    // })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})