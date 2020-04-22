const PidData = require('./data.js')
const stringTool  = require('../../../utils/stringTool.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    PidList: [],
    isture: [],
    chooseList:[]
  },


  // 多选框
  checkboxChange: function (e) {
    var chooseList = this.data.chooseList
    var PidList = e.detail.value
    var List = []
    for (let i=0; i<PidList.length; i++){
      let id = PidList[i].split(',')[0]
      let idHex = PidList[i].split(',')[1]
      let temp = {}
      temp['id'] = Number(id)
      temp['idHex'] = idHex
      List.push(temp)  
    }
    var sortList = List.sort(this.compare('id'))
    this.setData({
      chooseList:sortList
    })
  },


  // 对象数组排序
  compare: function(property){
    return function(a,b){
        var value1 = a[property];
        var value2 = b[property];
        return value1 - value2;
    }
},

 
  // 清除返回内容
  clearStr:function(){
    this.setData({
      str:''
    })
  },

  // 发送PID
  sendPID:function(e){
    var chooseList = this.data.chooseList
    if(chooseList.length <=13){
      var str = ''
      for(var i=0; i<chooseList.length; i++){
        str = str + chooseList[i]['idHex']
      }
      this.writeValue(str)
    }else{
      wx.showToast({
        title: 'PID数目超过13个无法发送',
        icon: 'none',
        duration: 1000
      })
    }
  },

  //  写数据函数
  writeValue:function(strHex){
    wx.showToast({
      title: '发送PID中...',
      icon: 'loading',
      duration: 1500
    })
      var that = this
      var str = ''
      var totalString = '4025' + strHex + 'FF0D0A'
      console.log("############",totalString)
      var typedArray = new Uint8Array(totalString.match(/[\da-f]{2}/gi).map(function (h) {
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
        str = str + blueData
        console.log('String>>>>>>：',blueData)
        console.log('totalString>>>>>',str)
        that.setData({
          str
        })
      })
      that.setData({
        timerTask3:setInterval(function(){
          that.setData({str})
          clearInterval(that.data.timerTask3)
        },2000)
      })
      
    },

  writePID:function(){
      var that = this
      var str = ''
      var totalString = stringTool.stringToHex('@PID') + '0D0A'
      var typedArray = new Uint8Array(totalString.match(/[\da-f]{2}/gi).map(function (h) {
          return parseInt(h, 16)
      }))
      var buffer = typedArray.buffer
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
        str = str + blueData
        console.log('String>>>>>>：',blueData)
        console.log('totalString>>>>>',str)
      })
    },


  writeMPID:function(){
      var that = this
      var str = ''
      var totalString = stringTool.stringToHex('@MPID') + '0D0A'
      var typedArray = new Uint8Array(totalString.match(/[\da-f]{2}/gi).map(function (h) {
          return parseInt(h, 16)
      }))
      var buffer = typedArray.buffer
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
        str = str + blueData
        console.log('String>>>>>>：',blueData)
        console.log('totalString>>>>>',str)
      })
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
    wx.showToast({
      title: '初始化中...',
      icon: 'loading',
      duration: 1800
    })
    that.setData({
      timerTask1:setInterval(function(){
        that.writePID()
        console.log(1111111)
        clearInterval(that.data.timerTask1)
      },1000)
    })
    // clearInterval(this.data.timerTask)
    
    that.setData({
      timerTask2:setInterval(function(){
        that.writeMPID()
        console.log(2222)
        clearInterval(that.data.timerTask2)
      },1500)
    })
    // clearInterval(this.data.timerTask)
  },

 // 选择
 choose:function(e){
  var that = this
  var id = e.target.dataset.id
  var idhex = e.target.dataset.idhex
  console.log(id,idhex)
  var chooseList = this.data.chooseList
  
  // 携带
  var flag = e.detail.value
  console.log("标志: ",flag)

  if(flag){
    if (that.isIn(chooseList,idhex)){

    }else{
      chooseList.push(idhex)
      that.setData({
        chooseList
      })
    }
    var a = [1,2]
  }else{
    console.log("取消操作！",idhex,chooseList)
    if (that.isIn(chooseList,idhex)){
      chooseList = that.remove(chooseList,idhex)
      that.setData({
        chooseList
      })
    }else{

    }
  }
  console.log("******", this.data.chooseList)
},

// 是否存在
isIn:function(arr,obj){
  for(var i=0; i<arr.length; i++){
    if(arr[i] == obj){
      return true
    }
  }
  return false
},

// 删除
remove:function(arr,obj){
  for(var i=0; i<arr.length; i++){
    if(arr[i] == obj){
      arr.pop(i)
    }
  }
  return arr
},


  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.setData({
      PidDataList:PidData.data
    })
    // 读取缓存
    // var PidList = wx.getStorageSync('PidList')
    // var isture =  this.addList(PidList)
    // console.log(PidList)
    // this.setData({
    //   PidList,
    //   isture
    // })
    // console.log(this.data.isture)
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