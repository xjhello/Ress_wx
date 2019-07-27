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

// 字符串转化为ArrayBuffer
function hexStringToArrayBuffer(str) {
  if(!str) {
      return new ArrayBuffer(0);
  }
  var buffer = new ArrayBuffer(str.length);
  let dataView = new DataView(buffer)
  let ind = 0;
  for (var i = 0, len = str.length; i < len; i += 2) {
      let code = parseInt(str.substr(i, 2), 16)
      dataView.setUint8(ind, code)
      ind++
  }
  return buffer;
}


function str2ab(str) {
  var buf = new ArrayBuffer(str.length*2); // 2 bytes for each char
  var bufView = new Uint16Array(buf);
  for (var i=0, strLen=str.length; i<strLen; i++) {
    bufView[i] = str.charCodeAt(i);
  }
  return buf;
}


function hexStringToArrayBuffer(str) {
  if(!str) {
      return new ArrayBuffer(0);
  }
  var buffer = new ArrayBuffer(str.length);
  let dataView = new DataView(buffer)
  let ind = 0;
  for (var i = 0, len = str.length; i < len; i += 2) {
      let code = parseInt(str.substr(i, 2), 16)
      dataView.setUint8(ind, code)
      ind++
  }
  return buffer;
}


Page({
  /**
   * 页面的初始数据
   */
  data: {
   timer: '',//定时器名字
   countDownNum: '60'//倒计时初始值
  },
  
  abc:function(){
    console.log('213213123213213213')
  },
  onLoad: function () {
    var st = 'QE9CRFxyXG4=' // base64 @OBD\r\n
    var st2 = 'QE9CRA=='  // base64 @OBD
    var st3 = '@OBD'
    var buffer = wx.base64ToArrayBuffer(st)  // base64 -> ab
    var buffer2 = str2ab(st)  // str -> ab
    var b3 = hexStringToArrayBuffer(st3)
    console.log('ab -> base64的hex', ab2hex(buffer))
    console.log('ab -> 16hex', ab2hex(buffer2))
    console.log('st3', ab2hex(b3))
    
    const base64 = wx.arrayBufferToBase64(buffer)
    console.log('bbbbbbbbb',base64)
    
    setTimeout(function(){ console.log('213213123213213213')},7000)
  
  },

  onShow: function(){
   //什么时候触发倒计时，就在什么地方调用这个函数
  //  this.countDown();
  },
  
  countDown: function () {
   let that = this;
   let countDownNum = that.data.countDownNum;//获取倒计时初始值
   //如果将定时器设置在外面，那么用户就看不到countDownNum的数值动态变化，所以要把定时器存进data里面
   that.setData({
    timer: setInterval(function () {//这里把setInterval赋值给变量名为timer的变量
     //每隔一秒countDownNum就减一，实现同步
     countDownNum--;
     //然后把countDownNum存进data，好让用户知道时间在倒计着
     that.setData({
      countDownNum: countDownNum
     })
     //在倒计时还未到0时，这中间可以做其他的事情，按项目需求来
     if (countDownNum == 0) {
      //这里特别要注意，计时器是始终一直在走的，如果你的时间为0，那么就要关掉定时器！不然相当耗性能
      //因为timer是存在data里面的，所以在关掉时，也要在data里取出后再关闭
      clearInterval(that.data.timer);
      //关闭定时器之后，可作其他处理codes go here
     }
    }, 1000)
   })
  }
 })