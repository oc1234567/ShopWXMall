// pages/cart/index.js
const constant = require('../../config/constant/index');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    cart_goods: [],
    selected_state: [],
    is_all_selected: false,
    all_payment_money: 0.00
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //获取购物车商品
    let products;
    try {
      products = JSON.parse(wx.getStorageSync(constant.StorageKey_Cart_Data));
      if (!products) {
        products = [];
      }
    } catch (error) {
      products = [];
    }
    this.setData({
      cart_goods:products
    })
    //默认商品全部选中
    const selectStates = products.map(product => true);
    this.setData({
      selected_state: selectStates,
      is_all_selected: true,
      all_payment_money: this.updatePaymentInfo(selectStates)
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
    //获取购物车商品
    let products;
    try {
      products = JSON.parse(wx.getStorageSync(constant.StorageKey_Cart_Data));
      if (!products) {
        products = [];
      }
    } catch (error) {
      products = [];
    }
    //判断是否有新加入商品
    if (this.data.cart_goods.length <= products.length) {
      products.forEach((product) => {
        const index = this.data.cart_goods.findIndex(oldProduct => oldProduct.id === product.id && oldProduct.size_id === product.size_id && oldProduct.color_id === product.color_id && oldProduct.num === product.num);
        if (index === -1) {
          //同种商品存在，数量发生变化
          const oldProduct = this.data.cart_goods.find(oldProduct => oldProduct.id === product.id && oldProduct.size_id === product.size_id && oldProduct.color_id === product.color_id);
          if (oldProduct) {
            oldProduct.num = product.num;
          } else {
            this.data.cart_goods.push(product);
            this.data.selected_state.push(true);
          }
        }
      })
      this.setData({
        cart_goods: this.data.cart_goods,
        selected_state: this.data.selected_state,
        is_all_selected: this.updateIsAllSelected(this.data.selected_state),
        all_payment_money: this.updatePaymentInfo(this.data.selected_state)
      })
    }
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
      const {num, price} = product;
      allPaymentMoney += num * price;
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
   * 减少商品数量
   */
  handleReduceNum(e) {
    const index = e.currentTarget.dataset.index;
    const product = this.data.cart_goods[index];
    const { num } = product;
    if (num > 1){
      product.num = num - 1;
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
    }
  },

   /**
    * 增加商品数量
    */
   handleAddNum(e) {
    const index = e.currentTarget.dataset.index;
     const product = this.data.cart_goods[index];
     const { num } = product;
     //超出库存，提示已达最大库存 todo
     const maxNum = 10; //10 需要被替换为真实库存数据 todo
     if (num === maxNum) {
       return;
     }
     product.num = num + 1;
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