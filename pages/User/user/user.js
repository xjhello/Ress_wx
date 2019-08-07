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

  // 进入我的设备
  toList: function(e){
    // 获取缓存
    try {
      var value = wx.getStorageSync('username')
      if (value) {
        
      }else{
        wx.showModal({
          title: '提示！',
          content: '未登录！',
          showCancel:false,
        })
      }
    } catch (es) {
      
    }
  },

  // 激活设备
  enAble: function (){
    console.log('2222222')
    wx.navigateTo({
      url: '../index/index',
    })
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

    // wx.login({
    //   success: res => {
    //     console.log('得到的code!!!：', res)
    //     var code = res.code
    //     wx.request({
    //       url:app.globalData.imsUrl + '/ims/wechatlogin',
    //       method: 'POST',
    //       data: {
    //         code: this.code
    //       },
    //       header: {
    //       'content-type': 'application/x-www-form-urlencoded'
    //       },
    //       success:(res)=>{
    //         console.log('成功！！！',res)
    //       },
    //       fail:(err)=>{
    //         console.log('shibai1！！！',err)
    //       }
    //     })
    //   }
    // })
    
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

  
  onLoad: function () {
    if (app.globalData.userInfo!=null){
      this.setData({
        userInfo:app.globalData.userInfo,
        hasUserInfo: true
      })
    }
  },

  onShow: function(){
    // this.timeUpdata()
  }
})
