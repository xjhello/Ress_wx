// var typedArray = new Uint8Array(strHex.match(/[\da-f]{2}/gi).map(function (h) {
//   return parseInt(h, 16)
// }))

// inArray方法可以检查数组元素的内容，以检查它是否与特定值匹配
export function inArray(arr, key, val) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i][key] === val) {
      return i;
    }
  }
  return -1;
}


// 字符串转回为ArrayBuffer对象
export function string2buffer(str) {
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
export function  getUint8Value(e) {
  for (var a = e, i = new DataView(a), n = "", s = 0; s < i.byteLength; s++) 
  n += String.fromCharCode(i.getUint8(s));
  return n
}

// 字符串转换为16进制
export function stringToHex(str) {
  　　var val = "";
  　　for(var i = 0; i < str.length; i++) {
  　　　　if(val == "") { val = str.charCodeAt(i).toString(16); } else { val += str.charCodeAt(i).toString(16); }
  　　}
  　　return val;
  }


// ArrayBuffer转16进度字符串示例
export function ab2hex(buffer) {
  var hexArr = Array.prototype.map.call(
    new Uint8Array(buffer),
    function (bit) {
      return ('00' + bit.toString(16)).slice(-2)
    }
  )
  return hexArr.join('');
}

// 16进制转化为字符串
export function hexCharCodeToStr(hexCharCodeStr) {
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


 