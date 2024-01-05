// pages/tab1/tab1.js
var utils = require('../../utils/util.js');

Page({
  data: {
    searchKeyword: '', // 搜索关键字
    searchResult: [], // 搜索结果
    title:"打卡列表",
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
    utils.handleGet(this,"/api/qiniu/token",{},function(err,res,thisP){
      //  console.log(res.data.token+)
      utils.setCache("qiniu_token",res.data.token,10 * 60 * 1000)
  
      console.log("打印缓存############"+res.data.token)
     })
    const apiUrl = appInstance.globalData.apiUrl;
    this.setData({
      domain:apiUrl
    })
    // 在页面加载时自动触发的方法
    console.log("页面加载完成，自动触发的方法");
    // 在此处添加你的方法逻辑
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
            url: this.data.domain+'api/user/clock',

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
  goToClock(e) {
    const itemId = e.currentTarget.dataset.itemId;
    wx.navigateTo({
      url: `/pages/card/card?id=${itemId}`
    });
  },
  
  goToDetail(event) {

    let tid = event.currentTarget.dataset.id;

    console.log("sssssssssssssss"+tid)
    wx.navigateTo({
      url: `/pages/detail/index?id=${tid}`
      // url: `/pages/map/marker?id=${tid}`

    });
  },
  // 执行搜索
  handleSearch() {
    
    const keyword = this.data.searchKeyword;
   let openId = wx.getStorageSync('openId');
   var param = {"desc":keyword,"id":openId};
   utils.handleSearch(this,"/api/card/list",param)
    //  wx.request({
    //         url: this.data.domain+'api/card/list',

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
        
    //         let list = res.data.list
    //         list = this.formatDates(list)
    //         console.log(list)
    //         this.setData({
    //           searchResult : list
    //         })
    //   },
    //      })

  },

// 小程序端代码
// 假设有一个 login 页面，包含一个按钮用于触发登录流程

// 当点击登录按钮时触发的事件处理函数













});