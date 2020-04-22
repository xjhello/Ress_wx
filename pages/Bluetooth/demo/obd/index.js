// pages/Bluetooth/demo/obd/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    Timer:'',
    vcc:0,
    Temperature:0,
    rpm:0,
    co1:0,
    co2:0
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
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 读取缓存
    var userDefined = wx.getStorageSync('userDefined')
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
    var that = this
    this.setData({
      Timer:setInterval(function(){
        let vcc = Math.floor((Math.random()*200)+1);
        let Temperature = Math.floor((Math.random()*200)+1);
        let rpm = Math.floor((Math.random()*10000)+1);
        let co1 = Math.floor((Math.random()*1000)+1);
        let co2 = Math.floor((Math.random()*1000)+1)
        that.setData({
          vcc,
          Temperature,
          rpm,
          co1,
          co2
      })
      },1000)
    })
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
    clearInterval(this.data.Timer)
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