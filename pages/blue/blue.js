const app = getApp()

function inArray(arr, key, val) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i][key] === val) {
      return i;
    }
  }
  return -1;
}

// ArrayBuffer转16进度字符串示例
function ab2hex(buffer) {
  var hexArr = Array.prototype.map.call(
    new Uint8Array(buffer),
    function (bit) {
      return ('00' + bit.toString(16)).slice(-2)
    }
  )
  return hexArr.join('');
}

Page({
  data: {
    devices: [],
    connected: false,
    chs: [],
  },

// 初始化蓝牙--开始搜索--监听寻找到新设备的事件--收集蓝牙设备的信息--uid与蓝牙建立连接
// --获取蓝牙设备所有服务--成功回调得到蓝牙uuid--获取蓝牙设备某个服务中所有特征值
// --回调获得设备特征值列表--读取低功耗蓝牙设备的特征值的二进制数据值



onLoad: function () {
  getBluetoothAdapterState();

},

  openBluetoothAdapter() {
    // 初始化蓝牙模块
    wx.openBluetoothAdapter({
      success: (res) => {
        wx.showToast({
          title: '蓝牙初始化成功',
          icon: 'none',
          duration: 2000
        })
        console.log('初始化蓝牙模块 success', res)
        this.startBluetoothDevicesDiscovery()
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

      // 本机蓝牙状态失败
      fail: (res) => {
        wx.showToast({
          title: '本机蓝牙未打开！',
          icon: 'none',
          duration: 2000
        });
        console.log('本机蓝牙未打开！', res);
      }
      
    })
  },

  //  开始蓝牙搜索
  startBluetoothDevicesDiscovery() {
    // 默认为flase
    if (this._discoveryStarted) {
      return
    }
    this._discoveryStarted = true

  // 开始搜寻附近的蓝牙外围设备,连接到设备后调用 wx.stopBluetoothDevicesDiscovery 方法停止搜索
    wx.startBluetoothDevicesDiscovery({
      // 是否允许重复上报同一设备。如果允许重复上报，则 wx.onBlueToothDeviceFound 方法会多次上报同一设备，但是 RSSI 值会有不同。
      allowDuplicatesKey: true,  
      success: (res) => {
        console.log('开始搜寻附近的蓝牙外围设备 success', res)
        // 监听寻找到新设备的事件
        this.onBluetoothDeviceFound()
      },



      fail: () =>{
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
  onBluetoothDeviceFound() {
    wx.onBluetoothDeviceFound((res) => {
      // devices属性为 新搜索到的设备列表
      // forEach() 方法用于调用数组的每个元素，并将元素传递给回调函数
      res.devices.forEach(device => {
        // name:蓝牙设备名称，某些设备可能没有
        // localName:当前蓝牙设备的广播数据段中的 LocalName 数据段
        if (!device.name && !device.localName) {
          return
        }
        const foundDevices = this.data.devices
        // deviceId:用于区分设备的 id
        const idx = inArray(foundDevices, 'deviceId', device.deviceId)
        const data = {}
        if (idx === -1) {
          data[`devices[${foundDevices.length}]`] = device
        } else {
          data[`devices[${idx}]`] = device
        }
        this.setData(data)
      })
    })
  },

  // 点击事件，连接低功耗蓝牙设备
  createBLEConnection(e) {
    const ds = e.currentTarget.dataset
    const deviceId = ds.deviceId  // 用于区分设备的 id
    const name = ds.name  
    wx.createBLEConnection({
      deviceId,   // 用于区分设备的 id

      success: (res) => {
        this.setData({
          connected: true,
          name,
          deviceId,
        }),
        // 获取蓝牙设备所有服务(service)。
        this.getBLEDeviceServices(deviceId)
      }
    })
    // 停止搜索
    this.stopBluetoothDevicesDiscovery()
  },

  // 失败
  fail: () => {
    wx.showToast({
      title: '蓝牙连接失败！！',
      icon: 'none',
      duration: 2000
    });
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
    wx.getBLEDeviceServices({
      deviceId,  // 蓝牙设备 id
      // 成功回调
      success: (res) => {
        for (let i = 0; i < res.services.length; i++) {
          if (res.services[i].isPrimary) {
            this.getBLEDeviceCharacteristics(deviceId, res.services[i].uuid)
            return
          }
        }
      },

     // 失败
     fail: (res) =>{
      wx.showToast({
        title: '获取蓝牙设备所有服务失败',
        icon: 'none',
        duration: 2000
      });
     },

    })
  },

  //  获取蓝牙设备某个服务中所有特征值(characteristic)
  getBLEDeviceCharacteristics(deviceId, serviceId) {
    wx.getBLEDeviceCharacteristics({
      deviceId,  // 蓝牙设备 id
      serviceId, //蓝牙服务 uuid
      success: (res) => { // 回调获得设备特征值列表
        console.log('获取蓝牙设备某个服务中所有特征值 success', res.characteristics)
        for (let i = 0; i < res.characteristics.length; i++) {
          let item = res.characteristics[i]
          if (item.properties.read) {     // properties该特征值支持的操作类型
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
          if (item.properties.write) {   // properties该特征值支持的操作类型
            this.setData({ 
              canWrite: true
            })
            this._deviceId = deviceId
            this._serviceId = serviceId
            this._characteristicId = item.uuid
            //  向低功耗蓝牙设备特征值中写入二进制数据
            this.writeBLECharacteristicValue()
          }
          if (item.properties.notify || item.properties.indicate) {
            // 启用低功耗蓝牙设备特征值变化时的 notify 功能
            wx.notifyBLECharacteristicValueChange({
              deviceId,
              serviceId,
              characteristicId: item.uuid,
              state: true,
            })
          }
        }
      },
      fail(res) {
        console.error('获取回调获得设备特征值列表失败', res)
      }
    })

    // 操作之前先监听，保证第一时间获取数据
    wx.onBLECharacteristicValueChange((characteristic) => {
      const idx = inArray(this.data.chs, 'uuid', characteristic.characteristicId)
      const data = {}
      if (idx === -1) {
        data[`chs[${this.data.chs.length}]`] = {
          uuid: characteristic.characteristicId,
          value: ab2hex(characteristic.value)
        }
      } else {
        data[`chs[${idx}]`] = {
          uuid: characteristic.characteristicId,
          value: ab2hex(characteristic.value)
        }
      }
      // data[`chs[${this.data.chs.length}]`] = {
      //   uuid: characteristic.characteristicId,
      //   value: ab2hex(characteristic.value)
      // }
      this.setData(data)
    })
  },

  // 向低功耗蓝牙设备特征值中写入二进制数据
  writeBLECharacteristicValue() {
    // 向蓝牙设备发送一个0x00的16进制数据
    let buffer = new ArrayBuffer(1)
    let dataView = new DataView(buffer)
    dataView.setUint8(0, Math.random() * 255 | 0)
    wx.writeBLECharacteristicValue({
      deviceId: this._deviceId,
      serviceId: this._deviceId,
      characteristicId: this._characteristicId,
      value: buffer,

      // 成功回调
      success (res) {
        console.log('writeBLECharacteristicValue success', res.errMsg)
      }
    })
  },
  // 关闭
  closeBluetoothAdapter() {
    wx.closeBluetoothAdapter()
    this._discoveryStarted = false
  },
})
