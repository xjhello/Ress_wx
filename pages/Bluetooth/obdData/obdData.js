const stringTool  = require('../../../utils/stringTool.js')
Page({

  data: {
    vss:0,
    bluedata: {},
  },


  //  写数据统一函数
  writeValue(strHex){
  var that = this
  var fstr = ''
  var lstr = ''
  var dataList = []
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
    // 成功回调
    success (res) {
      console.log('写入二进制数据 成功', res.errMsg)
    },
    fail (res){
      console.log('写入二进制数据 失败', res.errMsg)
    }
  })
   // 监听低功耗蓝牙设备的特征值变化事件
  wx.onBLECharacteristicValueChange(function(res) {   
    var strHex = stringTool.ab2hex(res.value) // 转为16进制字符串
    console.log('16进制为：', strHex)
    var blueData = stringTool.hexCharCodeToStr(strHex)
    if(blueData.startsWith('$')){
      fstr = blueData
      console.log('以$开头:', fstr)
    }
    if(blueData.endsWith('\r\n')){
      console.log('以\\r\\n开头:', blueData)
      console.log(fstr)
      if(fstr!=''){
        lstr = fstr +  blueData
        dataList = lstr.split(',')
        console.log('水箱温度：',dataList[0],'℃')
        console.log('引擎转速：',dataList[1])
        console.log('行车速度：',dataList[2])
        console.log('氧感測器：',dataList[3])
        console.log('MAF空氣流量',dataList[4])
        console.log('组合的字符串:', lstr)
        that.setData({
          vss:dataList[2],
          bluedata: {
            temperature:dataList[0],
            eSpeed:dataList[1],
            speed:dataList[2],
            o2:dataList[3],
            MAF:dataList[4],
          }
        })
      }
    }
  })
  },


   // @OBD命令
  orderOBD:function(){
    var OBD = stringTool.stringToHex('@OBD') + '0D0A'
    this.writeValue(OBD)
  },

   // OFF指令
  out:function(){
    wx.showToast({
      title: '退出中,请稍后...',
      icon: 'loading',
      duration: 1500
      })
    var OFF = stringTool.stringToHex('@OFF') + '0D0A'
    var typedArray = new Uint8Array(OFF.match(/[\da-f]{2}/gi).map(function (h) {
      return parseInt(h, 16)
      }))
    var buffer = typedArray.buffer
    wx.writeBLECharacteristicValue({
      deviceId: that.data.deviceId,
      serviceId: that.data.serviceId,
      characteristicId: that.data.characteristicId,
      value: buffer,
      success (res) {
        console.log('写入二进制数据 成功')
      },
      fail (res){
        console.log('写入二进制数据 失败')
      }
    })
    wx.onBLECharacteristicValueChange(function(res) { 
      var strHex = res.value // 转为16进制字符串
      console.log('回调：：', strHex)  
    })
  },

  // 斷開當前模式
  clearInstructions(e){
    wx.showToast({
      title: '退出中,请稍后...',
      icon: 'loading',
      duration: 2000
    })
    this.setData({
      strHex:'',
      text: '',
      dataList:[],
      datastr:''
    })
    var that = this
    console.log('向蓝牙设备发送清除指令')
    // OFF\r\n: 4f46460D0A
    var OderDtc = stringTool.stringToHex('@OFF') + '0D0A'
    // var hex = '4f46460D0A'
    var typedArray = new Uint8Array(OderDtc.match(/[\da-f]{2}/gi).map(function (h) {
        return parseInt(h, 16)
    }))
    var buffer = typedArray.buffer
     wx.writeBLECharacteristicValue({
      deviceId: that.data.deviceId,
      serviceId: that.data.serviceId,
      characteristicId: that.data.characteristicId,
      value: buffer,
      // 成功回调
      success (res) {
        console.log('断开当前模式成功', res.errMsg)
      },
      fail (res){
        console.log('断开当前模式失败', res.errMsg)
      }
    })
    wx.onBLECharacteristicValueChange(function(res) {
    })
  },
  

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 读取缓存
    var userDefined = wx.getStorageSync('userDefined')
    this.setData({
      userDefined
    })
    // ....
    let deviceId = options.deviceId
    let serviceId = options.serviceId
    let characteristicId = options.characteristicId
    console.log('页面传参为：',deviceId,serviceId,characteristicId )
    this.setData({
      deviceId: deviceId,
      serviceId: serviceId,
      characteristicId: characteristicId,
    })
    this.orderOBD()
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
    console.log('断开当前模式')
    this.out()
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    console.log('断开当前模式')
    this.out()
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