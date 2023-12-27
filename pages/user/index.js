// my.js
const app = getApp();
const request = require('request.js');
var utils = require('../../utils/util.js');

Page({
  data: {
    nickname: '',
    email: '',
    emailInputValue: '', // 用于绑定输入框的值
    title:"我的信息"
  },

  onLoad: function () {
    // 页面加载时，从全局数据中获取昵称和邮箱信息
    this.setData({
      nickname: wx.getStorageSync('nickName'),
      email: wx.getStorageSync('email'),
      emailInputValue: wx.getStorageSync('email'), // 将邮箱信息赋值给输入框的值
    });
  },

  emailInput: function (e) {
    // 输入框内容改变时更新数据
    this.setData({
      emailInputValue: e.detail.value
    });
  },

  modifyEmail: function () {
    const email = this.data.emailInputValue
    const apiUrl = app.globalData.apiUrl+"api/user/setEmail";
    const requestData = {
      email: email,
    };
    utils.handleSearch(this,"/api/user/setEmail",requestData)
    // request.request(apiUrl, 'GET', requestData)
    //   .then((response) => {
    //     console.log('请求成功:', response);
    //     wx.showToast({
    //       title: '修改成功',
    //       icon: 'success',
    //       duration: 2000,
    //       success: () => {
    //         // 清空表单数据和图片
    //         this.setData({
    //           // productName: '',
    //           // productPrice: '',
    //           // productDescription: '',
    //           // imageUrl: ''
    //         });
    //       }
    //     });
    //     // 处理请求成功的逻辑
    //   })
    //   .catch((error) => {
    //     console.log('请求失败:', error);
    //     // 处理请求失败的逻辑
    //   });
  }
})