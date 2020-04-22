const stringTool  = require('../../../utils/stringTool.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {

  },


    // @CAR
  orderCAR:function(){
    var CAR = stringTool.stringToHex('@CAR') + '0D0A'
    this.writeValue(CAR)
  },

    //  写数据统一函数
  writeValue:function(strHex){
      var that = this
      var totalString = ''
      var typedArray = new Uint8Array(strHex.match(/[\da-f]{2}/gi).map(function (h) {
          return parseInt(h, 16)
      }))
      console.log(typedArray)
      var buffer = typedArray.buffer
      console.log(buffer)

      wx.writeBLECharacteristicValue({
        deviceId: that.data.deviceId,
        serviceId: that.data.serviceId,
        characteristicId: that.data.characteristicId,
        value: buffer,
        success (res) {
          console.log('写入二进制数据 成功', res.errMsg)
        },
        fail (res){
          console.log('写入二进制数据 失败', res.errMsg)
        }
      })

      wx.onBLECharacteristicValueChange(function(res) {   
        var strHex = stringTool.ab2hex(res.value) // 转为16进制字符串
        console.log('16进制为：', strHex)
        var blueData = stringTool.hexCharCodeToStr(strHex)
        totalString = totalString + blueData
        console.log('String>>>>>>：',blueData)
        console.log('totalString>>>>>',totalString)
        that.setData({
          totalString
        })
      })
      },
  

  showData:function(e){
    console.log('开始showData！！！！！！！！！！')
    var info = this.data.totalString
    var infoList = info.split('\r\n')
    console.log('infoList: ', infoList)

    var carInfo = infoList.slice(5,infoList.length-1)
    console.log('carInfo: ', carInfo)

    var carObj = {}
    for (let i=0; i<carInfo.length; i++){
      var msg_list = carInfo[i].split(':')
      console.log('>>>>>>>>>>>>>>>>',msg_list)
      let name = msg_list[0]
      console.log('name>>>>>>',name)
      carObj[name] = msg_list[1]
      console.log('carObj>>>>>>>>>>>>>>>>',msg_list)
    }
    this.setData({
      carInfo:carObj
    })
    clearInterval(this.data.timerTask)
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    let deviceId = options.deviceId
    let serviceId = options.serviceId
    let characteristicId = options.characteristicId
    console.log('页面传参为：',deviceId,serviceId,characteristicId )
    this.setData({
      deviceId: deviceId,
      serviceId: serviceId,
      characteristicId: characteristicId,
    })
    this.orderCAR()
    wx.showToast({
      title: '初始化中...',
      icon: 'loading',
      duration: 2000
    })

    that.setData({
      timerTask:setInterval(function(){
        that.showData()
      },3000)
    })
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