// pages/tab1/tab1.js

Page({
  data: {
    searchKeyword: '', // 搜索关键字
    searchResult: [], // 搜索结果
    title:"商品搜索"
  },

  // 监听搜索框输入
  handleSearchInput(e) {
    console.log("-----"+e.detail.value)
    this.setData({
      searchKeyword: e.detail.value,
      // searchResult:[{"name":"sss","imageUrl":"http://154.83.15.174/uploads/qrcode_for_gh_24c95d9d8faa_344.jpg","remarks":"ssss","num":"33"}]
    });
  },
// 预览图片
handlePreviewImage(event) {
  const imageUrl = event.currentTarget.dataset.imageUrl;
  wx.previewImage({
    urls: [imageUrl],
  });
},
  // 执行搜索
  handleSearch() {
    const keyword = this.data.searchKeyword;

     wx.request({
      url: 'http://154.83.15.174:8082/api/goods/list',
      method: 'GET',
      data: {
        name:keyword,
       },
      success: (res) => {
            this.setData({
              searchResult : res.data
            })
      },
        
        
        
   
    })
    // 在这里执行商品搜索的逻辑，可以调用接口或者使用本地数据进行搜索

    // 假设这里是一个模拟的搜索请求，返回搜索结果
    // const mockSearchResult = [
    //   { id: 1, name: '商品1', image: 'http://154.83.15.174/uploads/qrcode_for_gh_24c95d9d8faa_344.jpg', quantity: 10 },
    //   { id: 2, name: '商品2', image: 'http://154.83.15.174/uploads/qrcode_for_gh_24c95d9d8faa_344.jpg', quantity: 5 },
    //   { id: 3, name: '商品3', image: 'http://154.83.15.174/uploads/qrcode_for_gh_24c95d9d8faa_344.jpg', quantity: 3 },
    // ];

    // this.setData({
    //   searchResult: mockSearchResult,
    // });
  },













});