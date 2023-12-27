var utils = require('../../utils/util.js');


Page({
  data: {
    longitude: 117.9, // 初始化经度
    latitude: 30, // 初始化纬度
    markers: [], // 初始化标记点数组
    id:0,
    domain:'',
    polyline:[]
  },
  buttonDriving(e){
    var _this = this
    //通过wx.request发起HTTPS接口请求
    wx.request({
      //地图WebserviceAPI驾车路线规划接口 请求路径及参数（具体使用方法请参考开发文档）
      url: 'https://apis.map.qq.com/ws/direction/v1/driving/?key=XX5BZ-A3NW5-NBOII-QC6M5-KKWP2-VFFTJ&from=39.894772,116.321668&to=39.902781,116.427171',
      success(res){
        console.log(JSON.stringify(res.data))
        // return
        var result = res.data.result
        var route = result.routes[0]
        
        var coors = route.polyline, pl = [];
          //坐标解压（返回的点串坐标，通过前向差分进行压缩）
          var kr = 1000000;
          for (var i = 2; i < coors.length; i++) {
            coors[i] = Number(coors[i - 2]) + Number(coors[i]) / kr;
          }
          //将解压后的坐标放入点串数组pl中
          for (var i = 0; i < coors.length; i += 2) {
            pl.push({ latitude: coors[i], longitude: coors[i + 1] })
          }
          _this.setData({
            // 将路线的起点设置为地图中心点
            latitude:pl[0].latitude,
            longitude:pl[0].longitude,
            // 绘制路线
            polyline: [{
              points: pl,
              color: '#58c16c',
              width: 6,
              borderColor: '#2f693c',
              borderWidth: 1
            }]
          })
      }
    })
  },
  driving(fromLon,fromLat,toLon,toLat){
    console.log("*************"+fromLon+fromLat+toLon+toLat+'https://apis.map.qq.com/ws/direction/v1/driving/?key=XX5BZ-A3NW5-NBOII-QC6M5-KKWP2-VFFTJ&from='+fromLat+','+fromLon+'&to='+toLat+','+toLon)
    var _this = this
    //通过wx.request发起HTTPS接口请求
    wx.request({
      //地图WebserviceAPI驾车路线规划接口 请求路径及参数（具体使用方法请参考开发文档）
      url: 'https://apis.map.qq.com/ws/direction/v1/driving/?key=XX5BZ-A3NW5-NBOII-QC6M5-KKWP2-VFFTJ&from='+fromLat+','+fromLon+'&to='+toLat+','+toLon,
      success(res){
        console.log(JSON.stringify(res.data))
        // return
        var result = res.data.result
        var route = result.routes[0]
        
        var coors = route.polyline, pl = [];
          //坐标解压（返回的点串坐标，通过前向差分进行压缩）
          var kr = 1000000;
          for (var i = 2; i < coors.length; i++) {
            coors[i] = Number(coors[i - 2]) + Number(coors[i]) / kr;
          }
          //将解压后的坐标放入点串数组pl中
          for (var i = 0; i < coors.length; i += 2) {
            pl.push({ latitude: coors[i], longitude: coors[i + 1] })
          }
          _this.setData({
            // 将路线的起点设置为地图中心点
            latitude:pl[0].latitude,
            longitude:pl[0].longitude,
            // 绘制路线
            polyline: [{
              points: pl,
              color: '#58c16c',
              width: 6,
              borderColor: '#2f693c',
              borderWidth: 1
            }]
          })
      }
    })
  },
  // 执行搜索
  handleDetail() {
    
   let openId = wx.getStorageSync('openId');
    const id = this.data.id
    console.log("**********"+id+openId)
    var data = {"id":id}
    utils.handleGet(this,"/api/card/detail",data,function(err, res,thisP) {
      if (err) {
        console.error("提交失败", err);
        // 处理错误情况
      } else {
        console.log("提交成功", res);
        // 处理成功响应
       var marker = {
            id: 1,
            longitude: thisP.data.longitude, // 标记点经度
            latitude: thisP.data.latitude, // 标记点纬度
            title: '标记点标题21',
            iconPath: '/assets/tab-bar/location.png',
            width: 30,
            height: 30
          };
          marker.latitude = res.data.detail.lat;
          marker.longitude = res.data.detail.lon;
          var markers = thisP.data.markers;
          markers.push(marker);
          thisP.setData({
            // longitude:res.data.detail.lon,
            // latitude:res.data.detail.lat,
            markers:markers
          })
          //待官方审核
          // wx.getLocation({
          //   type: 'gcj02', // 使用国测局坐标系
          //   success: (res2) => {
          //     const { longitude, latitude } = res2;
          //     thisP.driving(res.data.detail.lon,res.data.detail.lat,longitude,thisP.data.latitude);
  
          //     thisP.setData({
          //       longitude,
          //       latitude
          //     });
          //   }
          // });
          // this.driving(res.data.detail.lon,res.data.detail.lat,this.data.longitude,this.data.latitude);
           console.log("dd1dwwdap11-----"+res.data.detail.lat+res.data.detail.lon+JSON.stringify(thisP.data))
        
      }
    })

    //  wx.request({
    //         url: this.data.domain+'api/card/detail',

    //   method: 'GET',
    //   header: {
    //     'content-type': 'application/json',
    //     'openid': wx.getStorageSync('openid') // 将统一的token参数放在header中
    //   },
    //   data: {
    //     id,
    //    },
    //   success: (res) => {
       
    //     var marker = {
    //       id: 1,
    //       longitude: this.data.longitude, // 标记点经度
    //       latitude: this.data.latitude, // 标记点纬度
    //       title: '标记点标题21',
    //       iconPath: '/assets/tab-bar/location.png',
    //       width: 30,
    //       height: 30
    //     };
    //     marker.latitude = res.data.detail.lat;
    //     marker.longitude = res.data.detail.lon;
    //     var markers = this.data.markers;
    //     markers.push(marker);
    //     this.setData({
    //       // longitude:res.data.detail.lon,
    //       // latitude:res.data.detail.lat,
    //       markers:markers
    //     })
    //     wx.getLocation({
    //       type: 'gcj02', // 使用国测局坐标系
    //       success: (res2) => {
    //         const { longitude, latitude } = res2;
    //         this.driving(res.data.detail.lon,res.data.detail.lat,longitude,this.data.latitude);

    //         this.setData({
    //           longitude,
    //           latitude
    //         });
    //       }
    //     });
    //     // this.driving(res.data.detail.lon,res.data.detail.lat,this.data.longitude,this.data.latitude);
    //      console.log("dd1dwwdap11-----"+res.data.detail.lat+res.data.detail.lon+JSON.stringify(this.data))
    //   },
    //      })

  },

  goBack() {
    wx.navigateBack();
  },

  markerTap: function(event) {
    console.log("marker ***********");
    var marker = this.data.markers[0];

    console.log(JSON.stringify(marker))

    // 调用导航 API 进行导航
    wx.authorize({
      scope: 'scope.userLocation',
      success() {
        console.log("lo-succ")
        // 用户已授权获取位置信息
        // 在这里可以调用 wx.openLocation API 进行导航等操作
        wx.openLocation({
          latitude: marker.latitude,
          longitude: marker.longitude,
        
          scale: 18
        });
      },
      fail() {
        // 用户拒绝授权或未完全授权
        // 可以在这里给出提示或引导用户重新授权
      }
    });

  },
  onLoad(options) {
    const itemId = options.id;
    const appInstance = getApp();

    const apiUrl = appInstance.globalData.apiUrl;

    this.setData({
      id:itemId,
      domain:apiUrl

    })
    const id = this.data.id

  console.log("detail1----"+id);
  this.handleDetail();
    console.log("detail222----"+id);
    // this.handleDetail();
    // 获取位置信息待官方审核审核
    // wx.getLocation({
    //   type: 'gcj02', // 使用国测局坐标系
    //   success: (res) => {
    //     const { longitude, latitude } = res;
        // this.setData({
        //   longitude,
        //   latitude
        // });
      // }
    // });

    // 添加标记点
    var marker = {
      id: 1,
      longitude: this.data.longitude, // 标记点经度
      latitude: this.data.latitude, // 标记点纬度
      title: '标记点标题21',
      iconPath: '/assets/tab-bar/location.png',
      width: 30,
      height: 30
    };

 

  }
});