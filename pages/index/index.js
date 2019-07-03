//index.js
//获取应用实例
var hsha512  = require('sha512.js')
var CusBase64 = require('base64.js');
//函数调用
// 
const app = getApp()
Page({
  data: {
    imgurls:[
      'https://47.100.12.130/img/banner1.8ae48a2b.jpg',
      'https://47.100.12.130/img/banner1.8ae48a2b.jpg',
      'https://47.100.12.130/img/banner1.8ae48a2b.jpg'
    ]
  },


  test:function(){
    console.log('!!!!!!!!!!!!!!!!')
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },

  // 用户名检测
  unameTest:function(id){
    wx.request({
      url: 'http://www.swisys.com.cn:3111/api/ims/getValidateCode', 
      method: 'POST',
      data: {
        name: id,
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success(res) {
        console.log(res.data['salt'])
        return res.data['salt'] 
      }
    })

    
  },

    // 用户登录
  userLogin: function (e) {
    var id = e.detail.value.id
    var pwd = e.detail.value.pwd
    var salt = ''

    // 得到salt
    wx.request({
      url: 'http://www.swisys.com.cn:3111/api/ims/getValidateCode',
      method: 'POST',
      data: {
        name: id,
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success(res) {
        console.log('成功得到salt！！！')
        var salt =  res.data.salt //data为json对象，也可以res.data['salt']
        // console.log('salt:' + salt)
        var newPwd = pwd + salt
        console.log('newPwd:' + newPwd)
        var newSha512 = hsha512.sha512(newPwd)
        console.log('newSha512:' + newSha512)
        var newBase64 = CusBase64.CusBASE64.encoder(newSha512);
        console.log('newBase64:' + newBase64)
        wx.request({
          url: 'http://47.100.12.130:3111/api/ims/checkPassword',
          method: 'POST',
          data: {
            name: id,
            password: newBase64
          },
          header: {
            'content-type': 'application/x-www-form-urlencoded'
          },
          success(res) {
            console.log(res.data)
            wx.navigateTo({
              url: '../from/from?id=' + id,
            })
          }
        })

      }
    })
    
  },


  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }
})
