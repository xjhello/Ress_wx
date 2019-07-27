//获取应用实例
var app = getApp();
var hsha512  = require('sha512.js')
var CusBase64 = require('base64.js');
Page({
  data: {
    imgurls:[
      'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1563527686&di=7cbdd2a1e0d7c9569deb0dbf5a3f1de7&imgtype=jpg&er=1&src=http%3A%2F%2Fpic57.nipic.com%2Ffile%2F20150106%2F11284670_085134389000_2.jpg',
      'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1562932853546&di=0ea8fdeeec3429a161c20ead59952c55&imgtype=0&src=http%3A%2F%2Ffile06.16sucai.com%2F2015%2F1125%2F0e5a3581a3af9d084b411339c9249cd9.jpg',
      'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1563527668&di=7c67d1c146a2e08d7c0b77f55aa9712e&imgtype=jpg&er=1&src=http%3A%2F%2Fpic180.nipic.com%2Ffile%2F20180904%2F7090656_155215292000_2.jpg',
    ]
  },


  // 用户注册跳转
  register: function(){
    wx.navigateTo({
      url: '../register/register',
    })

  },

  // salt加密用户名
  hashUname:function(salt,pwd){
      var newPwd = pwd + salt
      var newSha512 = hsha512.sha512(newPwd)   
      var newBase64 = CusBase64.CusBASE64.encoder(newSha512);
      return newBase64
  },

  // 加密密码后请求登录
  hashLogin:function(newBase64,id){
    wx.request({
      url: app.globalData.imsUrl + '/ims/login',
      method: 'POST',
      data: {
        username: id,
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
        if (res.data.success == true){
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
  },
  
  // 用户登录
  userLogin: function (e) {
    var that = this
    var id = e.detail.value.id
    var pwd = e.detail.value.pwd
    wx.showLoading({
      title: '登陆中...',
    })
    wx.request({ // 发送用户名
      url: app.globalData.imsUrl + '/ims/user/getValidCode',
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
      success(res) {  // 得到salt加密
        console.log('发送用户名成功!',res.data)
        if(res.data.result.result == 1 ){
          var salt =  res.data.result.salt
          console.log('发送用户名成功!得到salt值'+salt) 
          // 加密密码
          var newBase64 = that.hashUname(salt,pwd)
          console.log('加密后的密码:', newBase64)
          // 检查加密后的密码
          that.hashLogin(newBase64,id)
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

  },

})
