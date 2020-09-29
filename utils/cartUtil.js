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
          'size_id': product.size_id,
          'color_id': product.color_id,
          'product_num': product.num,
        }
        util.request(`${api.CreateCartProduct}`, cart_product, 'POST').then(res => {
          console.log('提交购物车数据成功！');
        })
      })
    }
  }

  /**
   * 请求购物车数据
   */
  export function getCartProducts() {
    return new Promise((resolve, reject) => {
      util.request(`${api.CartProductInfo}`).then(res => {
        if (!res || !res.data) {
          reject(null);
          return;
        }
        const cart_products = res.data;
        let resultCartProducts = [];

        if (Array.isArray(cart_products) && cart_products.length > 0) {
          cart_products.forEach(cart_product => {
            const {id, product_id, color_id, size_id, product_num } = cart_product;
            let result_cart_product = {
              'id': id,
              'product_id': product_id,
              'color_id': color_id,
              'size_id': size_id,
              'product_num': product_num,
            }
            resultCartProducts.push(result_cart_product);
          })
        } else {
          resolve(resultCartProducts);
        }
        //请求购物车产品详情
        if (Array.isArray(cart_products) && cart_products.length > 0) {
          cart_products.forEach(cart_product => {
            const { id, product_id, color_id, size_id } = cart_product;
            let product_info_sucess, color_info_success, size_info_success, count_info_success = false;
            //请求product_id对应产品信息
            util.request(`${api.GoodDetail}?id=${product_id}`, {'expands': 'picUrl'}).then(res => {
              if (!res || !res.data) {
                return;
              }
              const result_cart_product_info = {
                'id': id,
                'name': res.data.name,
                'image': res.data.picUrl,
                'price': res.data.price,
                'ori_pice': res.data.ori_pice,
              }
              updateCartProduct(result_cart_product_info, resultCartProducts);
              product_info_sucess = true;
              if (product_info_sucess && color_info_success && size_info_success && count_info_success) {
                resolve(resultCartProducts);
              }
            })
            //请求color_id对应颜色名称
            util.request(`${api.GoodColor}?id=${color_id}`).then(res => {
              if (!res || !res.data) {
                return;
              }
              const result_cart_product_info = {
                'id': id,
                'color_name': res.data.name,
              }
              updateCartProduct(result_cart_product_info, resultCartProducts);
              color_info_success = true;
              if (product_info_sucess && color_info_success && size_info_success && count_info_success) {
                resolve(resultCartProducts);
              }
            })
            //请求size_id对应尺寸名称
            util.request(`${api.GoodSize}?id=${size_id}`).then(res => {
              if (!res || !res.data) {
                return;
              }
              const result_cart_product_info = {
                'id': id,
                'size_name': res.data.name,
              }
              updateCartProduct(result_cart_product_info, resultCartProducts);
              size_info_success = true;
              if (product_info_sucess && color_info_success && size_info_success && count_info_success) {
                resolve(resultCartProducts);
              }
            })
            //请求product_id、size_id、color_id对应库存数量
            util.request(`${api.GoodCount}?product_id=${product_id}&size_id=${size_id}&color_id=${color_id}`).then(res => {
              if (!res || !res.data) {
                return;
              }
              const result_cart_product_info = {
                'id': id,
                'product_count': res.data.count,
              }
              updateCartProduct(result_cart_product_info, resultCartProducts);
              count_info_success = true;
              if (product_info_sucess && color_info_success && size_info_success && count_info_success) {
                resolve(resultCartProducts);
              }
            })
          })
        }
      }).catch(error => {
        console.log('查询购物车数据失败！');
        reject(null);
      });
    });
  }

  /**
   * 更新购物车详情
   */
  function updateCartProduct(id) {

    resultCartProducts.push(product);

  }

  
  /**
   * 清空购物车
   */
  export function clearCartList() {
    //获取购物车商品
    util.request(`${api.CartProductInfo}`).then(res => {
      if (!res || !res.data) {
        return;
      }
      const products = res.data;
      if (Array.isArray(products) && products.length > 0) {
        products.forEach(product => {
          util.request(`${api.DeleteCartProduct}?id=${product.id}`, undefined, 'DELETE').then(res => {
            console.log('删除购物车数据成功！');
          })
        })
      }
    })
    wx.removeStorageSync(constants.StorageKey_Cart_Data);
  }