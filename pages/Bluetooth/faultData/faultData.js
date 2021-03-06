const stringTool  = require('../../../utils/stringTool.js')
const config = require('../../../config.js')
const util = require('../../../utils/util.js')
Page({

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
  },


  // 模态框显示隐藏
  showModal(e) {
    console.log(e)
    let index = Number(e.currentTarget.dataset.index) 
    console.log(index)
    this.setData({
      modalName: e.currentTarget.dataset.target,
      errorIndex: index
    })
  },
  hideModal(e) {
    this.setData({
      modalName: null
    })
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
      if(datastr.endsWith('\r\n')){
        console.log('结束了！！！！！！！：')
        dataList2 = datastr.split(' ')
        console.log('@@@@',dataList2)
        that.setData({
          dataList2: dataList2
        })
        for(let i=0; i<dataList2.length; i++){
          var name = dataList2[i]   
          console.log('得到的name：',name)  
            for(let j=0; j<config.faultList.errList.length; j++){
              console.log('得11111111到的name：',name) 
              if(name == config.faultList.errList[j].name){
                console.log('得到的一样') 
                errlist.push(config.faultList.errList[j])
                that.setData({
                  errMsg: errlist
                })
            } 
          }
        }
       
      }
      that.setData({
        text: blueData,
        dataList:dataList
      })
    })
  },


  //@M03指令处理函数
  orderM03: function(e){
    let strHex = stringTool.stringToHex('@M03') + '0D0A'
    var that = this
    var dataAll = '' // 多条数据拼接的字符串
    var errList = [] // 错误对象列表
    var dataErrList = []  // 错误码列表
    var M03Array = new Uint8Array(strHex.match(/[\da-f]{2}/gi).map(function (h) {
      return parseInt(h, 16)
    }))
    var buffer = M03Array.buffer
    wx.writeBLECharacteristicValue({
      deviceId: that.data.deviceId,
      serviceId: that.data.serviceId,
      characteristicId: that.data.characteristicId,
      value: buffer,
    })
    wx.onBLECharacteristicValueChange(function(res) {
      var errStorage = {}  // 错误信息缓存，包含时间和错误列表errList
      var dataHex = stringTool.ab2hex(res.value) // 转为16进制字符串
      var dataStr = stringTool.hexCharCodeToStr(dataHex)
      dataAll = dataAll + dataStr
      if(dataAll.endsWith('\r\n')){
        dataAll = dataAll.replace(/\r\n/g,"")
        console.log(dataAll)
        if(dataAll.search('None Response')!=-1){
          wx.showModal({
            title: '提示！',
            content: '暂无故障信息！',
            showCancel:false,
          })
        }else{
          var ECU = dataAll.slice(0,1)
          var DTCModel = dataAll.slice(1,4)
          var errNum = dataAll.slice(4,7)
          that.setData({
            ECU,
            DTCModel,
            errNum
          })
          var dataErr = dataAll.slice(8)  // 从新截取的字符串
          dataErrList = dataErr.split(' ')  // 错误码列表
          that.setData({
            dataErrList: dataErrList
          })
          console.log(dataErrList)
          var name = ''
          // 1M03 20:P0043 P0092 P1043 P2043 P3043 C0043 C0092 C1043 C2043 C3043 B0043 B0092 B1043 B2043 B3043 U0043 U0092 U1043 U2043 U3043
          for(var i=0; i<dataErrList.length; i++){
             name = dataErrList[i] 
            for(var j=0; j<config.faultList.errList.length; j++){
              if(name == config.faultList.errList[j].name)
              { 
                errList.push(config.faultList.errList[j])
                break
              }else{
                // 这里一定要判断是不是遍历完了也没有相应的故障码，否则会就添加重复数据
                if(j==config.faultList.errList.length-1){
                  errList.push({
                    name:name,
                    cn_desc:'暂无详细信息'
                  })
                } 
              }
            }
          }
          // 组装信息到缓存
          var errTime = util.formatTime(new Date())
          errStorage = {
            time: errTime,
            info:errList
          }
          // 添加数据到缓存
          var value = wx.getStorageSync('errData')
          if(value){
            value.push(errStorage)
            wx.setStorageSync('errData', value)
            that.setData({
              errMsg: errList
            })
            console.log(errList)
          }
          that.setData({
            errMsg: errList
          })
        }
      }
    })
  },


   //@DTC指令处理函数
   orderDTC: function(e){
      var that = this
      let strHex = stringTool.stringToHex('@DTC') + '0D0A'
      var DTCArray = new Uint8Array(strHex.match(/[\da-f]{2}/gi).map(function (h) {
        return parseInt(h, 16)
      }))
      var buffer = DTCArray.buffer
      wx.writeBLECharacteristicValue({
        deviceId: that.data.deviceId,
        serviceId: that.data.serviceId,
        characteristicId: that.data.characteristicId,
        value: buffer,
      })

      wx.onBLECharacteristicValueChange(function(res) {
       console.log('激活成功！')
      })

  },



  // 保存查看的故障码到缓存中
  saveFaultData: function(data){
    
  },


  // 查看故障事件
  checkFault: function(e){
    // let orderDTC = stringTool.stringToHex('@DTC') + '0D0A'
    // this.orderDTC(orderDTC)
    var order = stringTool.stringToHex('@M03') + '0D0A'
    this.orderM03(order)
  },

   // 事件处理
  formSubmit: function (e) {
    console.log('form发生了submit事件，携带数据为：', e.detail.value)
    var orderString =  e.detail.value.input
    var orderHex = stringTool.stringToHex(orderString) + '0D0A'
    console.log(orderHex)

    this.writeValue(orderHex)
  },


  // 清除故障數據
  clearErr: function(e){
    var that = this
    let strHex = stringTool.stringToHex('@M04') + '0D0A'
    var DTCArray = new Uint8Array(strHex.match(/[\da-f]{2}/gi).map(function (h) {
      return parseInt(h, 16)
    }))
    var buffer = DTCArray.buffer
    wx.writeBLECharacteristicValue({
      deviceId: that.data.deviceId,
      serviceId: that.data.serviceId,
      characteristicId: that.data.characteristicId,
      value: buffer,
    })
    wx.onBLECharacteristicValueChange(function(res) {
     console.log('清除故障成功！')
    })
  },


  // 跳轉
  toHistory: function(){
    wx.navigateTo({
      url: 'storageData/index'
    })
  },

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
    wx.showToast({
      title: '功能初始化中',
      icon: 'loading',
      duration: 2000
    })
    this.orderDTC()
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