Page({

  data: {
    tabs: ["实时数据", "历史数据", "可视化"],
    activeIndex: 0,
    sliderOffset: 0,
    sliderLeft: 0,
    eqname:''
},


// 分类栏切换
tabClick: function (e) {
  this.setData({
    sliderOffset: e.currentTarget.offsetLeft,
    activeIndex: e.currentTarget.id
  });
},


  onLoad: function (options) {
    // 要查询的设备名称eqname
    var eqname = options.eqname
    var that = this
    var that = this;
    wx.showLoading({
      title: '获取中...',
    })
    // 请求设备参数
    wx.request({
      url: 'http://47.100.12.130:3111/api/ims/deviceData?devicename=' + eqname,
      method: 'GET',
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success(res){
        if(res.data.result == 1){
          // 获取成功
          wx.hideLoading()
          var datalist = res.data.imsLastData
        that.setData({
          eqDataList:datalist,
          eqname:options.eqname
        })
        }else{
          // 获取失败
          wx.hideLoading()
          wx.showToast({
            title: '获取失败',
            icon: 'none',
            duration: 2000
          })
        }  
      },
    })     
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