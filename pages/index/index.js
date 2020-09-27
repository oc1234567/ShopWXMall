const util = require('../../utils/util.js');
const api = require('../../config/api.js');
const constants = require('../../config/constant/index');

//获取应用实例
const app = getApp();
let page = 1;
let hadLastPage = false;
const isPreCache = false;
Page({
  data: {
    newGoods: [],
    hotGoods: [],
    topics: [],
    brands: [],
    floorGoods: [],
    banner: [],
    channel: [],
    data: [],
    user: {}
  },
  onLoad: function (options) {
    //--活动数据获取--
    if (!isPreCache) {
      this.getIndexData();
    } else {
      try {
        let value = wx.getStorageSync(constants.StorageKey_Index_Data);
        if (value) {
          console.log(`${constants.StorageKey_Index_Data} 从缓存中取值成功`);
          try {
            let newData = JSON.parse(value);
            console.log(newData);
            this.setData({
              data: newData
            });
          } catch (error) {
            console.log(`解析本地缓存 key=${constants.StorageKey_Index_Data} 数据失败！`);
          }
        } else {
          this.getIndexData();
        }
      } catch (error) {
        console.log(error);
      }
    }
    
    //--商品数据获取--
    if (!isPreCache) {
      this.getAllProducts();
    } else {
      // 优先缓存中获取
      try {
        let value = wx.getStorageSync(constants.StorageKey_Index_Products);
        if (value) {
          console.log(`${constants.StorageKey_Index_Products} 从缓存取值成功`);
          //读取缓存中的 '是否到底'
          let is_hadLastPage = wx.getStorageSync(constants.StorageKey_Index_HadLastPage); 
          if (is_hadLastPage) {
            hadLastPage = is_hadLastPage;
          }
          try {
            let newData = JSON.parse(value);
            console.log(newData);
            this.setData({
              newGoods: newData
            });
          } catch (error) {
            console.log(`解析本地缓存 key=${constants.StorageKey_Index_Products} 数据失败！`);
          }
        } else {
          this.getAllProducts();
        }
      } catch (error) {
        console.log(error);
      }
    }
  },
   /**
   * 加载更多
   */
  onReachBottom: function () {
    console.log('ending~');
    console.log(hadLastPage);
    if (hadLastPage != false) {
      wx.showToast({title: '到底了'});
      return;
    }
    page++;
    this.getAllProducts(page);
  },
  /**
   * 下拉刷新
   */
  onPullDownRefresh: function () {
    page = 1;
    hadLastPage = false;
    this.setData({
      newGoods: []
    });
    this.getIndexData();
    this.getAllProducts();
    wx.stopPullDownRefresh();
  },
  getIndexData: function () {
    let that = this;
    util.request(api.IndexUrl).then(function (res) {
      if (Array.isArray(res.data)) {
        that.setData({
          data: res.data
        });
        that.getIndexDataInfo(res.data);
        wx.setStorageSync(constants.StorageKey_Index_Data, JSON.stringify(res.data));
      }
    }).catch((res) => {
      console.log(res);
    });
  },
  getAllProducts: function (page = 1) {
    let that = this;
    util.request(api.IndexUrlAllGoods, {'page': page, 'expand': 'picUrl'}).then(function (res) {
      if (res.header['X-Pagination-Page-Count'] == res.header['X-Pagination-Current-Page']) {
        hadLastPage = true;
        //在首页加载时，缓存是否到底的数据
        if (page == 1) {
          wx.setStorageSync(constants.StorageKey_Index_HadLastPage, true);
        }
      }
      let list = that.data.newGoods;
      if (Array.isArray(res.data)) {
        for (let index = 0; index < res.data.length; index++) {
          const element = res.data[index];
          list.push(element);
        }
        that.setData({
          newGoods: list
        });        
        wx.setStorageSync(constants.StorageKey_Index_Products, JSON.stringify(list));
      }
    }).catch((res) => {
      console.log(res);
    });
  },
  //活动数据详细信息获取
  getIndexDataInfo() {
    let that = this;
    let data = that.data.data;
    util.request(api.IndexPosUrl).then((res) => {
      if (Array.isArray(res.data)) {
        for (let index = 0; index < res.data.length; index++) {
          const pos = res.data[index];
          const id = pos.index_id || 0;
          let item = data.find((item) => item.id === id);
          item.pos_column = pos.column || 1/1;
          item.pos_row = pos.row || 1/1;
          //要求 pos_column、pos_row 格式为 1/1, 2/1-2
          const total_column = item.pos_column.slice(0,1);
          item.width = 750/total_column;
          item.height = 180;//默认一行高400rpx
          const total_row = item.pos_row.slice(2);
          let total_row_count = 1;
          if (total_row.length == 3) {
            total_row_count = total_row.slice(2)-total_row.slice(1) + 1;
          }
          item.height = item.height * total_row_count;
          item.pos_x = item.width * (item.pos_column.slice(2)-1);
          item.pos_y = item.height * (item.pos_row.slice(2)-1);
          //跳转链接拼接
          item.nav_url = item.type === 1 ? `/pages/activeDetail/index?id=${item.type_id}` : (item.type === 2 ? `/pages/goodDetail/index?id=${item.type_id}` : ''); 
        }
        that.setData({
          data: data
        });
        //同步更新缓存
        wx.setStorageSync(constants.StorageKey_Index_Data, JSON.stringify(data));
      }
    })
  },

  /**
   * 获取分类表，缓存分类表
   */
  handleGetCategoryInfo() {
    util.request(`${api.CategoryInfo}`).then(res => {
      console.log('获取分类表成功！');
      if (!res || !res.data) {
        return;
      }
      if (Array.isArray(res.data)) {
        console.log('缓存分类表成功！');
        wx.setStorageSync(constants.StorageKey_Category_Info, JSON.stringify(res.data));
      }
    })
  },

  /**
   * 导航至地址列表
   */
  handleToAddressList(e) {
    wx.navigateTo({
      url: '/pages/address/addressList/index',
    })
  },

  /**
   * 导航至订单列表
   */
  handleToOrderList() {
    wx.navigateTo({
      url: '/pages/myCenter/orderList/index',
    })
  }

})
