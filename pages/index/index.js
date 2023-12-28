// pages/tab1/tab1.js
var utils = require('../../utils/util.js');

Page({
  data: {
    searchKeyword: '', // 搜索关键字
    searchResult: [], // 搜索结果
    title:"商品搜索",
    userId:'',
    domain:''
  },
  onLoad: function(options) {

    const appInstance = getApp();
// 访问全局变量
const apiUrl = appInstance.globalData.apiUrl;
this.setData({
  domain:apiUrl
})
    // 在页面加载时自动触发的方法
    this.triggerSubscribeModal();
    console.log("页面加载完成，自动触发的方法"+apiUrl);
    this.handleLogin();
    // 在此处添加你的方法逻辑
    this.handleSearch();

  },
  onShow: function() {
    // 页面显示时执行的操作
    console.log('页面已显示****************');
    
    // 在这里可以进行页面刷新操作或数据加载操作
    this.handleSearch();

  },
  formatDates(objs) {
    return objs.map(item => {
      const date = new Date(item.CreatedAt); // 使用 Date 对象解析输入的时间字符串
      console.log(date+"*******")
      const year = date.getFullYear(); // 获取年份
      const month = String(date.getMonth() + 1).padStart(2, '0'); // 获取月份，并补齐成两位数
      const day = String(date.getDate()).padStart(2, '0'); // 获取日期，并补齐成两位数
      const hours = String(date.getHours()).padStart(2, '0'); // 获取小时，并补齐成两位数
      const minutes = String(date.getMinutes()).padStart(2, '0'); // 获取分钟，并补齐成两位数
      const seconds = String(date.getSeconds()).padStart(2, '0'); // 获取秒数，并补齐成两位数
      item.CreatedAt = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
      // item.CreatedAt = `${year}-${month}-${day}`
      return item; // 返回 "YYYY-MM-DD" 格式的日期字符串
    });
  },
  triggerSubscribeModal: function() {
    console.log("订阅success---------------------");
  
    wx.requestSubscribeMessage({
      tmplIds: ['XKdx0esytPR0ElXybw-d_0VBBBmP-y8I2w7UV8F9uxk', 'VbeyooicNuMv4KLVGNiCCmMnWnsTR6snBnykRrvPhIE'], // 替换为实际的模板 ID
      success: function(res) {
        console.log("订阅success---------------------");
        if (res['XKdx0esytPR0ElXybw-d_0VBBBmP-y8I2w7UV8F9uxk'] === 'accept' || res['VbeyooicNuMv4KLVGNiCCmMnWnsTR6snBnykRrvPhIE'] === 'accept') {
          wx.setStorageSync('is_sub', 1);
        }
      },
    });
  
  
  },
  // triggerSubscribeModal:function() {
  //   console.log("訂閲success---------------------");

  //   wx.requestSubscribeMessage({
  //     tmplIds: ['XKdx0esytPR0ElXybw-d_0VBBBmP-y8I2w7UV8F9uxk','VbeyooicNuMv4KLVGNiCCmMnWnsTR6snBnykRrvPhIE'], // 替换为实际的模板 ID
  //     success: function(res) {
  //       console.log("訂閲success---------------------");
  //       if (res['XKdx0esytPR0ElXybw-d_0VBBBmP-y8I2w7UV8F9uxk'] === 'accept' || res['VbeyooicNuMv4KLVGNiCCmMnWnsTR6snBnykRrvPhIE'] === 'accept') {
  //         wx.setStorageSync('is_sub', 1);

  //       } 
      
  //     },

  //   });
  //   // var is_sub = wx.getStorageSync('is_sub')
  //   // console.log("log----is_sub---"+is_sub)

  //   // wx.showModal({
  //   //   title: '订阅消息',
  //   //   content: '是否订阅消息通知？',
  //   //   success: function(res) {
  //   //     if (res.confirm) {
  //   //       // 用户点击了确定按钮，触发订阅弹框
  //   //       wx.requestSubscribeMessage({
  //   //         tmplIds: ['_-TV_81Or0oM9IqLn2oi5APXx7PS10GrSY8fhS0xeig','WOyG-68WmFf1UXpSYlxiEUOBkBcnfpqcJ2GVR2drJ84'], // 替换为实际的模板 ID
  //   //         success: function(res) {
  //   //           if (res['WOyG-68WmFf1UXpSYlxiEUOBkBcnfpqcJ2GVR2drJ84'] === 'accept' || res['_-TV_81Or0oM9IqLn2oi5APXx7PS10GrSY8fhS0xeig'] === 'accept') {
  //   //             wx.setStorageSync('is_sub', 1);

  //   //           } 
            
  //   //         },

  //   //       });
  //   //     }
  //   //   }
  //   // });
  // },

  
  // 监听搜索框输入
  handleSearchInput(e) {
    console.log("-----"+e.detail.value)
    this.setData({
      searchKeyword: e.detail.value,
    });
  },
// 预览图片
handlePreviewImage(event) {
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
      url: `/pages/tab2/tab2?id=${itemId}`
    });
  },
  

  // 执行搜索1
  handleSearch() {
    var param = {};
    utils.handleSearch(this,"/api/goods/list",param)
  //  wx.cloud.callContainer({
  //   config: {
  //     env: "prod-8ga1z8a47d2e61f1"
  //   },
  //   path: "/api/goods/list",
  //   header: {
  //    'content-type': 'application/json',
  //         'openid': wx.getStorageSync('openid'),
  //     "X-WX-SERVICE": "golang-vvm6"
  //   },
  //   method: "GET",
  //   data: {
  //        name:keyword,
  //         id :openId,
  //   },
  //   success: function(res) {
  //            let list = res.data
  //            list = utils.formatDates(list)
  //         console.log(list)
  //         _this.setData({
  //               searchResult : list
  //             })
  //   },
  //   fail: function(err) {
  //     // 失败回调函数
  //     console.error("API调用失败", err);
  //   }
  // });
  
    //  wx.request({
    //         url: this.data.domain+'api/goods/list',

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
            
                             console.log(userId) 
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
            
            // 将 code 和用户信息发送到后端进行登录验证
            // wx.request({
            //   url: domain+'api/user/miniLogin', // 后端登录接口的 URL
            //   method: 'POST',
            //   header: {
            //     'content-type': 'application/json',
            //     'openid': wx.getStorageSync('openid') // 将统一的token参数放在header中
            //   },
            //   data: {
            //     code: code,
            //     userInfo: userInfo
            //   },
            //   success: function (res) {
            //     console.log(res.data.data)
            //     // 登录成功，后端返回了用户标识
            //     const userId = res.data.data.openid;
            //     const email = res.data.data.email;
            //     const nickName = res.data.data.nickName;
            //     console.log("yonghu 信息---"+email+nickName)
            //     wx.setStorageSync('nickName', nickName)
            //     wx.setStorageSync('email', email)

            //      console.log(userId) 
            //     // 将用户标识存储在本地，以便后续请求使用
            //     wx.setStorageSync('openid', userId);
            //     // 登录成功后的跳转或其他操作
            //     // ...
            //   },
            //   fail: function (err) {
            //     // 登录失败的处理
            //     // ...
            //   }
            // });
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