// app.js
App({
  onLaunch() {
    wx.cloud.init({
      env: 'prod-8ga1z8a47d2e61f1',
      traceUser: true
    });
    // 展示本地存储能力
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
  },
  globalData: {
    userInfo: null,
    apiUrl: "https://houguo.online/",
    // apiUrl: "http://localhost:8082/",
    // apiUrl: "https://golang-vvm6-86386-6-1312712248.sh.run.tcloudbase.com/",


    authToken: null,
    nickname: 'fggggggggg', // 初始化昵称为空
    email: 'dddddddddd' // 初始化邮箱为空
  }
})
