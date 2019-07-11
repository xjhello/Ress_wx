var app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    uname:'',
    eqList:[]
  },

  // 获取设备列表
  getDataByName: function (uid) {
    var that = this;
    var urls = ''
    console.log('要查询的用户名称:' + uid)
    // urls = 'https://www.swisys.com.cn:8080/api/userDevice?username=' + uid
    wx.request({
      url: app.globalData.imsUrl + '/userDevice?username=' + uid,
      // url: 'https://www.swisys.com.cn:8080/api/userDevice?username=' + uid,
      method: 'GET',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res){
        var sss = JSON.stringify(res.data)
        console.log(Object.prototype.toString.call(res.data))
        console.log('!!!!!!!!!!!',res.data)
        that.setData({
          eqList: res.data.data,
          uname:uid
        })
      }
    })
    
  },


// 点击获取详细设备信息
getEqDetail:function(e){
  var eqname = e.currentTarget.id 
  console.log('要查询的设备名称:'+e.currentTarget.id)
    wx.navigateTo({
      url: '../eqdetail/eqdetail?eqname=' + eqname,
    })
},

// 激活设备
enableEquipment: function(){
    wx.navigateTo({
      url: '../enable/enable'
    })
},

onLoad: function (options) {
    var uid = options.id
    this.setData({
      uname:uid
    })
    this.getDataByName(uid)
  },

 
  onReady: function () {

  },

  
  onShow: function () {

  },

  
  onHide: function () {

  },

  
  onUnload: function () {

  },

  // 下拉刷新
  onPullDownRefresh: function () {
    var that = this
    console.log('下拉动作')
    // 展示下拉动画
    wx.showNavigationBarLoading()
    // 隐藏导航栏加载框
    wx.hideNavigationBarLoading();
    // 停止下拉动作
    wx.stopPullDownRefresh();
    this.getDataByName(that.uname);
    // wx.navigateTo({
    //   url: 'from?id=' + this.data.uname,
    // })
  },

 
  onReachBottom: function () {

  },

  
  onShareAppMessage: function () {

  }
})