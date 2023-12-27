// pages/tab2/tab2.js
var utils = require('../../utils/util.js');

Page({
  data: {
    productName: '',
    productPrice: '',
    productDescription: '',
    imageUrl: '',
    title:'',
    detail:'',
    domain:'',
    date:'2006-01-02',
    time:'08:26:09',
    datetime:"2006-01-02 08:26:09",
    openid:""
  },

  onLoad: function(options) {
    const appInstance = getApp();
    var now = new Date();

    // 获取年份
    var year = now.getFullYear();
    
    // 获取月份（注意月份从 0 开始，需要加 1）
    var month = now.getMonth() + 1;
    
    // 获取日期
    var dat = now.getDate();
    
    // 获取小时
    var hours = now.getHours();
    
    // 获取分钟
    var minutes = now.getMinutes();
    
    // 获取秒数
    var seconds = now.getSeconds();

    // 访问全局变量
    const apiUrl = appInstance.globalData.apiUrl;
    this.setData({
      date: year + "-" + month + "-" + dat,
      time: hours + ":" + minutes + "",
      domain:apiUrl
    })
  },
  chooseAlarmTime() {
    wx.showTimePicker({
      success: (res) => {
        const { hour, minute } = res.time;
        const alarmTime = `${hour}:${minute}`;
        this.setData({ alarmTime });
      }
    });
  },
  bindDateChange: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      date: e.detail.value,
    })
  },
  bindDatetimeChange: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      time: e.detail.value,

    })
  },
  handleScan() {
    wx.showLoading({
      title: '正在初始化...',
    });

    wx.cloud.init({
      env: 'your-environment-id', // 云开发环境 ID
    });

    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        const tempFilePath = res.tempFilePaths[0];
        this.splitAndRecognizeText(tempFilePath);
      },
      fail: (res) => {
        console.log(res);
      }
    });
  },

  splitAndRecognizeText(imagePath) {
    wx.showLoading({
      title: '正在识别...',
    });

    const MAX_CHUNK_SIZE = 512 * 1024; // 每个分块的最大大小（这里设置为512KB）

    wx.getFileSystemManager().readFile({
      filePath: imagePath,
      success: (res) => {
        const base64Data = res.data;
        const totalChunks = Math.ceil(base64Data.length / MAX_CHUNK_SIZE);

        const promises = [];
        for (let i = 0; i < totalChunks; i++) {
          const start = i * MAX_CHUNK_SIZE;
          const end = Math.min(start + MAX_CHUNK_SIZE, base64Data.length);
          const chunkData = base64Data.substring(start, end);

          promises.push(this.callRecognizeText(chunkData));
        }

        Promise.all(promises)
          .then((results) => {
            // 合并处理结果
            const mergedResult = results.reduce((acc, res) => {
              if (res.result && res.result.code === 0 && res.result.data && res.result.data.items && res.result.data.items.length > 0) {
                const detail = res.result.data.items[0].text;
                acc.push(detail);
              }
              return acc;
            }, []);

            if (mergedResult.length > 0) {
              const detail = mergedResult.join('\n');
              this.setData({
                detail,
              });
            } else {
              wx.showToast({
                title: '未能识别到文字',
                icon: 'none',
              });
            }
          })
          .catch((err) => {
            console.log(err);
            wx.showToast({
              title: '识别失败',
              icon: 'none',
            });
          })
          .finally(() => {
            wx.hideLoading();
          });
      },
      fail: (err) => {
        console.log(err);
        wx.hideLoading();
        wx.showToast({
          title: '读取图片失败',
          icon: 'none',
        });
      }
    });
  },

  callRecognizeText(data) {
    return new Promise((resolve, reject) => {
      wx.cloud.callFunction({
        name: 'recognizeText',
        data: {
          image: data,
        },
        success: (res) => {
          resolve(res);
        },
        fail: (err) => {
          reject(err);
        }
      });
    });
  },

  onInput(event) {

    const {value } = event.detail;
    const id = event.currentTarget.id
    const { productName, productPrice, productDescription, imageUrl } = this.data;
    console.log("test-----"+JSON.stringify(this.data))
    this.setData({
      [id]: value
    });
  },

  chooseImage() {
    utils.chooseImage(this)
  },
// 预览图片
 handlePreviewImage() {
    // 在这里实现图片放大的逻辑
    // 可以使用 wx.previewImage API 来预览图片
    if(this.data.imageUrl){
      wx.previewImage({
        urls: [this.data.imageUrl], // 预览的图片链接数组
        current: this.data.imageUrl, // 当前显示的图片链接
      });
    }

  },
  onSubmit(event) {
    // 获取表单数据
    const { productName, productPrice, productDescription, imageUrl,date,time,title } = this.data;
    console.log(date+time)
    console.log("test-----"+JSON.stringify(this.data))
    // 先上传图片

    var data = {
            des:productDescription,
            tipTime:this.data.date+" "+this.data.time+":00",
            tipImage:imageUrl,
            title
          }
    utils.requestAdd(this,data,"/api/clock/add",function(err, res,thisP) {
      if (err) {
        console.error("提交失败", err);
        // 处理错误情况
      } else {
        console.log("提交成功", res);
        thisP.setData({
          productName: '',
          productPrice: '',
          productDescription: '',
          imageUrl: ''
        });
        // 处理成功响应
      }
    })

        // 发送商品信息和图片 URL 到后端接口
        // wx.request({
        //   url: this.data.domain+'api/clock/add',
        //   header: {
        //     'content-type': 'application/json',
        //     'openid': wx.getStorageSync('openid') // 将统一的token参数放在header中
        //   },
        //   method: 'POST',
        //   data: {
        //     des:productDescription,
        //     tipTime:this.data.date+" "+this.data.time+":00",
        //     tipImage:imageUrl,
        //     title
        //   },
        //   success: (res) => {
        //     // 提交成功后，可以进行相应的提示或页面跳转等操作
        //     wx.showToast({
        //       title: '提交成功',
        //       icon: 'success',
        //       duration: 2000,
        //       success: () => {
        //         // 清空表单数据和图片
        //         this.setData({
        //           productName: '',
        //           productPrice: '',
        //           productDescription: '',
        //           imageUrl: ''
        //         });
        //       }
        //     });
        //   },
        //   fail: (res) => {
        //     // 提交失败的处理
        //     wx.showToast({
        //       title: '提交失败',
        //       icon: 'none',
        //       duration: 2000
        //     });
        //   }
        // });
      
   
 
  }
});