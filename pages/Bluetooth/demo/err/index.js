const testData =  require('../../../../config.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    testData:[],
    errorIndex:0,
    num:20,
    errorIndex:0
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
    console.log(this.errorIndex)
  },

  hideModal(e) {
    this.setData({
      modalName: null
    })
  },


    // 跳轉
  toHistory: function(){
      wx.navigateTo({
        url: '../../faultData/storageData/index'
      })
    },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      this.setData({
        testData:testData.errList
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