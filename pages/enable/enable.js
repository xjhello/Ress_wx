Page({

  /**
   * 页面的初始数据
   */
  data: {
 
  },

  enableEq: function(e){
    var mydata = e.detail.value
    var eqID = mydata.sbh
    var Key = mydata.jhm
    var userName = mydata.yhm
    console.log(eqID,Key,userName)
    wx.request({
      url: 'http://47.100.12.130:3111/api/activateDevice',
      method: 'POST',
      data:{
        deviceid: eqID,
        key:Key,
        username:userName
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success(res){
       var resu = res.data.result 
       if (resu == 2){
        wx.showToast({
         title: '该设备被激活！',
        })
      }
      if (resu == 1){
         wx.showToast({
          title: '激活成功！',
         })
       }
       if (resu == 0){
        wx.showModal({
          title: '提示！',
          content: '设备激活失败,请检查参数!',
          showCancel:false,
          success (res) {
            if (res.confirm) {
              console.log('用户点击确定')
            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          }
        })
      }
      }
    })
  },



  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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