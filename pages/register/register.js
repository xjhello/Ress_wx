var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  // 用户注册
  userRegister: function(e){
    var uname = e.detail.value.username;
    var pwd1 = e.detail.value.pwd1;
    var pwd2 = e.detail.value.pwd2;
    var salt = '';
    if(pwd1 == pwd2){
        //1.先检查用户名
        wx.request({
          url: app.globalData.imsUrl + '/ims/getValidateCode',
          method: 'POST',
          data: {
            name: uname,
          },
          header: {
            'content-type': 'application/x-www-form-urlencoded'
          },
          fail(res){  
            wx.showToast({
              title: '服务器错误',
              icon: 'none',
              duration: 2000
            })
          },
          success(res){
            if(res.data.result == 1 ){
              console.log('111得到的salt值',res.data.salt);
              wx.showModal({
                title: '提示！',
                content: '用户名已存在！',
                showCancel:false,
              })
            }else{  //result=0
              salt = res.data.salt;
              console.log('222得到的salt值',salt);
              // 注册
              wx.request({
                url: app.globalData.imsUrl + '/addUser',
                method: 'POST',
                data: {
                  name: uname,
                  password: pwd1,
                  salt: salt
                },  
                header: {
                  'content-type': 'application/x-www-form-urlencoded'
                },
                fail(res){
                  wx.showToast({
                    title: '注册服务器错误',
                    icon: 'none',
                    duration: 2000
                  })
                },
                success(res){
                  if(res.data.result==1){
                    wx.showModal({
                      title: '提示！',
                      content: '用户注册成功！',
                      showCancel:false,
                    })
                  }else{
                    wx.showModal({
                      title: '提示！',
                      content: '注册失败！',
                      showCancel:false,
                    })
                  }
                }
              });
            }
          }
        })


       
    }else{
      wx.showToast({
        title: '两次密码不一致！',
        icon: 'none',
        duration: 2000
      })
    }
  },
 
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