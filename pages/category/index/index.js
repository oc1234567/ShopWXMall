// pages/category/index.js
const constants = require('../../../config/constant/index');

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
    //--- 测试数据 --- 
    // const categories = [{
    //   'id': 1,
    //   'name': '分类1',
    //   'parent_id': null,
    //   'pic': null,
    //   'subCategories': [{
    //     'id': 2,
    //     'name': '子子分类1',
    //     'parent_id': 4,
    //     'pic': 'https://dimg05.c-ctrip.com/images/100b11000000qcd4zEAD7_C_250_250.jpg',
    //   },
    //   {
    //     'id': 5,
    //     'name': '子子分类2',
    //     'parent_id': 4,
    //     'pic': 'https://dimg05.c-ctrip.com/images/100b11000000qcd4zEAD7_C_250_250.jpg',
    //   },
    //   {
    //     'id': 6,
    //     'name': '子子分类3',
    //     'parent_id': 4,
    //     'pic': 'https://dimg05.c-ctrip.com/images/100b11000000qcd4zEAD7_C_250_250.jpg',
    //   },
    //   {
    //     'id': 7,
    //     'name': '子子分类4',
    //     'parent_id': 4,
    //     'pic': 'https://dimg05.c-ctrip.com/images/100b11000000qcd4zEAD7_C_250_250.jpg',
    //   },
    //   {
    //     'id': 8,
    //     'name': '子子分类5',
    //     'parent_id': 4,
    //     'pic': 'https://dimg05.c-ctrip.com/images/100b11000000qcd4zEAD7_C_250_250.jpg',
    //   },
    //   {
    //     'id': 9,
    //     'name': '子子分类6',
    //     'parent_id': 4,
    //     'pic': 'https://dimg05.c-ctrip.com/images/100b11000000qcd4zEAD7_C_250_250.jpg',
    //   },
    //   {
    //     'id': 10,
    //     'name': '子子分类7',
    //     'parent_id': 4,
    //     'pic': 'https://dimg05.c-ctrip.com/images/100b11000000qcd4zEAD7_C_250_250.jpg',
    //   }]
    // }, {
    //   'id': 1,
    //   'name': '分类1',
    //   'parent_id': null,
    //   'pic': null,
    //   'subCategories': [{
    //     'id': 2,
    //     'name': '子子分类1',
    //     'parent_id': 4,
    //     'pic': 'https://dimg05.c-ctrip.com/images/100b11000000qcd4zEAD7_C_250_250.jpg',
    //   },
    //   {
    //     'id': 5,
    //     'name': '子子分类2',
    //     'parent_id': 4,
    //     'pic': 'https://dimg05.c-ctrip.com/images/100b11000000qcd4zEAD7_C_250_250.jpg',
    //   },
    //   {
    //     'id': 6,
    //     'name': '子子分类3',
    //     'parent_id': 4,
    //     'pic': 'https://dimg05.c-ctrip.com/images/100b11000000qcd4zEAD7_C_250_250.jpg',
    //   },
    //   {
    //     'id': 7,
    //     'name': '子子分类4',
    //     'parent_id': 4,
    //     'pic': 'https://dimg05.c-ctrip.com/images/100b11000000qcd4zEAD7_C_250_250.jpg',
    //   },
    //   {
    //     'id': 8,
    //     'name': '子子分类5',
    //     'parent_id': 4,
    //     'pic': 'https://dimg05.c-ctrip.com/images/100b11000000qcd4zEAD7_C_250_250.jpg',
    //   },
    //   {
    //     'id': 9,
    //     'name': '子子分类6',
    //     'parent_id': 4,
    //     'pic': 'https://dimg05.c-ctrip.com/images/100b11000000qcd4zEAD7_C_250_250.jpg',
    //   },
    //   {
    //     'id': 10,
    //     'name': '子子分类7',
    //     'parent_id': 4,
    //     'pic': 'https://dimg05.c-ctrip.com/images/100b11000000qcd4zEAD7_C_250_250.jpg',
    //   }]
    // }];
    // const categories = [{
    //   'id': 1,
    //   'name': '分类1',
    //   'parent_id': null,
    //   'pic': null,
    //   'subCategories': [
    //     {
    //       'id': 4,
    //       'name': '子分类1',
    //       'parent_id': 1,
    //       'pic': null,
    //       'subCategories': [
    //         {
    //           'id': 2,
    //           'name': '子子分类1',
    //           'parent_id': 4,
    //           'pic': 'pic',
    //           'subCategories': []
    //         },
    //         {
    //           'id': 5,
    //           'name': '子子分类2',
    //           'parent_id': 4,
    //           'pic': 'pic',
    //           'subCategories': []
    //         },
    //         {
    //           'id': 6,
    //           'name': '子子分类3',
    //           'parent_id': 4,
    //           'pic': 'pic',
    //           'subCategories': []
    //         },
    //         {
    //           'id': 7,
    //           'name': '子子分类4',
    //           'parent_id': 4,
    //           'pic': 'pic',
    //           'subCategories': []
    //         },
    //         {
    //           'id': 8,
    //           'name': '子子分类5',
    //           'parent_id': 4,
    //           'pic': 'pic',
    //           'subCategories': []
    //         },
    //         {
    //           'id': 9,
    //           'name': '子子分类6',
    //           'parent_id': 4,
    //           'pic': 'pic',
    //           'subCategories': []
    //         },
    //         {
    //           'id': 10,
    //           'name': '子子分类7',
    //           'parent_id': 4,
    //           'pic': 'pic',
    //           'subCategories': []
    //         }
    //       ]
    //     },
    //     {
    //       'id': 3,
    //       'name': '子分类2',
    //       'parent_id': null,
    //       'pic': null,
    //       'subCategories': [
    //         {
    //           'id': 11,
    //           'name': '子子分类8',
    //           'parent_id': 3,
    //           'pic': 'pic',
    //           'subCategories': []
    //         },
    //         {
    //           'id': 12,
    //           'name': '子子分类9',
    //           'parent_id': 3,
    //           'pic': 'pic',
    //           'subCategories': []
    //         },
    //         {
    //           'id': 13,
    //           'name': '子子分类10',
    //           'parent_id': 3,
    //           'pic': 'pic',
    //           'subCategories': []
    //         },
    //         {
    //           'id': 14,
    //           'name': '子子分类11',
    //           'parent_id': 3,
    //           'pic': 'pic',
    //           'subCategories': []
    //         },
    //         {
    //           'id': 15,
    //           'name': '子子分类12',
    //           'parent_id': 3,
    //           'pic': 'pic',
    //           'subCategories': []
    //         },
    //         {
    //           'id': 16,
    //           'name': '子子分类13',
    //           'parent_id': 3,
    //           'pic': 'pic',
    //           'subCategories': []
    //         },
    //         {
    //           'id': 17,
    //           'name': '子子分类14',
    //           'parent_id': 3,
    //           'pic': 'pic',
    //           'subCategories': []
    //         }
    //       ]
    //     }
    //   ]
    // }];
    // this.setData({
    //   categories: categories,
    //   cur_sub_categories: categories[0].subCategories,
    //   cur_sub_category_index: 0,
    // })
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