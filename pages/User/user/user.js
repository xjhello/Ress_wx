//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    timer: '',//定时器名字
    num:0,
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },


  onLoad: function (options) {
    var uid = options.id
    var accessToekn = options.accessToekn
    console.log('***********',accessToekn)
    this.setData({
      id:uid,
      accessToekn
    })
    this.getDataByName(uid)
  },

  // 激活设备
  enableEquipment: function(){
    wx.navigateTo({
      url: '../enable/enable'
    })
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
        'accessToken': that.data.accessToekn
      },
      success(res){
        var sss = JSON.stringify(res.data)
        console.log('res:  ',res.data)
        wx.setStorageSync('eqList', res.data.result)
        that.setData({
          eqList: res.data.result,
          uname:uid,
        })
      }
    })
  },

  // 激活设备
  myEquipment: function (){
    var that = this
    wx.navigateTo({
      url: '../from/from?id=' + that.data.id + '&accessToekn=' + that.data.accessToekn,
    })

    // wx.navigateTo({
    //   url: '../from/from?id=' + that.data.id + '&accessToekn=' + that.data.accessToekn + '&eqList=' + that.data.eqList,
    // })
  },

  // 绑定用户
  toLogin: function (e) {
    console.log('1111111111111')
    wx.navigateTo({
      url: '../index/index',
    })
  },

  // 获取用户信息
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    wx.navigateTo({
      url: '../index/index',
    })
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },


 // 定时任务刷新数据
  timeUpdata: function(){
    console.log('函数开始')
      let that = this;
      let numb = that.data.num;
      setInterval(function(){
        numb++;
        console.log('网络请求。。。。。。', numb);       
      }
    ,1000)
      // that.setData({
      //   timer: setInterval(function(){
      //     numb++;
      //     console.log('网络请求。。。。。。', numb);       
      //   }
      // ,1000),
      // })
  },

  
  // onLoad: function () {
  //   if (app.globalData.userInfo!=null){
  //     this.setData({
  //       userInfo:app.globalData.userInfo,
  //       hasUserInfo: true
  //     })
  //   }
  // },

  onShow: function(){
    // this.timeUpdata()
  }
})
