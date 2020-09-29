// pages/cart/index.js
const constant = require('../../config/constant/index');
const cartUtil = require('../../utils/cartUtil');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    cart_goods: [],
    selected_state: [],
    is_all_selected: false,
    all_payment_money: 0.00,
    product_num_reduce_disable_class_name: 'product_num_reduce_disable',
    product_num_reduce_enable_class_name: 'product_num_reduce_enable'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // this.getCartProductsData();
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
    this.getCartProductsData();
  },

  /**
   * 获取购物车数据，更新本地缓存，更新data数据
   */
  getCartProductsData() {
    this.getCartProductsInfo(() => {
      this.getCacheCartProducts();
    })
  },

  /**
   * 缓存获取购物车数据
   */
  getCacheCartProducts() {
    //获取购物车商品 购物车商品应将最近加入的放置在最前面
    let cart_products;
    try {
      cart_products = JSON.parse(wx.getStorageSync(constant.StorageKey_Cart_Data));
      if (!cart_products) {
        cart_products = [];
      }
    } catch (error) {
      cart_products = [];
    }
    
    //更新选中状态
    if (this.data.cart_goods.length <= cart_products.length) {
      cart_products.forEach((cart_product) => {
        const index = this.data.cart_goods.findIndex(oldCartProduct => oldCartProduct.product_id === cart_product.product_id && oldCartProduct.size_id === cart_product.size_id && oldCartProduct.color_id === cart_product.color_id && oldCartProduct.product_num === cart_product.product_num);
        if (index === -1) {
          //同种商品存在，数量发生变化
          const oldCartProduct_index = this.data.cart_goods.findIndex(oldCartProduct => oldCartProduct.product_id === cart_product.product_id && oldCartProduct.size_id === cart_product.size_id && oldCartProduct.color_id === cart_product.color_id);
          if (oldCartProduct_index !== -1) {
            this.data.cart_goods[oldCartProduct_index].product_num = cart_product.product_num;
            this.data.selected_state[oldCartProduct_index] = true;
          } else {
            this.data.selected_state.splice(0, 0, true);
          }
        }
      })
    } else {
      this.data.cart_goods.forEach((oldCartProduct, index) => {
        const cart_product_index = cart_products.findIndex(cart_product => cart_product.id === oldCartProduct.id);
        if (cart_product_index === -1) {
          this.data.selected_state.splice(index, 1);
        }
      })
    }
    this.data.cart_goods = cart_products;
    //更新购物车
    this.setData({
      cart_goods: this.data.cart_goods,
      selected_state: this.data.selected_state,
      is_all_selected: this.updateIsAllSelected(this.data.selected_state),
      all_payment_money: this.updatePaymentInfo(this.data.selected_state)
    })
  },

   /**
    * 接口拉取购物车数据，缓存购物车数据
    */
   getCartProductsInfo(successCallback) {
    cartUtil.getCartProducts(data => {
      if (!data) {
        return;
      }
      if (Array.isArray(data)) {
        //更新购物车数据缓存
        wx.setStorageSync(constant.StorageKey_Cart_Data, JSON.stringify(data));
        successCallback();
      }
    })
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
   * 切换选中/不选中商品
   */
  handleSelectProduct(e) {
    const index = e.currentTarget.dataset.index;
    const is_selected = this.data.selected_state[index];
    if (is_selected) {
      this.data.selected_state[index] = false;
    } else {
      this.data.selected_state[index] = true;
    }
    this.setData({
      selected_state: this.data.selected_state,
      is_all_selected: this.updateIsAllSelected(this.data.selected_state),
      all_payment_money: this.updatePaymentInfo(this.data.selected_state)
    })
  },

  /**
   * 删除选中的商品
   */
  handleDelectSelectedProduct() {
    //未选中产品，提示
    if (this.data.selected_state.findIndex(value => value) === -1) {
      console.log('您还没有选择商品哦~');
      return;
    }
    //提示用户是否确定要删除
    console.log('确定要删除吗？删除后无法恢复');
    //点击取消则无操作
    //点击确定，则从购物车中删除已选中商品
    let selectedIndex = [];
    this.data.selected_state.forEach((selected, index) => {
      if (!selected) {
        return;
      }
      selectedIndex.push(index);
    })
    selectedIndex.forEach(index => {
      this.data.cart_goods.splice(index, 1);
      this.data.selected_state.splice(index, 1);
    })
    this.setData({
      cart_goods: this.data.cart_goods,
      selected_state: this.data.selected_state,
    })
  },

  /**
   * 获取结算信息
   */
  updatePaymentInfo(seleteStates) {
    let allPaymentMoney = 0;
    for (let index = 0; index < seleteStates.length; index++) {
      const selected = seleteStates[index];
      if (!selected) {
        continue;
      }
      const product = this.data.cart_goods[index];
      const {product_num, product_price} = product;
      allPaymentMoney += product_num * product_price;
    }
    return allPaymentMoney;
  },

  /**
   * 获取是否全选
   */
  updateIsAllSelected(seleteStates) {
    return seleteStates.findIndex(value => !value) === -1;
  },

  /**
   * 更新商品结算信息操作比较频繁，因此额外提供'获取选中商品'的方法
   */
  getSelectedProduct() {
    let products = [];
    for (let index = 0; index < this.data.selected_state.length; index++) {
      const selected = this.data.selected_state[index];
      if (!selected) {
        continue;
      }
      const product = this.data.cart_goods[index];
      products.push(product);
    }
    return products;
  },

  /**
   * 　切换是否全选
   */
  handleToggleAllSelected() {
    if (this.data.is_all_selected) {
      this.data.selected_state.forEach((selected, index) => {
        this.data.selected_state[index] = false;
      })
    } else {
      this.data.selected_state.forEach((selected, index) => {
        this.data.selected_state[index] = true;
      })
    }
    this.setData({
      selected_state: this.data.selected_state,
      is_all_selected: this.updateIsAllSelected(this.data.selected_state),
      all_payment_money: this.updatePaymentInfo(this.data.selected_state)
    })
  },

  /**
   * 减少商品数量
   */
  handleReduceNum(e) {
    const index = e.currentTarget.dataset.index;
    const product = this.data.cart_goods[index];
    const { product_num } = product;
    if (product_num === 1) {
      return;
    }
    product.product_num = product_num - 1;
      const is_selected = this.data.selected_state[index];
      if (!is_selected) {
        this.data.selected_state[index] = true;
      }
      this.setData({
        cart_goods: this.data.cart_goods,
        selected_state: this.data.selected_state,
        is_all_selected: this.updateIsAllSelected(this.data.selected_state),
        all_payment_money: this.updatePaymentInfo(this.data.selected_state)
      })
  },

   /**
    * 增加商品数量
    */
   handleAddNum(e) {
    const index = e.currentTarget.dataset.index;
     const product = this.data.cart_goods[index];
     const { product_num, product_count } = product;
     //超出库存，提示已达最大库存
     if (product_num === product_count) {
       return;
     }
     product.product_num = product_num + 1;
     const is_selected = this.data.selected_state[index];
      if (!is_selected) {
        this.data.selected_state[index] = true;
      }
      this.setData({
        cart_goods: this.data.cart_goods,
        selected_state: this.data.selected_state,
        is_all_selected: this.updateIsAllSelected(this.data.selected_state),
        all_payment_money: this.updatePaymentInfo(this.data.selected_state)
      })
   },

   /**
    * 去结算
    */
   handleToBuy() {
    const products = this.getSelectedProduct();
    const url = `/pages/checkout/index?products=${JSON.stringify(products)}&payment=${this.data.all_payment_money}`;
    console.log(`跳转至下单页面url：${url}`);
    wx.navigateTo({
      url: url,
    })
  }

})