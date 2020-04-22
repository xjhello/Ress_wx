// pages/Bluetooth/definedObd/mysetting/mysetting.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      console.log(options)
      // 读取缓存
      var userDefined = wx.getStorageSync('userDefined')
      this.setData({
        userDefined
      })
  },


    // 用户自定义显示选项[
      switchChange:function(e){
        console.log(e)
        var index = Number(e.currentTarget.dataset.index) 
        console.log(index)
        var userDefined = this.data.userDefined
        userDefined[index] = !userDefined[index]
        wx.setStorageSync('userDefined', userDefined)
        this.setData({
          userDefined
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