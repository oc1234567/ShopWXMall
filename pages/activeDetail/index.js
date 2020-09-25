// pages/activeDetail/index.js
const util = require('../../utils/util');
const api = require('../../config/api');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    is_ready: false,
    active_id: 0,
    active_name: '',
    active_products: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options.id);
    const active_id = options.id;
    //--- 获取营销商品 ---
    const that = this;
    util.request(`${api.MarketGoods}?id=${active_id}`, {"expand": "marketProducts"}).then(res => {
      if (!res || !res.data) {
        return;
      }
      const active = res.data;
      const active_id = active.id;
      const active_name = active.name;
      const active_products = active.marketProducts;
      
      if (active_products && Array.isArray(active_products)) {
        let count = active_products.length;
        active_products.forEach(market_product => {
          const product_id = market_product.product_id;
          util.request(`${api.GoodDetail}?id=${product_id}`, {"expand": "picUrl"}).then(res => {
            if (!res || !res.data) {
              return;
            }
            const product = {
              "id": res.data.id,
              "name": res.data.name,
              "image": res.data.picUrl,
              "price": res.data.price,
            }
            that.data.active_products.push(product);
            count --;
            if (count == 0) {
              that.setData({
                is_ready: true,
                active_id: active_id,
                active_name: active_name,
                active_products: that.data.active_products
              })
            }
          })
        })
      }
    })
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

  }
})