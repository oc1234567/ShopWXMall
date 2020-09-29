// pages/category/index.js
const constants = require('../../../config/constant/index');
const util = require('../../../utils/util.js');
const api = require('../../../config/api.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    categories: [],
    cur_sub_categories: [],
    cur_sub_category_index: 0,
    three_category_class_name: 'three-category',
    selected_name_color: 'red',
    normal_name_color: 'black',
    no_class_name: "",
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
   * 判断缓存是否存在分类数据
   */
  getCategoryData() {
    let categoryInfo = wx.getStorageSync(constants.StorageKey_Category_Info);
    try {
      categoryInfo = JSON.parse(categoryInfo); 
    } catch (error) {
      categoryInfo = null;
    }
    if (categoryInfo && Array.isArray(categoryInfo) && categoryInfo.length > 0) {
      //缓存已存在
      this.getCacheCategoryData();
    } else {
      //缓存不存在
      this.handleGetCategoryInfo(() => {
        this.getCacheCategoryData();
      });
    }
  },

  /**
   * 获取缓存分类数据
   */
  getCacheCategoryData() {
    try {
      let categoryInfo = wx.getStorageSync(constants.StorageKey_Category_Info);
      categoryInfo = JSON.parse(categoryInfo); 
      if (categoryInfo && Array.isArray(categoryInfo)) {
        let categories = [];
        categoryInfo.forEach(category => {
          if (!category.parent_id) {
            categories.push(category);
          } else {
            //首先遍历一级菜单
            this.iteraCategories(categories, category);
          }
        })
        this.setData({
          categories: categories,
          cur_sub_categories: categories[0].subCategories,
          cur_sub_category_index: 0,
        })
      }
    } catch (error) {
      console.log('获取分类表缓存数据失败！');
      
    }
  },

  //遍历多级菜单
  iteraCategories(categories, category) {
    const pcategory = categories.find(pcategory => pcategory.id === category.parent_id);
    if (pcategory) {
      if (!pcategory.subCategories) {
        pcategory.subCategories = [category];
      } else {
        pcategory.subCategories.push(category);
      }
    } else {
      categories.forEach(pcategory => {
        if (pcategory.subCategories) {
          this.iteraCategories(pcategory.subCategories, category);
        }
      })
    }
  },

  /**
   * 接口拉取分类表，缓存分类表
   */
  handleGetCategoryInfo(successCallback) {
    util.request(`${api.CategoryInfo}`).then(res => {
      console.log('获取分类表成功！');
      if (!res || !res.data) {
        return;
      }
      if (Array.isArray(res.data)) {
        console.log('缓存分类表成功！');
        wx.setStorageSync(constants.StorageKey_Category_Info, JSON.stringify(res.data));
        successCallback();
      }
    })
  },

  /**
   * 切换分类，获取子分类数据
   */
  handleChangeCategoryIndex(e) {
    const index = e.currentTarget.dataset.index;
    this.setData({
      cur_sub_categories: this.data.categories[index].subCategories,
      cur_sub_category_index: index
    })
  },

  /**
   * 导航至分类产品列表页
   */
  handleToProductsList(e) {
    const id = e.currentTarget.dataset.id;
    //二级菜单-将三级菜单的ids传递至下一页
    if (this.data.cur_sub_categories.findIndex(category => category.id === id) === -1) {
      wx.navigateTo({
        url: `/pages/category/categoryList/index?id=${id}`,
      })
    } else {
      const twoCategory = this.data.cur_sub_categories.find(category => category.id === id);
      if (twoCategory.subCategories) {
        const ids = twoCategory.subCategories.map(sub_category => sub_category.id);
        wx.navigateTo({
          url: `/pages/category/categoryList/index?ids=${JSON.stringify(ids)}`,
        })
      } else {
        wx.navigateTo({
          url: `/pages/category/categoryList/index?id=${id}`,
        })
      }
    }
    
  }

  
})