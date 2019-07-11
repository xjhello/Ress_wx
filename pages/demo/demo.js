// pages/demo/demo.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    a:0,
    tabs: ["选项一", "选项二", "选项三"],
    activeIndex: 1,
    sliderOffset: 0,
    sliderLeft: 0
  },

  // success: function(){},
  // success: (res)=>{},
  test: function(e){
    for (var i=0;i<10000000;i++){
      for(var j=0;j<100000;j++){

      }
      this.setData({
        a:i
      })
    }
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
          title: '激活成功！',
         })
       }
      },
    })
  },

  tabClick: function (e) {
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
  
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