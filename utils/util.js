const formatTime = date => {
	const year = date.getFullYear();
	const month = date.getMonth() + 1;
	const day = date.getDate();
	const hour = date.getHours();
	const minute = date.getMinutes();
	const second = date.getSeconds();

	return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':');
};

const formatNumber = n => {
	n = n.toString();
	return n[1] ? n : '0' + n;
};
/**
 * 将小程序的API封装成支持Promise的API
 * @params fn {Function} 小程序原始API，如wx.login
 */
const wxPromisify = fn => {
  return function (obj = {}) {
    return new Promise((resolve, reject) => {
      obj.success = function (res) {
        resolve(res)
      }

      obj.fail = function (res) {
        reject(res)
      }

      fn(obj)
    })
  }
};
const compareVersion = (v1, v2) => {
  v1 = v1.split('.')
  v2 = v2.split('.')
  const len = Math.max(v1.length, v2.length)

  while (v1.length < len) {
    v1.push('0')
  }
  while (v2.length < len) {
    v2.push('0')
  }

  for (let i = 0; i < len; i++) {
    const num1 = parseInt(v1[i])
    const num2 = parseInt(v2[i])

    if (num1 > num2) {
      return 1
    } else if (num1 < num2) {
      return -1
    }
  }

  return 0
};
const uuid = () => {
  const s = [];
  const hexDigits = '0123456789abcdef';
  for (let i = 0; i < 36; i++) {
    s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
  }
  s[14] = '4';
  s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);
  s[8] = s[13] + s[18] + s[23];
  const uuid = s.join('');
  return uuid;
};

const checkLatLng = (latlng) => {
    if (!latlng.latitude || !latlng.longitude) {
      return false;
    }
    if (latlng.latitude >= 90 || latlng.latitude <= -90 || latlng.longitude >= 180 || latlng.longitude <= -180) {
      return false;
    }
    return true;
  }
const numberToFixed = (num, length = 6) => {
    const n = 10 ** length;
    return Math.floor(num * n) / n;
}

function formatDates(objs) {
  return objs.map(item => {
    var date = new Date(item.CreatedAt); // 使用 Date 对象解析输入的时间字符串
    // 将时间戳转换为北京时区的时间
    // date = new Date(date.getTime() + 8 * 60 * 60 * 1000);
    console.log(date+"*******")
    const year = date.getFullYear(); // 获取年份
    const month = String(date.getMonth() + 1).padStart(2, '0'); // 获取月份，并补齐成两位数
    const day = String(date.getDate()).padStart(2, '0'); // 获取日期，并补齐成两位数
    const hours = String(date.getHours()).padStart(2, '0'); // 获取小时，并补齐成两位数
    const minutes = String(date.getMinutes()).padStart(2, '0'); // 获取分钟，并补齐成两位数
    const seconds = String(date.getSeconds()).padStart(2, '0'); // 获取秒数，并补齐成两位数
    item.CreatedAt = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    if ('tipTime' in item) {
      console.log('对象包含 tipTime 键');
      var datetip = new Date(item.tipTime); // 使用 Date 对象解析输入的时间字符串
      // datetip = new Date(datetip.getTime() + 8 * 60 * 60 * 1000);

      console.log(datetip+"*******")
      const year = datetip.getFullYear(); // 获取年份
      const month = String(datetip.getMonth() + 1).padStart(2, '0'); // 获取月份，并补齐成两位数
      const day = String(datetip.getDate()).padStart(2, '0'); // 获取日期，并补齐成两位数
      const hours = String(datetip.getHours()).padStart(2, '0'); // 获取小时，并补齐成两位数
      const minutes = String(datetip.getMinutes()).padStart(2, '0'); // 获取分钟，并补齐成两位数
      const seconds = String(datetip.getSeconds()).padStart(2, '0'); // 获取秒数，并补齐成两位数
      item.tipTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    } else {
      console.log('对象不包含 tipTime 键');
    }
    // item.CreatedAt = `${year}-${month}-${day}`
    return item; // 返回 "YYYY-MM-DD" 格式的日期字符串
  });
}
const requestAdd = (thisP,data,path,callback) =>{
  wx.cloud.callContainer({
    config: {
      env: "prod-8ga1z8a47d2e61f1"
    },
    path: path,
    header: {
     'content-type': 'application/json',
          'openid': wx.getStorageSync('openid'),
      "X-WX-SERVICE": "golang-vvm6"
    },
    method: "POST",
    data:data,
    success: function(res) {
            // 提交成功后，可以进行相应的提示或页面跳转等操作
              wx.showToast({
                title: '提交成功',
                icon: 'success',
                duration: 2000,
                success: () => {
                  // 清空表单数据和图片
                  thisP.setData({
                    productName: '',
                    productPrice: '',
                    productDescription: '',
                    imageUrl: ''
                  });
                }
              });
              if (callback && typeof callback === 'function') {
                callback(null, res,thisP); // 将响应作为第二个参数传递
              }
              wx.navigateBack();
    },
    fail: function(err) {
      // 失败回调函数
      console.error("API调用失败", err);
      if (callback && typeof callback === 'function') {
        callback(err,thisP); // 将错误作为第一个参数传递
      }
    }
    
  });
  
}


function isEmptyObject(obj) {
  return Object.keys(obj).length === 0;
}

const handleSearch = (thisP,path,param) => {
    
      const keyword = thisP.data.searchKeyword;
      let openId = wx.getStorageSync('openId');
      var _this = thisP
      var data = {
        name:keyword,
        id :openId,
  }
      if(!isEmptyObject(param)){
        console.log(JSON.stringify(param)+"*******************param")
        data = param;
      }
    console.log(keyword)
    wx.cloud.callContainer({
      config: {
        env: "prod-8ga1z8a47d2e61f1"
      },
      path: path,
      header: {
            'content-type': 'application/json',
            'openid': wx.getStorageSync('openid'),
            "X-WX-SERVICE": "golang-vvm6"
      },
      method: "GET",
      data: data,
      success: function(res) {
        let list = res.data

        if(path=="/api/card/list"){
          list = list.list
        }
        if(path=="/api/user/setEmail"){
               wx.showToast({
                title: '邮箱修改成功',
                icon: 'success',
                duration: 2000,
                success: () => {
                  // 清空表单数据和图片
                  this.setData({
                    // productName: '',
                    // productPrice: '',
                    // productDescription: '',
                    // imageUrl: ''
                  });
                }
              });
        }
              list = formatDates(list)
            console.log(list)
            _this.setData({
                  searchResult : list
                })
      },
      fail: function(err) {
        // 失败回调函数
        console.error("API调用失败", err);
      }
});



}

const handleGet = (thisP,path,data,callback) => {
    
  let openId = wx.getStorageSync('openId');
  var _this = thisP

wx.cloud.callContainer({
  config: {
    env: "prod-8ga1z8a47d2e61f1"
  },
  path: path,
  header: {
        'content-type': 'application/json',
        'openid': wx.getStorageSync('openid'),
        "X-WX-SERVICE": "golang-vvm6"
  },
  method: "GET",
  data: data,
  success: function(res) {

    if (callback && typeof callback === 'function') {
      callback(null, res,thisP); // 将响应作为第二个参数传递
    }
  },
  fail: function(err) {
    // 失败回调函数
    console.error("API调用失败", err);
    if (callback && typeof callback === 'function') {
      callback(err,thisP); // 将错误作为第一个参数传递
    }
  }
});



}
const chooseImage = (thisP) => {
  var _this = thisP
  wx.chooseImage({
    count: 1,
    success: (res) => {
      const tempFilePaths = res.tempFilePaths;
      wx.cloud.uploadFile({
        config: {
          env: "prod-8ga1z8a47d2e61f1"
        },
        cloudPath: 'images/' + Date.now() + '-' + Math.floor(Math.random() * 1000),  // 设置云存储的文件路径和文件名
        filePath: tempFilePaths[0],  // 要上传的图片临时路径
        success: function (res) {
          // 图片上传成功，返回文件 ID
          const fileId = res.fileID;
          console.log('图片上传成功，文件 ID:', fileId);
  


          wx.cloud.getTempFileURL({
            fileList: [fileId],
            success: function (res) {
              const fileList = res.fileList;
              if (fileList && fileList.length > 0) {
                const tempFileURL = fileList[0].tempFileURL;
                // console.error('获取文件临时链接失败'+tempFileURL);

                // 在小程序中展示图片
                _this.setData({
                  imageUrl: tempFileURL
                });
                console.log('util upload 成功');

              } else {
                console.error('获取文件临时链接失败');
              }
            },
            fail: function (error) {
              console.error('获取文件临时链接失败:', error);
            }
          });


          // 其他处理逻辑
        },
        fail: function (error) {
          // 图片上传失败，打印错误信息
          console.error('图片上传失败:', error);
        }
      });



      //  utils.upload(tempFilePaths[0],_this);
    }
  });
}

const upload = (filePath,thisP) =>{
          console.log("路径-"+filePath)
      // 构建请求头部
      const boundary = '---------------------------' + Date.now().toString(16);
      const header = {
        'Content-Type': 'multipart/form-data; boundary=' + boundary
      };

      // 构建请求体数据
      const createMultipartData = (params) => {
        let multipartData = '';

        for (let key in params) {
          multipartData += '--' + boundary + '\r\n';
          multipartData += 'Content-Disposition: form-data; name="' + key + '"\r\n\r\n';
          multipartData += params[key] + '\r\n';
        }

        multipartData += '--' + boundary + '\r\n';
        multipartData += 'Content-Disposition: form-data; name="file"; filename="file123hhhh.png"\r\n';
        multipartData += 'Content-Type: image/png\r\n\r\n';
        multipartData += wx.getFileSystemManager().readFileSync(filePath, 'binary') + '\r\n';
        multipartData += '--' + boundary + '--\r\n';

        return multipartData;
      };

      const formData = createMultipartData({
        token: 'dPxB3-1_kdUi0uMRLK5rnAy096YEy77V6s2mTYqd:DpX31sSjlJR6K2r3xaysYegWkoo=:eyJzY29wZSI6Im1pbi1rIiwiZGVhZGxpbmUiOjE3MDM1ODE0NTl9',
      });

      // 发送文件上传请求
      wx.request({
        url: 'https://up-z2.qiniup.com',
        method: 'POST',
        header: header,
        data: formData,
        success: function (res) {
          // 处理上传成功的回调
          console.log(JSON.stringify( res) +"@@@@@@@@@");
          thisP.setData({
            imageUrl: "http://s687dm7qx.hn-bkt.clouddn.com/"+res.data.hash
          });




        },
        fail: function (error) {
          // 处理上传失败的回调
          console.error(error);
        }
      });











  


}


module.exports = {
  formatTime: formatTime,
  formatDates:formatDates,
  wxPromisify: wxPromisify,
  compareVersion: compareVersion,
  uuid: uuid,
  checkLatLng: checkLatLng,
  numberToFixed,
  upload:upload,
  chooseImage:chooseImage,
  requestAdd:requestAdd,
  handleSearch:handleSearch,
  handleGet:handleGet
};
