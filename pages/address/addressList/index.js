// pages/address/addressList/index.js
const constant = require('../../../config/constant/index');
const util = require('../../../utils/util');
const api = require('../../../config/api');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    user_id: 0,
    addresses: [],
    is_default: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {    
    if (options && options.user_id) {
      this.setData({
        user_id: options.user_id,
      })
      //缓存读取用户地址
      const cachedAddrs = wx.getStorageSync(`${constant.StorageKey_Customer_Addrs}_uid_${options.user_id}`);
      if (cachedAddrs) {
        console.log(`${constant.StorageKey_Customer_Addrs}_uid_${options.user_id} 从缓存中取值成功`);
        this.setData({
          addresses: JSON.parse(cachedAddrs)
        })
      } else {
        this.getAddrs();
      }
    } else {
      //获取用户id 和 地址
      const that = this;
      util.getUserInfo().then(res => {
        if (!res || !res.id) {
          return;
        }
        that.setData({
          user_id: res.id
        })
        //缓存读取用户地址
        const cachedAddrs = wx.getStorageSync(`${constant.StorageKey_Customer_Addrs}_uid_${res.id}`);
        if (cachedAddrs) {
          console.log(`${constant.StorageKey_Customer_Addrs}_uid_${res.id} 从缓存中取值成功`);
          that.setData({
            addresses: JSON.parse(cachedAddrs)
          })
        } else {
          that.getAddrs();
        }
      })
    }
  },

  getAddrs() {
    //--用户登录信息获取--
    const that = this;
    util.getUserInfo().then(res => {
      if (!res || !res.id) {
        return;
      }
      //地址存在，展示地址
      if (Array.isArray(res.customerAddrs)) {
        that.setData({
          addresses: res.customerAddrs
        })
        //将用户地址缓存
        wx.setStorage({
          data: JSON.stringify(res.customerAddrs),
          key: `${constant.StorageKey_Customer_Addrs}_uid_${res.id}`,
        })
      }
    });
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
   * 选中地址
   */
  handleChangeSelectedAddr(e) {
    const index = e.currentTarget.dataset.index;
    if (util.compareVersion(wx.getSystemInfoSync().SDKVersion, '2.7.3') >= 0) {
      const eventChannel = this.getOpenerEventChannel();
      eventChannel.emit('updateSelectedAddr', this.data.addresses[index]);
    }
    wx.navigateBack({
      delta: 1,
    })
  },

  /**
   * 编辑地址
   */
  handleEditAddr(e) {
    const index = e.currentTarget.dataset.index;
    const url = `/pages/address/addressForm/index?user_id=${this.data.user_id}&address=${JSON.stringify(this.data.addresses[index])}`;

    wx.navigateTo({
      url: url,
      events: {
        updateAddrs: this.getAddrs
      }
    })
  },
  
  /**
   * 删除地址
   */
  handleDeleteAddr(e) {
    const index = e.currentTarget.dataset.index;
    const that = this;
    util.request(`${api.DeleteAddress}?id=${this.data.addresses[index].id}`, undefined, 'DELETE').then(res => {
      console.log('删除地址成功！');
      that.getAddrs();
    })
  },

  /**
   * 新增地址
   */
  handleAddAddr() {
    wx.navigateTo({
      url: `/pages/address/addressForm/index?user_id=${this.data.user_id}`,
      events: {
        updateAddrs: this.getAddrs
      }
    })
  }
})