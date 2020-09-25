// pages/category/index.js
const constants = require('../../../config/constant/index');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    categories: [],
    cur_sub_categories: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getCategoryData();
    
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

  /**
   * 获取分类数据
   */
  getCategoryData() {
    //缓存--获取分类数据
    try {
      let categoryInfo = wx.getStorageSync(constants.StorageKey_Category_Info);
      categoryInfo = JSON.parse(categoryInfo); 
      if (categoryInfo && Array.isArray(categoryInfo)) {
        let categories = [];
        categoryInfo.forEach(category => {
          if (!category.parent_id) {
            categories.push(category);
          }
        })
        this.setData({
          categories: categories,
          cur_sub_categories: categories[0].subCategories
        })
      }
    } catch (error) {
      
    }
  },

  /**
   * 切换分类，获取子分类数据
   */
  handleChangeCategoryIndex(e) {
    const index = e.currentTarget.dataset.index;
    this.setData({
      cur_sub_categories: this.data.categories[index].sub_categories
    })
  },

  /**
   * 导航至分类产品列表页
   */
  handleToProductsList(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/category/categoryList/index?id=${id}`,
    })
  }

  
})