const util = require('./util.js');
const api = require('../config/api.js');
const constants = require('../config/constant/index');

/**
 * 提交单条购物车产品数据到购物车
 */
export function addCartProduct(cart_product) {
  if (!cart_product) {
    return;
  }
  const {customer_id, product_id, size_id, color_id} = cart_product;
  if (!customer_id, !product_id || !size_id || !color_id) {
    return;
  }
  util.request(`${api.CreateCartProduct}`, cart_product, 'POST').then(res => {
    console.log('加入购物车成功!');  
  })
}

/**
 * 更新某条购物车产品的数量
 * @param {String} id 购物车产品ID 
 * @param {Number} num 数量
 */
 export function updateCartProduct(id, num) {
   if (!id || !num) {
     return;
   }
   util.request(`${api.UpdateCartProduct}?id=${id}`, {'product_num': num}, 'PUT').then(res => {
     console.log('更新购物车产品数量成功！');
   })
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
        //购物车数据保持最近添加的在最前面
        resultCartProducts.sort((value1, value2) => {
          if (value1.id > value2.id) {
            return -1;
          }
          if (value2.id > value1.id) {
            return 1;
          }
          return 0;
        });
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
              'product_name': res.data.name,
              'product_img': res.data.picUrl,
              'product_price': res.data.price,
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
function updateCartProduct(cart_product_info, resultCartProducts) {
  if (!cart_product_info || !resultCartProducts || !Array.isArray(resultCartProducts)) {
    return;
  }
  const id = cart_product_info.id;
  if (!id) {
    return;
  }
  const cart_product_index = resultCartProducts.findIndex(cart_product => {
    return cart_product.id === id;
  });
  if (cart_product_index === -1) {
    return;
  }
  // const newCartProduct = Object.assign(resultCartProducts[cart_product_index], cart_product_info);
  resultCartProducts.slice(cart_product_index, 1, Object.assign(resultCartProducts[cart_product_index], cart_product_info));
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
          console.log('清空购物车数据成功！');
        })
      })
    }
  })
  wx.removeStorageSync(constants.StorageKey_Cart_Data);
}

/**
 * 购物车中移除商品
 */
export function removeCartList(id) {
  if (!id) {
    return;
  }
  util.request(`${api.DeleteCartProduct}?id=${id}`, undefined, 'DELECT').then(res => {
    console.log(`删除id=${id}单条购物车数据成功！`);
  })
}