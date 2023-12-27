// api.js
function request(url, method, data) {
  return new Promise((resolve, reject) => {
    wx.request({
      url: url,
      method: method,
      data: data,
      header: {
        'content-type': 'application/json',
        'openid': wx.getStorageSync('openid') // 将统一的token参数放在header中
      },
      success: (res) => {
        resolve(res.data);
      },
      fail: (error) => {
        reject(error);
      }
    })
  });
}

module.exports = {
  request: request
};