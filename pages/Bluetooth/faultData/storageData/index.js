// pages/Bluetooth/faultData/storageData/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    List:[],//缓存数据list
    errorIndex:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var value = wx.getStorageSync('errData')
    var errorNumbers = value.length 
    this.setData({
      List:value,
      errorNumbers
    })
    console.log(this.data.List)
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

// 清除历史故障缓存
clearErr:function(){
  try {
    wx.removeStorageSync('errData')
  } catch (e) {
  }
  this.setData({
    List:[]
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