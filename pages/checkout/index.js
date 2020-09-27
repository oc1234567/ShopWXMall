// pages/checkout/index.js
const util = require('../../utils/util');
const cartUtil = require('../../utils/cartUtil');
const constant = require('../../config/constant/index');
const api = require('../../config/api');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    user_id: 0,
    is_ready: false,
    user_addresses: [],
    addr_selected: {},
    products: [],
    products_num: 0,
    payment: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //--路由参数获取--
    if (options && options.products) {
      try {
        const products = JSON.parse(options.products);
        if (products && Array.isArray(products)) {
          let all_num = 0;
          products.forEach(product => {
            const { num } = product;
            all_num += num;
          })
          let payment = 0;
          if (options.payment) {
            payment = options.payment;
          }
          this.setData({
            products: products,
            products_num: all_num,
            payment: payment
          })
        }
      } catch (error) {
        this.setData({
          products: []
        })
      }
    }

    //--用户登录信息获取--
    this.getAddrs();
  },

  getAddrs() {
    const that = this;
    util.getUserInfo().then(res => {
      if (!res || !res.id) {
        return;
      }
      //地址存在，展示地址
      let defaultAddr = {};
      if (Array.isArray(res.customerAddrs)) {
        if (res.customerAddrs.length > 0) {
          defaultAddr = res.customerAddrs.find((res) => res.is_default === 1);
          if (!defaultAddr) {
            defaultAddr = res.customerAddrs[0];
          }
          //将用户地址缓存
          wx.setStorage({
            data: JSON.stringify(res.customerAddrs),
            key: `${constant.StorageKey_Customer_Addrs}_uid_${res.id}`,
          })
        }
      }
      
      that.setData({
        user_id: res.id,
        is_ready: true,
        user_addresses: res.customerAddrs,
        addr_selected: defaultAddr,
      })

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
   * 导航-添加新地址页面
   */
  handleToAddAddress() {
    wx.navigateTo({
      url: `/pages/address/addressForm/index?user_id=${this.data.user_id}`,
      events: {
        updateAddrs: this.getAddrs
      }
    })
  },

  /**
   * 导航-地址列表页面
   */
  handleToAddressList() {
    const that = this;
    wx.navigateTo({
      url: `/pages/address/addressList/index?user_id=${this.data.user_id}`,
      events: {
        updateSelectedAddr: function(address) {
          console.log('更换地址成功！');
          that.setData({
            addr_selected: address
          })
        }
      }
    })
  },

  /**
   * 提交订单(目前未实现微信支付功能：立即支付)
   */
  handleSubmitOrder(e) {
    //--- 判断地址未取值成功，需要等待地址取值成功 ---
    if (!this.data.is_ready) {
      return;
    }
    console.log('提交订单');
    const that = this;
    util.request(api.CreateOrder, {
      'customer_id': this.data.user_id,
      'address_id': this.data.addr_selected.id,
      'payment_money': this.data.payment,
    }, 'POST').then(res => {
      console.log('提交订单成功!');
      if (!res || !res.data) {
        return;
      }
      let count = that.data.products.length;
      that.data.products.forEach(product => {
        //订单购物清单提交
        util.request(api.CreateOrderDetail, {
          'order_id': res.data.id,
          'product_id': product.id,
          'product_price': product.price,
          'product_size': product.size_id,
          'product_type': product.color_id,
          'product_cnt': product.num,
        }, 'POST').then(res => {
          console.log('购物清单产品数据提交成功!');
          count --;
          if (count === 0) {
            //导航至订单列表页
            wx.navigateTo({
              url: '/pages/myCenter/orderList/index',
            })
            cartUtil.clearCartList();
            cartUtil.addCartProducts();
          }
        })
      }) 
    })
  }
})