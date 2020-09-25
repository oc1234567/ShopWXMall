// pages/category/categoryList/index.js
const util = require('../../../utils/util');
const api = require('../../../config/api');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    is_ready: false,
    category_id: 0,
    category_name: '',
    category_products: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //--- 获取 分类id ---
    const category_id = options.id;
    //--- 获取 分类id 下的产品 ---
    const that = this;
    util.request(`${api.CategoryGoods}?id=${category_id}`, {"expand": "categoryProducts"}).then(res => {
      if (!res || !res.data) {
        return;
      }
      const category = res.data;
      const category_id = category.id;
      const category_name = category.name;
      const category_products = category.categoryProducts;

      if (category_products && Array.isArray(category_products)) {
        let count = category_products.length;
        category_products.forEach(category_product => {
          const product_id = category_product.product_id;
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
            that.data.category_products.push(product);
            count --;
            if (count == 0) {
              that.setData({
                is_ready: true,
                category_id: category_id,
                category_name: category_name,
                category_products: that.data.category_products
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