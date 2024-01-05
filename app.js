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
    // wx.login({
    //   success: res => {
    //     // 发送 res.code 到后台换取 openId, sessionKey, unionId
    //   }
    // })
    wx.login({
      success: function (res) {
        if (res.code) {
          // 登录成功，获取到临时登录凭证 code
          const code = res.code;
          // 调用小程序的获取用户信息接口
          wx.getUserInfo({
            success: function (userInfoRes) {
              // 获取用户信息成功，包括昵称、头像等1
              const userInfo = userInfoRes.userInfo;
  
              wx.cloud.callContainer({
                config: {
                  env: "prod-8ga1z8a47d2e61f1"
                },
                path: "/api/user/miniLogin",
                header: {
                 'content-type': 'application/json',
                      'openid': "",
                  "X-WX-SERVICE": "golang-vvm6"
                },
                method: "POST",
                data: {
                   code: code,
                              userInfo: userInfo
                },
                success: function(res) {
                       console.log(res.data.data)
                              // 登录成功，后端返回了用户标识1
                              const userId = res.data.data.openid;
                              const email = res.data.data.email;
                              const nickName = res.data.data.nickName;
                              console.log("yonghu 信息---"+email+nickName)
                              wx.setStorageSync('nickName', nickName)
                              wx.setStorageSync('email', email)
              
                               console.log(userId+"openid********************") 
                              // 将用户标识存储在本地，以便后续请求使用
                              wx.setStorageSync('openid', userId);
                              // 登录成功后的跳转或其他操作
                              // ...
                },
                fail: function(err) {
                  // 失败回调函数
                  console.error("API调用失败", err);
                }
              });
              
          
            },
            fail: function (err) {
              // 获取用户信息失败的处理
              // ...
            }
          });
        } else {
          // 登录失败的处理
          // ...
        }
      },

    });
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
