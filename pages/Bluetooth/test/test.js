const stringTool  = require('../../../utils/stringTool.js')
const config = require('../../../config.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ECU:'',
    DTCModel:'',
    errNum:'',
    text:'',
    dataList:[],
    dataList2:[],
    datastr:'',
    errMsg:[],
    dataErrList:[],
    strHex:''
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let deviceId = options.deviceId
    let serviceId = options.serviceId
    let characteristicId = options.characteristicId
    console.log('页面传参为：',deviceId,serviceId,characteristicId )
    this.setData({
      deviceId: deviceId,
      serviceId: serviceId,
      characteristicId: characteristicId,
    })
  },

 // 事件处理
 formSubmit: function (e) {
  console.log('form发生了submit事件，携带数据为：', e.detail.value)
  var orderString =  e.detail.value.input
  var type = e.detail.value.radio
  var isadd = e.detail.value.isadd
  if(type == 'type-hex'){
    if(isadd == 'yes'){
      var orderHex = orderString + '0D0A'
      console.log(typeof orderString, orderString)
    }else{
      var orderHex = orderString 
      console.log(typeof orderString, orderString)
    }
  }else if(type == 'type-str'){
    if(isadd == 'yes'){
    var orderHex = stringTool.stringToHex(orderString) + '0D0A'
    console.log('字符类型为字符串', typeof orderHex, orderHex)
    }else{
      var orderHex = stringTool.stringToHex(orderString)
    console.log('字符类型为字符串', typeof orderHex, orderHex)
    }
  }else{
    var orderHex = stringTool.stringToHex(orderString) + '0D0A'
    console.log('默认为字符串', typeof orderHex, orderHex)
  }
  this.writeValue(orderHex)
},


//  写数据统一函数
writeValue(strHex){
  var that = this
  var datastr = ''
  var dataList = [] 
  var dataList2 = []
  var err = {}
  var errlist = []
  var typedArray = new Uint8Array(strHex.match(/[\da-f]{2}/gi).map(function (h) {
      return parseInt(h, 16)
  }))
  var buffer = typedArray.buffer
  console.log(buffer)
  wx.writeBLECharacteristicValue({
    deviceId: that.data.deviceId,
    serviceId: that.data.serviceId,
    characteristicId: that.data.characteristicId,
    value: buffer,
    // 成功回调
    success (res) {
      console.log('写入二进制数据 success', res.errMsg)
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
    console.log('字符串为：', blueData)
    dataList.push(blueData)
    datastr = datastr + blueData
    console.log('拼接字符串：', datastr)
    that.setData({
      strHex:strHex,
      text: blueData,
      dataList:dataList,
      datastr:datastr
    })
  })
},


// 清除指令
clearInstructions(e){
  this.setData({
    strHex:'',
    text: '',
    dataList:[],
    datastr:''
  })
  var that = this
  console.log('向蓝牙设备发送清除指令')
  // OFF\r\n: 4f46460D0A
  var hex = '4f46460D0A'
  var typedArray = new Uint8Array(hex.match(/[\da-f]{2}/gi).map(function (h) {
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
   // 监听低功耗蓝牙设备的特征值变化事件
  wx.onBLECharacteristicValueChange(function(res) {
    // res.value是一个ArrayBuffer对象
    // 一次指令过后会返回过个res，我们需要的是res.value，把这个值存到列表中
    // console.log(`蓝牙设备的特征值 ${res.characteristicId} 数据表变化\n, 现在的数据是 ${res.value}`)
    // var strHex = stringTool.ab2hex(res.value) // 转为16进制字符串
    // console.log('16进制为：', strHex)
    // var blueData = stringTool.hexCharCodeToStr(strHex)
    // console.log('字符串为：', blueData)
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