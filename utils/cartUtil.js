const util = require('./util.js');
const api = require('../config/api.js');
const constants = require('../config/constant/index');

  /**
   * 提交数据到购物车
   */
  export function addCartProducts() {
    //获取购物车商品
    let products;
    try {
      products = JSON.parse(wx.getStorageSync(constants.StorageKey_Cart_Data));
      if (!products) {
        products = [];
      }
    } catch (error) {
      products = [];
    }
    if (Array.isArray(products)) {
      products.forEach(product => {
        const cart_product = {
          'customer_id': 1,
          'product_id': product.id,
          'product_num': product.num,
          'price': product.price         
        }
        util.request(`${api.CreateCartProduct}`, cart_product, 'POST').then(res => {
          console.log('提交购物车数据成功！');
        })
      })
    }
  }

  
  /**
   * 清空购物车
   */
  export function clearCartList() {
    wx.removeStorageSync(constants.StorageKey_Cart_Data);
  }