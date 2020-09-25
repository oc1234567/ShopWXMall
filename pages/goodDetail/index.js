// pages/goodDetail/index.js
const { request } = require("../../utils/util");
const api = require("../../config/api");
const constant = require("../../config/constant/index");

const isPreCache = false;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    good_id: 0,
    good_info: {},
    showModalStatus: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let {id} = options;
    //id 判断
    if (id > 0) {
      this.setData({good_id: id});
      this.loadData(id);
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  loadData(id) {
    if (!isPreCache) {
      this.getProductDetailData(id);
    } else {
      //优先从缓存中获取
    try {
      const key = `${constant.StorageKey_GoodDetail_Info}_${id}`;
      let data = wx.getStorageSync(key);
      if (data) {
        console.log(`${key} 从缓存中取值成功`);
        let newData = JSON.parse(data);        
        this.setData({
          good_info: newData
        })
      } else {
        this.getProductDetailData(id);
      }
    } catch (error) {
      console.log(`获取商品id=${id}数据失败!`);
    }
    }
  },

  getProductDetailData(id) {
    let that = this;        
    this.getProductDetailInfo(id).then((res) => {
      if (res.data) {
        that.setData({
          good_info: res.data
        })
        //更多请求
        that.getInfo(res.data);
        //进入缓存
        const key = `${constant.StorageKey_GoodDetail_Info}_${id}`;
        wx.setStorageSync(key, JSON.stringify(res.data));
      }
    });
  },
  
  //获取详情数据
  getProductDetailInfo(id) {
    return request(`${api.GoodDetail}?id=${id}`, {'expand': 'picUrls, sizes, colors, picUrl'});
  },

  getInfo(good) {
    let {sizes, colors, id} = good;
    let that = this;
    this.getColors(colors).then(res => {
      good.colorNames = res;
      that.setData({
        good_info: good
      })
      //进入缓存
      const key = `${constant.StorageKey_GoodDetail_Info}_${id}`;
      wx.setStorageSync(key, JSON.stringify(good));
    });
    this.getSizes(sizes).then(res => {
      good.sizeNames = res;
      that.setData({
        good_info: good
      })
      //进入缓存
      const key = `${constant.StorageKey_GoodDetail_Info}_${id}`;
      wx.setStorageSync(key, JSON.stringify(good));
    });
  },

  getColors(colors) {
    let that = this;
    return new Promise((resolve) => {
      let color_names = [];
      let i = 0;
      colors.forEach(({color_id}) => {
        that.getColorName(color_id).then((res) => {
          i++ ;
          if (res.data) {
            res.data.name && color_names.push({id: color_id, name: res.data.name});
          }
          (i === colors.length) && resolve(color_names);
        })
      });
    })
  },

  getSizes(sizes) {
    let that = this;
    return new Promise((resolve) => {
      let size_names = [];
      let i = 0;
      sizes.forEach(({size_id}) => {
        that.getSizeName(size_id).then((res) => {
          i++ ;
          if (res.data) {
            res.data.name && size_names.push({id: size_id, name: res.data.name});
          }          
          (i === sizes.length) && resolve(size_names);
        })
      });
    })
  },

  getColorName(id) {
    return request(`${api.GoodColor}?id=${id}`);
  },

  getSizeName(id) {
    return request(`${api.GoodSize}?id=${id}`);
  },

  //--------------  触发事件 -------------
  handleOpenModal() {
    let animation = wx.createAnimation({
      delay: 0,
      duration: 200,
      timingFunction: "ease"
    })
    this.animation = animation;
    animation.translateY(300).step();
    this.setData({
      animationData: animation.export(),
      showModalStatus: true
    })
    setTimeout(() => {
      animation.translateY(0).step();
      this.setData({
        animationData: animation.export()
      })
    }, 200);
  },

  handleHideModal() {
    let animation = wx.createAnimation({
      delay: 0,
      duration: 200,
      timingFunction: "ease"
    })
    this.animation = animation;
    animation.translateY(300).step();
    this.setData({
      animationData: animation.export()
    })
    setTimeout(() => {
      animation.translateY(0).step();
      this.setData({
        animationData: animation.export(),
        showModalStatus: false
      })
    }, 200);
  },

  handleAddCart() {

  },

  handleToBuy(e) {
    //跳转至下单页面
    console.log(`跳转至下单页面Url：${e.detail}`);
    const url = e.detail;
    this.handleHideModal();
    wx.navigateTo({
      url: url,
    })

  }



  
})