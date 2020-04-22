const app = getApp()
const stringTool  = require('../../../utils/stringTool.js')
const config = require('../../../config.js')
Page({
  data: {
    onlyTage:false, //区别ress和其他设备标志
    a:'AABB',
    isLink:false,
    deviceId:'',//要连接的设备id
    dataList:[], // 数据列表
    devices: [],
    err:[],
    connected: false,
    chs: [],
    bluedata:{},  // 蓝牙数据对象
    icon:'/image/link.png',
    icon_in:'/image/link_in.png'
  },

// 初始化蓝牙--开始搜索--监听寻找到新设备的事件--收集蓝牙设备的信息--uid与蓝牙建立连接
// --获取蓝牙设备所有服务--成功回调得到蓝牙uuid--获取蓝牙设备某个服务中所有特征值
// --回调获得设备特征值列表--读取低功耗蓝牙设备的特征值的二进制数据值

// 已经连接跳转到蓝牙
toBlue: function(e){
  if(this.isLink==true){
    wx.navigateTo({
      url: '../blueconnect/blueconnect?deviceId='+deviceId+'&name='+name,
    })
    }else{
      wx.showModal({
        title: '提示',
        content: '蓝牙未连接！',
        success (res) {
          if (res.confirm) {
          } else if (res.cancel) {
          }
        }
      })
    }
    
  },

toDemo:function(e){
  wx.navigateTo({
    url: '../demo/demo'
  })
},

onLoad: function () {
  // getBluetoothAdapterState();
},

// 获取本机蓝牙适配器状态
  getBluetoothAdapterState() {
    wx.getBluetoothAdapterState({   
      success: (res) => {
        wx.showToast({
          title: '本机蓝牙适配器已经打开',
          icon: 'none',
          duration: 2000
        });
        console.log('本机蓝牙适配器已经打开', res)
        // discovering: 是否正在搜索设备
        // available: 蓝牙适配器是否可用
        if (res.discovering) { 
          // 正在搜索设备
          // 继续监听寻找到新设备的事件
          this.onBluetoothDeviceFound()
        } else if (res.available) {
          // 蓝牙适配器可用
          // 开始蓝牙搜索
          this.startBluetoothDevicesDiscovery()
        }
      },
      fail: (res) => {
        wx.showToast({
          title: '本机蓝牙未打开！',
          icon: 'none',
          duration: 2000
        });
      }
    })
  },


  // 点击搜索事件：
  // 初始化蓝牙模块->开始搜索蓝牙并且不断监听，有新的蓝牙出现就更新数据
  openBluetoothAdapter(e) {
    // console.log('点击事件',e)
    var findType = e.currentTarget.dataset.findtype
    console.log('参数：',findType)
    this.closeBluetoothAdapter()
    // console.log('初始化蓝牙模块')
    wx.showToast({
      title: '蓝牙搜索中',
      icon: 'loading',
      duration: 1500
    })
    wx.openBluetoothAdapter({
      success: (res) => {
        console.log('初始化蓝牙模块成功', res)
        this.startBluetoothDevicesDiscovery(findType)
      },
      fail: (res) => {
        if (res.errCode === 10001) {
          wx.showToast({
            title: '当前蓝牙适配器不可用',
            icon: 'none',
            duration: 2000
          });
          // 监听蓝牙适配器状态变化事件
          wx.onBluetoothAdapterStateChange(function (res) {
            console.log('监听蓝牙适配器状态变化事件', res)
            // available 蓝牙适配器是否可用
            // discovering 蓝牙适配器是否处于搜索状态
            if (res.available) {
              this.startBluetoothDevicesDiscovery()
            }
          })
        }
      }
    })
  },


  //  开始蓝牙搜索
  startBluetoothDevicesDiscovery(findType) {
    // 默认为flase
    if (this._discoveryStarted) {
      return
    }
    this._discoveryStarted = true
  // 开始搜寻附近的蓝牙外围设备,连接到设备后调用 wx.stopBluetoothDevicesDiscovery 方法停止搜索
    wx.startBluetoothDevicesDiscovery({
      // 是否允许重复上报同一设备。如果允许重复上报，则 wx.onBlueToothDeviceFound 方法会多次上报同一设备，但是 RSSI 值会有不同。
      allowDuplicatesKey: true,  
      success:(res) => {
        console.log('开始搜寻附近的蓝牙外围设备成功', res)
        // 监听寻找到新设备的事件
        this.onBluetoothDeviceFound(findType)
      },
      fail:() =>{
        wx.showToast({
          title: '没有找到指定设备',
          icon: 'none',
          duration: 2000
        });

      },
    })
  },

  // 停止搜寻附近的蓝牙外围设备
  stopBluetoothDevicesDiscovery() {
    wx.stopBluetoothDevicesDiscovery()
  },

  // 监听寻找到新设备的事件
  onBluetoothDeviceFound1(findType) {
    var that = this
    console.log('查询的设备类型为：',findType)
    wx.onBluetoothDeviceFound((res) => {
      // devices属性为 新搜索到的设备列表
      // forEach() 方法用于调用数组的每个元素，并将元素传递给回调函数
      // console.log('回到函数...',res.devices)
      res.devices.forEach(device => {
        // name:蓝牙设备名称，某些设备可能没有
        // localName:当前蓝牙设备的广播数据段中的 LocalName 数据段
        // console.log('开始循环...',device)
        if (!device.name && !device.localName) {
          return
        }
        // foundDevices为列表套对象的蓝牙设备清单
        const foundDevices = this.data.devices
        // deviceId:用于区分设备的 id
        console.log('foundDevices为列表套对象的蓝牙设备清单',foundDevices)
        const idx = stringTool.inArray(foundDevices, 'deviceId', device.deviceId)
        const data = {}
        if (idx === -1) {
          console.log('idx=-1')
          data[`devices[${foundDevices.length}]`] = device
        } else {
          console.log('有设备！',findType)
          // 搜索类别为ress设备
          if(findType == 'ress'){
            // 如果是rees设备，添加标志位
            if(device.name.startsWith('JDY')){
                console.log('JDY设备添加标识',device)
                // device.key = true
                // console.log(device.key)
                devices[idx] = device
                // data[`devices[${idx}]`] = device
                console.log('得到Ress蓝牙列表',devices)
                that.setData({
                  devices
                })
              }
            }
            if(findType == 'other'){
              console.log('普通设备')
              devices[idx] = device
              console.log('得到普通设备蓝牙列表',devices)
              that.setData({
                devices
              })
              // data[`devices[${idx}]`] = device
            }

          // if(device.name.startsWith('JDY')){
          //   console.log('JDY设备添加标识')
          //   device.key = true
          //   console.log(device.key)
          // }
          // data[`devices[${idx}]`] = device
        }
        // console.log('得到蓝牙列表',data)
        // this.setData(data)
      })
    })
  },


   // 监听寻找到新设备的事件
   onBluetoothDeviceFound(findType) {
     var that = this
    wx.onBluetoothDeviceFound((res) => {
      // devices属性为 新搜索到的设备列表
      // forEach() 方法用于调用数组的每个元素，并将元素传递给回调函数
      // console.log('回到函数...',res.devices)
      res.devices.forEach(device => {
        // name:蓝牙设备名称，某些设备可能没有
        // localName:当前蓝牙设备的广播数据段中的 LocalName 数据段
        // console.log('开始循环...',device)
        if (!device.name && !device.localName) {
          return
        }
        // foundDevices为列表套对象的蓝牙设备清单
        const foundDevices = this.data.devices
        // deviceId:用于区分设备的 id
        // console.log('foundDevices为列表套对象的蓝牙设备清单',foundDevices)
        const idx = stringTool.inArray(foundDevices, 'deviceId', device.deviceId)
        const data = {}
        var devices = []
        if (idx === -1) {
          console.log('idx=-1')
          data[`devices[${foundDevices.length}]`] = device
        } else {
          console.log(findType)
          if(findType=='ress'){
            // 两种模式的标志位选择ress就启动筛选模板，选择其他的就不启动筛选模板
            this.setData({
              onlyTage:true
            })
            if(device.name.startsWith('JDY')){
              console.log('是ress设备，添加')
              // console.log('device的类型:',typeof device)
              // devices[idx] = device
              console.log('JDY设备添加标识')
              device.key = true
              // console.log('得到的表',devices,typeof devices)
              data[`devices[${idx}]`] = device
            }
          }else if(findType=='other'){
            this.setData({
              onlyTage:false
            })
            console.log('是其他蓝牙设备，添加')
              device.key = false
              data[`devices[${idx}]`] = device 
          }else{
            this.setData({
              onlyTage:false
            })
            device.key = false
            console.log('不知道是什么，添加')
            data[`devices[${idx}]`] = device
          }
          // data[`devices[${idx}]`] = device
          console.log('!!!', data)
        }
        // console.log('得到蓝牙列表',data)
        this.setData(data)
      })
    })
  },


  // 点击事件：连接低功耗蓝牙设备
  createBLEConnection(e) {
    var that = this
    console.log('开始连接蓝牙')
    const ds = e.currentTarget.dataset
    console.log('点击的e',ds)
    const deviceId = ds.deviceId  // 用于区分设备的 id
    console.log('得到的的id',deviceId)
    that.setData({
      deviceId:deviceId
    })
    const name = ds.name
    wx.showModal({
      title: '提示',
      content: '是否连接该设备?',
      success (res) {
        if (res.confirm) {
          console.log('用户点击确定')
          console.log('数据参数：', ds,deviceId,name)
          wx.showLoading({
            title: '连接中...',
          })
          wx.createBLEConnection({
            deviceId,   // 用于区分设备的 id
            success: (res) => {
              wx.hideLoading()
              console.log('蓝牙连接成功！！！')
              app.globalData.blueData.isLink = true
              app.globalData.blueData.devices = that.data.devices
              that.setData({
                isLink: app.globalData.blueData.isLink,
                name,
                deviceId,
              }),
              wx.navigateTo({
                url: '../blueconnect/blueconnect?deviceId='+deviceId+'&name='+name,
              })
            },
            fail: () => {
              console.log('蓝牙连接失败！！')
              wx.showToast({
                title: '蓝牙连接失败！！',
                icon: 'none',
                duration: 2000
              });
            },
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })  
    // 停止搜索
    this.stopBluetoothDevicesDiscovery()
  },

  // 关闭蓝牙连接
  closeBLEConnection() {
    wx.closeBLEConnection({
      deviceId: this.data.deviceId
    })
    this.setData({
      connected: false,
      chs: [],
      canWrite: false,
    })
  },

  // 获取蓝牙设备所有服务(service)。
  getBLEDeviceServices(deviceId) {
    // console.log('获取蓝牙设备所有服务')
    wx.getBLEDeviceServices({
      deviceId,  // 蓝牙设备 id
      // 成功回调
      success: (res) => {
        // console.log('蓝牙已经连接')
        // console.log('获取蓝牙设备所有服务成功！！！！！！！！:',res.services)
        // for (let i = 0; i < res.services.length; i++) {
        //   if (res.services[i].isPrimary) {
        //     this.getBLEDeviceCharacteristics(deviceId, res.services[i].uuid)
        //     return
        //   }
        // }
      },
     // 失败
     fail: (res) =>{
      console.log('蓝牙没有连接')
      // wx.showToast({
      //   title: '获取蓝牙设备所有服务失败',
      //   icon: 'none',
      //   duration: 2000
      // });
     },

    })
  },

  //  获取蓝牙设备某个服务中所有特征值(characteristic)
  getBLEDeviceCharacteristics(deviceId, serviceId) {
    var _this = this;
    var datalist = [] // 当前服务得到的数据列表
    console.log('获取蓝牙设备某个服务中所有特征值')
    wx.getBLEDeviceCharacteristics({
      deviceId,  // 蓝牙设备 id
      serviceId, //蓝牙服务 uuid
      success: (res) => { // 回调获得设备特征值列表
        console.log('获取蓝牙设备某个服务中所有特征值 success', res.characteristics)
        for (let i = 0; i < res.characteristics.length; i++) {
          let item = res.characteristics[i]
          if (item.properties.read) {     // properties该特征值支持的操作类型
            console.log('该蓝牙服务为Read状态')
            wx.readBLECharacteristicValue({ //  读取低功耗蓝牙设备的特征值的二进制数据值
              deviceId,
              serviceId,
              characteristicId: item.uuid,  //蓝牙特征值的 uuid
              // 读取回调函数 
              success (res) {
                console.log('读取蓝牙服务特征值成功！:', res.errCode)
              },

              fail (){
                wx.showToast({
                  title: '读取蓝牙服务特征值失败',
                  icon: 'none',
                  duration: 2000
                });
              }
            })
          }
          if (item.properties.write || item.properties.notify  || item.properties.indicate) {   // properties该特征值支持的操作类型
            console.log('该蓝牙服务为Write notify状态!')
            this.setData({ 
              canWrite: true
            }) 
            this._deviceId = deviceId
            this._serviceId = serviceId
            this._characteristicId = item.uuid
            console.log('服务序号',i)
            if (i==0){
            wx.notifyBLECharacteristicValueChange({
              state: true,
              deviceId: this._deviceId,
              serviceId: this._serviceId,
              characteristicId: this._characteristicId,
              success (res) {
                console.log('id',i,'notify服务开启', res.errMsg)
              }
            })
             //  向低功耗蓝牙设备特征值中写入二进制数据
             this.writeBLECharacteristicValue()
          }
          }
          if (item.properties.notify || item.properties.indicate) {
            // 启用低功耗蓝牙设备特征值变化时的 notify 功能
            this.setData({ 
              canWrite: true
            }) 
            this._deviceId = deviceId
            this._serviceId = serviceId
            this._characteristicId = item.uuid
            console.log('该蓝牙服务为notify状态')
            if (i==0){
            wx.notifyBLECharacteristicValueChange({
              state: true,
              deviceId: this._deviceId,
              serviceId: this._serviceId,
              characteristicId: this._characteristicId,
              success (res) {
                console.log('id',i,'notify服务开启', res.errMsg)
              },
            })
          }
        }
        }
      },
      fail(res) {
        console.error('获取回调获得设备特征值列表失败', res)
      }
    })
    // 监听低功耗蓝牙设备的特征值变化事件
    wx.onBLECharacteristicValueChange(function(res) {
      // res.value是一个ArrayBuffer对象
      // 一次指令过后会返回过个res，我们需要的是res.value，把这个值存到列表中
      console.log(`蓝牙设备的特征值 ${res.characteristicId} 数据表变化\n, 现在的数据是 ${res.value}`)
      var strHex = stringTool.ab2hex(res.value) // 转为16进制字符串
      console.log('16进制为：', strHex)
      var blueData = stringTool.hexCharCodeToStr(strHex)
      console.log('字符串为：', blueData)
      datalist.push(blueData)
      _this.setData({
        bluedata: {
          strhexdata:strHex,
          strdata:blueData
        },
        dataList:datalist
      })
      console.log('添加新的数据dataList:', _this.dataList)
    })
  },

  // 向低功耗蓝牙设备特征值中写入二进制数据
  writeBLECharacteristicValue() {
    console.log('向蓝牙设备发送16进制数据')
    // @CAR\r\n: 40434152726e 
    // @OBD\r\n: 404f42440D0A
    // @PID\r\n：405049440D0A
    var hex = '404f42440D0A'
    var typedArray = new Uint8Array(hex.match(/[\da-f]{2}/gi).map(function (h) {
        return parseInt(h, 16)
    }))
    console.log(typedArray)
    // console.log([0xAA, 0x55, 0x04, 0xB1, 0x00, 0x00, 0xB5])
    var buffer1 = typedArray.buffer
    console.log(buffer1)
    // 向蓝牙设备发送一个0x00的16进制数据
    var st = 'QE9CRFxyXG4='
    var buffer = wx.base64ToArrayBuffer(st)
     wx.writeBLECharacteristicValue({
      deviceId: this._deviceId,
      serviceId: this._serviceId,
      characteristicId: this._characteristicId,
      value: buffer1,
      // 成功回调
      success (res) {
        console.log('写入二进制数据 success', res.errMsg)
      },
      fail (res){
        console.log('写入二进制数据 失败', res.errMsg)
      }
    })
  },


  // 检测蓝牙是否连接
  getConnectedBluetoothDevices(testId){
     wx.getConnectedBluetoothDevices({
        services:testId,
        success (res) {
          console.log(res.devices)
          if(res.devices.length!=0){
            console.log(res.devices,'蓝牙已经连接')
          }else{
            console.log('蓝牙没有连接')
            wx.showModal({
              title: '提示',
              content: '蓝牙已断开！',
              success (res) {
                if (res.confirm) {
                  //跳转
                  // wx.navigateTo({
                  //   url: ''
                  // })
                } else if (res.cancel) {
                  console.log('用户点击取消')
                }
              }
            })
          }
        },
        fail(err){
          
        }
      })
  },
  // 关闭蓝牙
  closeBluetoothAdapter() {
    console.log('关闭蓝牙')
    wx.closeBluetoothAdapter()
    this._discoveryStarted = false
  },

  onShow: function () { 
  },

  onHide: function () {
    console.log('监听页面隐藏')
    this.setData({
      devices:[]
    })
  },
})
