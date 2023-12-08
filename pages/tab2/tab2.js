// pages/tab2/tab2.js

Page({
  data: {
    productName: '',
    productPrice: '',
    productDescription: '',
    imageUrl: '',
    title:'添加商品',
    detail:''
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
    wx.chooseImage({
      count: 1,
      success: (res) => {
        const tempFilePaths = res.tempFilePaths;
        this.setData({
          imageUrl: tempFilePaths[0]
        });
      }
    });
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
    const { productName, productPrice, productDescription, imageUrl } = this.data;
    console.log("test-----"+JSON.stringify(this.data))
    // 先上传图片
    wx.uploadFile({
      url: 'http://154.83.15.174:8082/api/goodsImage/upload',
      filePath: imageUrl,
      name: 'file',
      success: (res) => {
        console.log(res.data)
        const imageUrl = JSON.parse(res.data).imageUrl; // 从响应中获取上传后的图片 URL

        // 发送商品信息和图片 URL 到后端接口
        wx.request({
          url: 'http://154.83.15.174:8082/api/goods/add',
          method: 'POST',
          data: {
            name:productName,
            num:parseInt(productPrice),
            remarks:productDescription,
            imageUrl:imageUrl
          },
          success: (res) => {
            // 提交成功后，可以进行相应的提示或页面跳转等操作
            wx.showToast({
              title: '提交成功',
              icon: 'success',
              duration: 2000,
              success: () => {
                // 清空表单数据和图片
                this.setData({
                  productName: '',
                  productPrice: '',
                  productDescription: '',
                  imageUrl: ''
                });
              }
            });
          },
          fail: (res) => {
            // 提交失败的处理
            wx.showToast({
              title: '提交失败',
              icon: 'none',
              duration: 2000
            });
          }
        });
      },
      fail: (res) => {
        console.log(res.errMsg)
        // 图片上传失败的处理
        wx.showToast({
          title: '图片上传失败',
          icon: 'none',
          duration: 2000
        });
      }
    });
  }
});