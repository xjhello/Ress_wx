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
    console.log('要查询的用户名称:' + that.data.accessToekn)
    wx.request({
      url: app.globalData.imsUrl + '/ims/api/device/userDevice?username=' + uid,
      method: 'POST',
      header: {
        'content-type': 'application/json;charset=UTF-8', // 默认值
        // 'accessToekn':  that.data.accessToekn
        'accessToken': that.data.accessToekn
      },
      success(res){
        var sss = JSON.stringify(res.data)
        // console.log(Object.prototype.toString.call(res.data))
        console.log('res:  ',res.data)
        that.setData({
          eqList: res.data.result,
          uname:uid,
        })
       
      }
    })
    
},


// 点击获取详细设备信息
getEqDetail:function(e){
  console.log('@@@@@@@',this.data.accessToekn)
  var that = this
  var eqname = e.currentTarget.id 
  console.log('要查询的设备名称:'+e.currentTarget.id)
    wx.navigateTo({
      url: '../eqdetail/eqdetail?eqname=' + eqname + '&accessToken=' + that.data.accessToekn,
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
    var accessToekn = options.accessToekn
    var eqList = wx.getStorageSync('eqList')
    console.log('***********',eqList)
    this.setData({
      uname:uid,
      accessToekn,
      eqList
    })
    // this.getDataByName(uid)
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

  },

 
  onReachBottom: function () {

  },

  
  onShareAppMessage: function () {

  }
})