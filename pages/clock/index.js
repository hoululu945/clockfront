// pages/tab1/tab1.js
var utils = require('../../utils/util.js');

Page({
  data: {
    searchKeyword: '', // 搜索关键字
    searchResult: [], // 搜索结果
    title:"闹钟搜索",
    userId:'',
    domain:''
  },
  onShow: function() {
    // 页面显示时执行的操作
    console.log('页面已显示****************');
    
    // 在这里可以进行页面刷新操作或数据加载操作
    this.handleSearch();

  },
  onLoad: function(options) {
    const appInstance = getApp();

// 访问全局变量
const apiUrl = appInstance.globalData.apiUrl;
this.setData({
  domain:apiUrl
})
    // 在页面加载时自动触发的方法
    // this.triggerSubscribeModal();
    console.log("页面加载完成，自动触发的方法"+apiUrl);
    // this.handleLogin();
    // 在此处添加你的方法逻辑
    this.handleSearch();

  },
  formatDates(objs) {
    return objs.map(item => {
      const date = new Date(item.tipTime); // 使用 Date 对象解析输入的时间字符串
      console.log(date+"*******")
      const year = date.getFullYear(); // 获取年份
      const month = String(date.getMonth() + 1).padStart(2, '0'); // 获取月份，并补齐成两位数
      const day = String(date.getDate()).padStart(2, '0'); // 获取日期，并补齐成两位数
      const hours = String(date.getHours()).padStart(2, '0'); // 获取小时，并补齐成两位数
      const minutes = String(date.getMinutes()).padStart(2, '0'); // 获取分钟，并补齐成两位数
      const seconds = String(date.getSeconds()).padStart(2, '0'); // 获取秒数，并补齐成两位数
      item.tipTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
      // item.tipTime = `${year}-${month}-${day}`
      return item; // 返回 "YYYY-MM-DD" 格式的日期字符串
    });
  },
  triggerSubscribeModal:function() {
    wx.showModal({
      title: '订阅消息',
      content: '是否订阅消息通知？',
      success: function(res) {
        if (res.confirm) {
          // 用户点击了确定按钮，触发订阅弹框
          wx.requestSubscribeMessage({
            tmplIds: ['_-TV_81Or0oM9IqLn2oi5APXx7PS10GrSY8fhS0xeig'], // 替换为实际的模板 ID
            success: function(res) {
              if (res['0RWFOTZw9hhlhQh9fLJlmoFoGcuiwpxf3aB3LtQdV2U'] === 'accept' || res['_-TV_81Or0oM9IqLn2oi5APXx7PS10GrSY8fhS0xeig'] === 'accept') {
                // 用户同意订阅消息，显示成功订阅的弹框
                // wx.showModal({
                //   title: '订阅成功',
                //   content: '您已成功订阅消息',
                //   showCancel: false,
                //   confirmText: '确定',
                //   success: function(res) {
                //     // 点击确定按钮后的回调
                //   }
                // });
              } 
              // else {
              //   // 用户拒绝订阅消息或取消订阅
              //   wx.showModal({
              //     title: '订阅失败',
              //     content: '您已拒绝或取消订阅消息',
              //     showCancel: false,
              //     confirmText: '确定',
              //     success: function(res) {
              //       // 点击确定按钮后的回调
              //     }
              //   });
              // }
            },
            // fail: function(err) {
            //   // 请求订阅消息授权失败
            //   wx.showModal({
            //     title: '订阅失败',
            //     content: '请求订阅消息授权失败',
            //     showCancel: false,
            //     confirmText: '确定',
            //     success: function(res) {
            //       // 点击确定按钮后的回调
            //     }
            //   });
            // }
          });
        }
      }
    });
  },

  
  // 监听搜索框输入
  handleSearchInput(e) {
    console.log("-----"+e.detail.value)
    this.setData({
      searchKeyword: e.detail.value,
    });
  },
// 预览图片
handlePreviewImage(event) {
  console.log(event.currentTarget.dataset.imageUrl+"999999999999999999999999999999")
  const imageUrl = event.currentTarget.dataset.imageUrl;
  if(!(imageUrl===""||imageUrl===undefined)){
    wx.previewImage({
      urls: [imageUrl],
    });
  }

},
  // 执行搜索
  clock() {
    
   let openId = wx.getStorageSync('openId');

     wx.request({
            url: this.data.domain+'/api/user/clock',

      method: 'GET',
      header: {
        'content-type': 'application/json',
        'openid': wx.getStorageSync('openid') // 将统一的token参数放在header中
      },
      data: {
        id :openId,
       },
      success: (res) => {
         console.log(res.data)
      },
         })

  },
  goToClock1(e) {
    const itemId = e.currentTarget.dataset.itemId;
    wx.navigateTo({
      url: `/pages/clock2/index?id=${itemId}`
    });
  },
  

  // 执行搜索
  handleSearch() {
    
  //   const keyword = this.data.searchKeyword;
  //  let openId = wx.getStorageSync('openId');
   var param = {};
   utils.handleSearch(this,"/api/clock/list",param)
    //  wx.request({
    //         url: this.data.domain+'api/clock/list',

    //   method: 'GET',
    //   header: {
    //     'content-type': 'application/json',
    //     'openid': wx.getStorageSync('openid') // 将统一的token参数放在header中
    //   },
    //   data: {
    //     name:keyword,
    //     id :openId,
    //    },
    //   success: (res) => {
    //     let list = res.data
    //     list = this.formatDates(list)
    //     console.log(list)
    //         this.setData({
    //           searchResult : list
    //         })
    //   },
    //      })

  },

// 小程序端代码
// 假设有一个 login 页面，包含一个按钮用于触发登录流程

// 当点击登录按钮时触发的事件处理函数

 handleLogin: function() {
  const domain = this.data.domain

 // 调用小程序的登录接口，获取临时登录凭证 code
  wx.login({
    success: function (res) {
      if (res.code) {
        // 登录成功，获取到临时登录凭证 code
        const code = res.code;
        // 调用小程序的获取用户信息接口
        wx.getUserInfo({
          success: function (userInfoRes) {
            // 获取用户信息成功，包括昵称、头像等
            const userInfo = userInfoRes.userInfo;

 
            // 将 code 和用户信息发送到后端进行登录验证
            wx.request({
              url: domain+'api/user/miniLogin', // 后端登录接口的 URL
              method: 'POST',
              header: {
                'content-type': 'application/json',
                'openid': wx.getStorageSync('openid') // 将统一的token参数放在header中
              },
              data: {
                code: code,
                userInfo: userInfo
              },
              success: function (res) {
                console.log(res.data.data)
                // 登录成功，后端返回了用户标识
                const userId = res.data.data.openid;
                 console.log(userId) 
                // 将用户标识存储在本地，以便后续请求使用
                wx.setStorageSync('openid', userId);
                // 登录成功后的跳转或其他操作
                // ...
              },
              fail: function (err) {
                // 登录失败的处理
                // ...
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
    fail: function (err) {
      // 登录失败的处理
      // ...
    }
  });
}











});