// pages/splash/splash.js
var utils = require('../../utils/util.js');
const defaultAvatarUrl = 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0'

Page({

  /**
   * 页面的初始数据
   */
  data: {
      imageUrl:"",
      bimageUrl:"",
      userInfo: {},
      hasUserInfo: false,
      canIUseGetUserProfile: false,
      avatarUrl: defaultAvatarUrl,
    nickname: '',
    jump:false,
  },

  onChooseAvatar: function(e) {
    const avatarUrl = e.detail.avatarUrl;
    console.log("touxiang "+avatarUrl)
    var thisP = this
    utils.uploadImage(avatarUrl,thisP);

    this.setData({
      avatarUrl: avatarUrl
    });
  },

  onNicknameInput: function(e) {
    const nickname = e.detail.value;
    console.log("nicheng  "+nickname)

    this.setData({
      nickname: nickname
    });
  },
  onInput(event) {
    
    const {value } = event.detail;
    const id = event.currentTarget.id
    console.log("test-----"+JSON.stringify(this.data))
    this.setData({
      [id]: value
    });
  },
  handleDetail() {
    
    let openId = wx.getStorageSync('openId');
     const id = this.data.id
     console.log("**********"+id+openId)
     var data = {"id":id}
     utils.handleGet(this,"/api/user/detail",data,function(err, res,thisP) {
       if (err) {
         console.error("获取失败", err);
         // 处理错误情况
       } else {
         console.log("获取成功111", res);
        console.log(res.data.nickName)
        if(res.data.nickName===""|| res.data.nickName===undefined){
          thisP.setData({
            jump:true,
          })
        }else{
          thisP.setData({
            nickName:res.data.nickName,
            avatarUrl:res.data.avatarUrl,
          })
          setTimeout(() => {

              wx.reLaunch({
                url: '/pages/index/index',
              });
            
         
          }, 2000);
        }

        thisP.setData({
          nickname:res.data.nickName,
          avatarUrl:res.data.avatarUrl,
          imageUrl:res.data.avatarUrl

        })

         
       }
     })
    },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    console.log("Kaiping")

    if (wx.getUserProfile) {
      console.log("profile*********")
    
      this.setData({
        canIUseGetUserProfile: true
      })
    }
    this.handleSetting();
    this.handleDetail();

  },
  onSkip: function() {
    // 处理跳过按钮点击事件的逻辑
    console.log("跳过按钮被点击");
    // 可以在这里执行相应的操作，例如跳转到下一个页面或执行其他逻辑
    const {nickname,imageUrl} = this.data
    console.log("skip-----------"+nickname)
    if(nickname==="" || imageUrl===""){
      console.log("weikon")
      wx.showModal({
        title: '图片必传',
        content: '请填写完整的参数', 
        showCancel: false
      });
      return;
    }else{
      var data = {"nickName":this.data.nickname,"avatarUrl":this.data.imageUrl}
      utils.requestAdd(this,data,"/api/user/update",function(err, res,thisP) {
      })
      wx.reLaunch({
        url: '/pages/index/index',
      });
    }
    
  },
  handleSetting() {
    

     utils.handleGet(this,"/api/setting/get",{},function(err, res,thisP) {
       if (err) {
         console.error("获取失败", err);
         // 处理错误情况
       } else {
         console.log("获取成功11", res.data.bimageUrl);
         // 处理成功响应
         thisP.setData({

             bimageUrl:res.data.imageUrl
           })
          
         
       }
     })
    },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },


  getUserProfile(e) {
    // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认
    // 开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
    wx.getUserProfile({
      desc: '用于完善会员资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        console.log("request---------prolifile")
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    })
  },
  getUserInfo(e) {
    console.log("request---------userInfo")

    // 不推荐使用getUserInfo获取用户信息，预计自2021年4月13日起，getUserInfo将不再弹出弹窗，并直接返回匿名的用户个人信息
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },


  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})