//app.js
App({
  globalData: {
    userInfo: null,
    // https://www.rseecn.com:8080/ims/user/
    imsUrl: "https://www.rseecn.com:8080",
    blueData:{
      isLink:false,
      blueData:''
    }
  },

  onLaunch: function () {
    // 初始化错误缓存
    try {
      var value = wx.getStorageSync('errData')
      if (value) {
        console.log("有缓存")
      }else{
        wx.setStorageSync('errData', [])
        console.log("没有缓存")
      }
    } catch (e) {
    }
   
     // 初始化自定义缓存
     try {
      var value = wx.getStorageSync('userDefined')
      if (value) {
        console.log("有自定义缓存")
      }else{
        var demo = [true,true,true,true,true]
        wx.setStorageSync('userDefined', [demo])
        console.log("没有自定义缓存")
      }
    } catch (e) {
    }

      // 初始化自定义PidList
      try {
        var value = wx.getStorageSync('PidList')
        if (value) {
          console.log("有自定义缓存")
        }else{
          wx.setStorageSync('PidList', [])
          console.log("没有自定义缓存")
        }
      } catch (e) {
      }
  },
 
})