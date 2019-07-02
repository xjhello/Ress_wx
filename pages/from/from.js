Page({
  /**
   * 页面的初始数据
   */
  data: {
    uname:'',
    mydata:{},
    eqList:[]
  },

  
  // 获取数据
  getData:function(e){
    var that = this;
    wx.request({
      url: 'http://47.100.12.130:3111/api/ims/page?page=5&size=20', //仅为示例，并非真实的接口地址
      method: 'GET',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        that.mydata = res.data
        console.log(that.mydata)
        that.setData({
          mydata: res.data
        })
      }
    })
  },


  // 获取数据
  getDataByName: function (uid) {
    var that = this;
    var urls = ''
    console.log('!!!!!!!!!!:' + uid)
    urls = 'http://192.168.1.105:3111/api/userDevice?username=' + uid
    console.log(urls)
    wx.request({
      url: 'http://192.168.1.105:3111/api/userDevice?username=' + uid,
      method: 'GET',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res){
        console.log(res.data)
        that.setData({
          eqList: res.data['data']
        } )
      }
    })
    
  },


// 点击获取详细设备信息
getEqDetail:function(e){
  console.log(e.currentTarget.eqname)
    // wx.navigateTo({
    //   url: '../eqdetail/eqdetail?eqname=' + eqname,
    // })
},

onLoad: function (options) {
    var uid = options.id
    console.log('uname!!!!!!!!!!!!!:' + uid)
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

  
  onPullDownRefresh: function () {

  },

 
  onReachBottom: function () {

  },

  
  onShareAppMessage: function () {

  }
})