//获取应用实例
var app = getApp();
var hsha512  = require('sha512.js')
var CusBase64 = require('base64.js');
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

  // 用户注册跳转
  register: function(){
    wx.navigateTo({
      url: '../register/register',
    })

  },

  // 用户名检测
  checkUname:function(uname){
    wx.request({
      url: app.globalData.imsUrl + '/ims/getValidateCode',
      method: 'POST',
      data: {
        name: id,
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      fail(res){
        wx.hideLoading()
        wx.showToast({
          title: 'name服务器错误',
          icon: 'none',
          duration: 2000
        })
      },
      success(res){
        if(res.data.result == 1 ){
          var salt =  res.data.salt; //data为json对象，也可以res.data['salt']
          var newPwd = pwd + salt;
          var newSha512 = hsha512.sha512(newPwd);
          var newBase64 = CusBase64.CusBASE64.encoder(newSha512);
          return newBase64;
        }else{
          wx.hideLoading()
          wx.showModal({
            title: '提示！',
            content: '用户名不存在，请重新输入！',
            showCancel:false,
          });
          return false
        }
      }
    })

  },
    // 用户登录
  userLogin: function (e) {
    var id = e.detail.value.id
    var pwd = e.detail.value.pwd
    var salt = ''
    wx.showLoading({
      title: '登陆中...',
    })
    // 用户名检测请求
    // salt = this.checkUname(id);
    // if(salt!=false){

    // }

    wx.request({
      url: app.globalData.imsUrl + '/ims/getValidateCode',
      method: 'POST',
      data: {
        name: id,
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      fail(res){
        wx.hideLoading()
        wx.showToast({
          title: 'name服务器错误',
          icon: 'none',
          duration: 2000
        })
      },
      success(res) {
        if(res.data.result == 1 ){
          var salt =  res.data.salt //data为json对象，也可以res.data['salt']
          var newPwd = pwd + salt
          var newSha512 = hsha512.sha512(newPwd)   
          var newBase64 = CusBase64.CusBASE64.encoder(newSha512);
          wx.request({
            url: app.globalData.imsUrl + '/ims/checkPassword',
            // url: 'http://47.100.12.130:3111/api/ims/checkPassword',
            method: 'POST',
            data: {
              name: id,
              password: newBase64
            },
            header: {
              'content-type': 'application/x-www-form-urlencoded'
            },
            fail(res){
              wx.hideLoading()
              wx.showModal({
                title: '提示！',
                content: '密码错误，请重新输入！',
                showCancel:false,
              })
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
