// pages/mytest/index.js
const util =  require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var userDefined = [true,true,true,true,true]
    this.setData({
      userDefined
    })
    var date = new Date();
    var errTime = util.formatTime(date)
    var errData = {
      id:"111",
      time: errTime,
      info:"暂无信息"
    }

    var carInfo = ["#OK", "#CAN 2.0A 11b 500K", "#ECU:7E8", "#Engine:ON", "1MODE_9 Support:D5 40 00 00", "1VIN1:1G1JC5444R7252368", "1CID1:JMB*367615001", "1CID2:JMB*4787261112", "1CVN1:1791BC82", "1CVN2:16E062BE", "1NAME:ECU1 CEngineControl", ""]
    carInfo = carInfo.slice(5, carInfo.length)
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
    console.log(carObj)
  },


  test:function(e){
      console.log(e)
      console.log("currentTarget:",e.currentTarget.dataset.aaaaaa)
      console.log("target:",e.target.dataset.aaaaaa)
  },


  switchChange:function(e){
    console.log(e)
    var index = e.currentTarget.dataset.index
    console.log(index)
    var userDefined = this.data.userDefined
    userDefined[index] = !userDefined[index]
    this.setData({
      userDefined
    })
  },

  dataTime:function(){
    var o = {
      "M+" : this.getMonth()+1,                 //月份
      "d+" : this.getDate(),                    //日
      "h+" : this.getHours(),                   //小时
      "m+" : this.getMinutes(),                 //分
      "s+" : this.getSeconds(),                 //秒
      "q+" : Math.floor((this.getMonth()+3)/3), //季度
      "S"  : this.getMilliseconds()             //毫秒
    };

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