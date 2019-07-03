Page({
  data: {
    // eqDataList:[],
    eqname:''
  },

  onLoad: function (options) {
    var eqname = options.eqname
    var that = this
    wx.request({
      url: 'http://47.100.12.130:3111/api/ims/deviceData?devicename=' + eqname,
      method: 'GET',
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success(res){
        var datalist = res.data.imsLastData
        console.log('22222222222222222222----'+res.data.imsLastData.id)
        console.log('22222222222222222222---'+res.data.imsLastData.code)
        that.setData({
          eqDataList:datalist,
          eqname:options.eqname
        })
        //   for(var i in datalist) {
      //     that.eqDataList.push(datalist[i])
      //   }
      //  console.log(that.eqDataList)
      },
    })  

    // that.setData({
    //   eqname:options.eqname
    // })
    // console.log('1111111111------'+that.eqDataList.id)
      
      
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