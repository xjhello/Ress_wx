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
      '/image/index.png',
    ]
  },

  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },

  // 用户名检测
  // unameTest:function(id){
  //   wx.request({
  //     url: 'http://www.swisys.com.cn:3111/api/ims/getValidateCode', 
  //     method: 'POST',
  //     data: {
  //       name: id,
  //     },
  //     header: {
  //       'content-type': 'application/x-www-form-urlencoded'
  //     },
  //     success(res) {
  //       console.log('得到的salt值:' + res.data['salt'])
  //       return res.data['salt'] 
  //     }
  //   })
  // },

    // 用户登录
  userLogin: function (e) {
    var id = e.detail.value.id
    var pwd = e.detail.value.pwd
    var salt = ''
    wx.showLoading({
      title: '登陆中...',
    })
    // 用户名检测请求
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
        if(res.data.result == 1 ){
          var salt =  res.data.salt //data为json对象，也可以res.data['salt']
          var newPwd = pwd + salt
          // console.log('newPwd:' + newPwd)
          var newSha512 = hsha512.sha512(newPwd)
          // console.log('newSha512:' + newSha512)
          var newBase64 = CusBase64.CusBASE64.encoder(newSha512);
          // console.log('newBase64:' + newBase64)
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
              // 密码检测
              if (res.data.result == 1){
                wx.hideLoading()
                console.log(res.data)
                wx.navigateTo({
                  url: '../from/from?id=' + id,
                })
              }else{
                wx.hideLoading()
                wx.showModal({
                  title: '提示！',
                  content: '密码错误，请重新输入！',
                  showCancel:false,
                })
              }
            }
          })
        }else{
          wx.hideLoading()
          wx.showModal({
            title: '提示！',
            content: '用户名不存在，请重新输入！',
            showCancel:false,
          })
        }
      }
    })
    
  },

  onLoad: function () {
    // 登录缓存检测
    // var that = this
    // wx.getStorage({
    //   key: 'isLogin',
    //   success (res) {
    //     if(res.data == true){
    //       console.log('成功登录！！！！！！！！'+that.id)
    //       // 登录成功后直接跳转到设备页面
    //       // id为用户名
    //       wx.navigateTo({
    //         url: '../from/from?id=' + that.id,
    //       })
    //     }else{
    //       console.log('登录失败！！！！！！！！')
    //     }
        
    //   }
    // })
  },

})
