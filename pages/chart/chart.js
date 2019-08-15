var wxCharts = require('../../utils/wxcharts.js');
var app = getApp();
var ringChart = null;
Page({
    data: {
        number:0,
        Timer:''
    },

  // 定时任务刷新数据
  timeUpdata: function(){
      setInterval(function(){
      let num = Math.floor((Math.random()*100)+1);
      ringChart.updateData({
        title: {
            name: num+'%'
        },
        subtitle: {
            color: '#ff0000'
        }
    })      
      }
    ,3000)
     
  },

  numberUpdata: function(){
      var that = this
      setInterval(function(){
        let num = Math.floor((Math.random()*100)+1);
        that.setData({
            number:num
        })
        console.log('新的：',that.data.number)
    },1000)
  },
    
  onReady: function (e) {
        var that = this
        var windowWidth = 320;
        try {
            var res = wx.getSystemInfoSync();
            windowWidth = res.windowWidth;
        } catch (e) {
            console.error('getSystemInfoSync failed!');
        }

        ringChart = new wxCharts({
            animation: true,
            canvasId: 'ringCanvas',
            type: 'ring',
            extra: {
                ringWidth: 25,
                pie: {
                    offsetAngle: -45
                }
            },
            title: {
                name: '70%',
                color: '#7cb5ec',
                fontSize: 25
            },
            subtitle: {
                name: '当前速率',
                color: '#666666',
                fontSize: 15
            },
            series: [{
                name: '成交量1',
                data: 15,
                stroke: false
            }, {
                name: '成交量2',
                data: 35,
                 stroke: false
            }, {
                name: '成交量3',
                data: 78,
                stroke: false
            }, {
                name: '成交量4',
                data: 63,
                 stroke: false
            }],
            disablePieStroke: true,
            width: windowWidth,
            height: 200,
            dataLabel: false,
            legend: false,
            background: '#f5f5f5',
            padding: 0
        });
        ringChart.addEventListener('renderComplete', () => {
            console.log('renderComplete');
        });
       
    },

    onShow: function (e) {
        var that = this
        this.setData({
            Timer:setInterval(function(){
                let num = Math.floor((Math.random()*100)+1);
                that.setData({
                    number:num
                })
                console.log('新的：',that.data.number)
            },1000)
        })
    },


    /**
   * 生命周期函数--监听页面隐藏
   */
    onHide: function () {
        clearInterval(this.data.Timer)
    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {
        clearInterval(this.data.Timer)
    },

});