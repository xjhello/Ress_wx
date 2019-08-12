const app = getApp()
// inArray方法可以检查数组元素的内容，以检查它是否与特定值匹配
function inArray(arr, key, val) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i][key] === val) {
      return i;
    }
  }
  return -1;
}


// 字符串转回为ArrayBuffer对象
function string2buffer(str) {
  // 首先将字符串转为16进制
  let val = ""
  for (let i = 0; i < str.length; i++) {
    if (val === '') {
      val = str.charCodeAt(i).toString(16)
    } else {
      val += ',' + str.charCodeAt(i).toString(16)
    }
  }
  // 将16进制转化为ArrayBuffer
  return new Uint8Array(val.match(/[\da-f]{2}/gi).map(function (h) {
    return parseInt(h, 16)
  })).buffer
}


// ArrayBuffer转字符串
function  getUint8Value(e) {
  for (var a = e, i = new DataView(a), n = "", s = 0; s < i.byteLength; s++) 
  n += String.fromCharCode(i.getUint8(s));
  return n
}

// 字符串转换为16进制
function stringToHex(str) {
  　　var val = "";
  　　for(var i = 0; i < str.length; i++) {
  　　　　if(val == "") { val = str.charCodeAt(i).toString(16); } else { val += str.charCodeAt(i).toString(16); }
  　　}
  　　return val;
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

// 16进制转化为字符串
function hexCharCodeToStr(hexCharCodeStr) {
  　　var trimedStr = hexCharCodeStr.trim();
  　　var rawStr = trimedStr.substr(0,2).toLowerCase() === "0x"? trimedStr.substr(2) : trimedStr;
  　　var len = rawStr.length;
  　　if(len % 2 !== 0) {
  　　　　alert("Illegal Format ASCII Code!");
  　　　　return "";
  　　}
  　　var curCharCode;
  　　var resultStr = [];
  　　for(var i = 0; i < len;i = i + 2) {
  　　　　curCharCode = parseInt(rawStr.substr(i, 2), 16); // ASCII Code Value
  　　　　resultStr.push(String.fromCharCode(curCharCode));
  　　}
  　　return resultStr.join("");
 }


Page({
  data: {
    vss:0,
    text:'',
    deviceId:'',
    deviceName:'',
    dataList:[], // 数据列表
    devices: [],
    connected: true,
    chs: [],
    bluedata:{},  // 蓝牙数据对象
    serviceId:'',          // 蓝牙特征值对应服务的 uuid
    characteristicId:''  // 蓝牙特征值的 uuid
  },


  onLoad: function (options) {
      // 接受参数  
      var deviceid = options.deviceId
      var name = options.name
      this.setData({
        deviceName:name,
        deviceId:deviceid
      })
      console.log('进入连接页面，开始连接...')
      console.log(this.data.deviceId)
      console.log(this.data.deviceName)
      // this.startBluetoothDevicesDiscovery()
      // this.createBLEConnection(name,deviceid)
      // this.getBLEDeviceServices(deviceid)
      this.getBLEDeviceServices(deviceid)
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
        console.log('开始搜寻附近的蓝牙外围设备成功', res)
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


  // 停止搜寻附近的蓝牙外围设备
  stopBluetoothDevicesDiscovery() {
    wx.stopBluetoothDevicesDiscovery()
  },


  // 点击事件：连接低功耗蓝牙设备
  createBLEConnection(deviceid,devicename) {
    var that = this 
    console.log('开始连接蓝牙')
    // var deviceId = deviceid  // 用于区分蓝牙设备的id
    // var name = name          // 蓝牙名称
    console.log('数据参数：',deviceid,devicename)
    wx.createBLEConnection({
      deviceId: deviceid,   // 用于区分设备的 id
      success: (res) => {
        console.log('蓝牙连接成功！！！')
        this.setData({
          connected: true,
          name:devicename,
          deviceId:deviceid,
        }),
        // 获取蓝牙设备所有服务(service)。
        this.getBLEDeviceServices(deviceId)
      },
       // 失败
      fail: (res) => {
        console.log(res)
        wx.showToast({
          title: '蓝牙连接失败！！',
          icon: 'none',
          duration: 2000
        });
      },
    })
    // 停止搜索
    this.stopBluetoothDevicesDiscovery()
  },

  // 断开蓝牙连接
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
    console.log('获取蓝牙设备所有服务')
    wx.getBLEDeviceServices({
      deviceId,  // 蓝牙设备 id
      // 成功回调
      success: (res) => {
        console.log('获取蓝牙设备所有服务成功！！！！！！！！:',res.services)
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
    var that = this;
    var datalist = [] // 当前服务得到的数据列表
    console.log('获取蓝牙设备某个服务中所有特征值')
    wx.getBLEDeviceCharacteristics({
      deviceId,  // 蓝牙设备 id
      serviceId, //蓝牙服务 uuid
      success: (res) => { // 回调获得设备特征值列表
        console.log('获取蓝牙设备某个服务中所有特征值 success', res.characteristics)
        console.log('开始遍历服务列表...')
        for (let i = 0; i < res.characteristics.length; i++) {
          let item = res.characteristics[i]
          console.log('标号'+i+'服务'+'serviceid为'+item.uuid)
          if (item.properties.read) {     // properties该特征值支持的操作类型
            console.log('标号'+i+'该蓝牙服务为Read状态')
            // wx.readBLECharacteristicValue({ //  读取低功耗蓝牙设备的特征值的二进制数据值
            //   deviceId,
            //   serviceId,
            //   characteristicId: item.uuid,  //蓝牙特征值的 uuid
            //   // 读取回调函数 
            //   success (res) {
            //     console.log('读取蓝牙服务特征值成功！:', res.errCode)
            //   },

            //   fail (){
            //     wx.showToast({
            //       title: '读取蓝牙服务特征值失败',
            //       icon: 'none',
            //       duration: 2000
            //     });
            //   }
            // })
          }
          if (item.properties.write || item.properties.notify|| item.properties.indicate) {   // properties该特征值支持的操作类型
            console.log('标号'+i+'Write notify 可控制状态!')
            this.setData({ 
              canWrite: true
            })
            if (i==0){
            var _deviceId = deviceId
            var _serviceId = serviceId          // 蓝牙特征值对应服务的 uuid
            var _characteristicId = item.uuid  // 蓝牙特征值的 uuid
            that.setData({
              deviceId:_deviceId,
              serviceId:_serviceId,
              characteristicId:_characteristicId
            })
            console.log('开启0号服务............')
            wx.notifyBLECharacteristicValueChange({
              state: true,
              deviceId: that.data.deviceId,
              serviceId: that.data.serviceId,
              characteristicId: that.data.characteristicId,
              success (res) {
                console.log('id',i,'服务开启', res.errMsg)
              }
            })
          }
          }
        //   if (item.properties.write ||item.properties.notify) {
        //     // 启用低功耗蓝牙设备特征值变化时的 notify 功能
        //     console.log('标号'+i+'Write notify 可以监控状态!')
        //     this.setData({ 
        //       canWrite: true
        //     }) 
        //     this._deviceId = deviceId
        //     this._serviceId = serviceId
        //     this._characteristicId = item.uuid
        //     if (i==0){
        //     wx.notifyBLECharacteristicValueChange({
        //       state: true,
        //       deviceId: this._deviceId,
        //       serviceId: this._serviceId,
        //       characteristicId: this._characteristicId,
        //       success (res) {
        //         console.log('id',i,'notify服务开启', res.errMsg)
        //       },
        //     })
        //   }
        // }
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
      var strHex = ab2hex(res.value) // 转为16进制字符串
      console.log('16进制为：', strHex)
      var blueData = hexCharCodeToStr(strHex)
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

  writeValueOBD(e){
    var that = this
    console.log('向蓝牙设备发送@OBD\\r\\n指令')
    // @OBD\r\n: 404f42440D0A
    var hex = '404f42440D0A'
    var typedArray = new Uint8Array(hex.match(/[\da-f]{2}/gi).map(function (h) {
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
        console.log('写入二进制数据 success', res.errMsg)

      },
      fail (res){
        console.log('写入二进制数据 失败', res.errMsg)
      }
    })
     // 监听低功耗蓝牙设备的特征值变化事件
    wx.onBLECharacteristicValueChange(function(res) {
      // res.value是一个ArrayBuffer对象
      // 一次指令过后会返回过个res，我们需要的是res.value，把这个值存到列表中
      console.log(`蓝牙设备的特征值 ${res.characteristicId} 数据表变化\n, 现在的数据是 ${res.value}`)
      var strHex = ab2hex(res.value) // 转为16进制字符串
      console.log('16进制为：', strHex)
      var blueData = hexCharCodeToStr(strHex)
      console.log('字符串为：', blueData)
      // datalist.push(blueData)
      that.setData({
        bluedata: {
          strhexdata:strHex,
          strdata:blueData
        }
        // dataList:datalist
      })
      // console.log('添加新的数据dataList:', that.dataList)
    })
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
        console.log('写入二进制数据 success', res.errMsg)

      },
      fail (res){
        console.log('写入二进制数据 失败', res.errMsg)
      }
    })
     // 监听低功耗蓝牙设备的特征值变化事件
    wx.onBLECharacteristicValueChange(function(res) {   
      var strHex = ab2hex(res.value) // 转为16进制字符串
      console.log('16进制为：', strHex)
      var blueData = hexCharCodeToStr(strHex)
      // console.log('字符串为：', blueData)
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
            }
          })
        }
        
      }
    })
  },

  // 关闭蓝牙
  closeBluetoothAdapter() {
    console.log('关闭蓝牙')
    wx.closeBluetoothAdapter()
    this._discoveryStarted = false
  },


    // ArrayBuffer转16进制字符串示例
  ab2hex(buffer) {
  let hexArr = Array.prototype.map.call(
    new Uint8Array(buffer),
    function(bit) {
      return ('00' + bit.toString(16)).slice(-2)
    }
  )
  return hexArr.join('');
  },

  // 清除指令
  clearInstructions(e){
    var that = this
    console.log('向蓝牙设备发送清除指令')
    // PAUSE\r\n: 50415553450D0A
    var hex = '50415553450D0A'
    var typedArray = new Uint8Array(hex.match(/[\da-f]{2}/gi).map(function (h) {
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
        console.log('写入二进制数据 success', res.errMsg)

      },
      fail (res){
        console.log('写入二进制数据 失败', res.errMsg)
      }
    })
     // 监听低功耗蓝牙设备的特征值变化事件
    wx.onBLECharacteristicValueChange(function(res) {
      // res.value是一个ArrayBuffer对象
      // 一次指令过后会返回过个res，我们需要的是res.value，把这个值存到列表中
      console.log(`蓝牙设备的特征值 ${res.characteristicId} 数据表变化\n, 现在的数据是 ${res.value}`)
      var strHex = ab2hex(res.value) // 转为16进制字符串
      console.log('16进制为：', strHex)
      var blueData = hexCharCodeToStr(strHex)
      console.log('字符串为：', blueData)
      // datalist.push(blueData)
      that.setData({
        bluedata: {
          strhexdata:strHex,
          strdata:blueData
        }
        // dataList:datalist
      })
      // console.log('添加新的数据dataList:', that.dataList)
    })
  },


  // 事件处理
  formSubmit: function (e) {
    console.log('form发生了submit事件，携带数据为：', e.detail.value)
    var orderString =  e.detail.value.input
    var orderHex = stringToHex(orderString) + '0D0A'
    console.log(orderHex)

    this.writeValue(orderHex)
  },
  formReset: function () {
    console.log('form发生了reset事件')
  },


  // 跳转
  toFault:function(){
    console.log('跳转故障页面')
    wx.navigateTo({
      url: '../faultData/faultData?deviceId=' + this.data.deviceId + '&serviceId='+
      this.data.serviceId + '&characteristicId=' + this.data.characteristicId
    })

  }

})