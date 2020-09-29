// components/show-buy-modal.js
const util = require('../../utils/util');
const cartUtil = require('../../utils/cartUtil');
const api = require('../../config/api');
const constant = require('../../config/constant/index');

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    good_info: Object
  },

  /**
   * 组件的初始数据
   */
  data: {
    count: 0, //库存
    button_normal_color: 'lightgray',
    button_select_color: 'pink',
    text_normal_color: 'black',
    text_select_color: 'white',
    selected_color_id: 0,
    selected_size_id: 0,
    selected_color_name: '',
    selected_size_name: '',
    num: 1 //选择的数量
  },

  /**
   * 组件的方法列表
   */
  methods: {
    //选择尺码
    handleChangeSize(event) {
      const {id, name} = event.currentTarget.dataset.size;
      this.updateProductCount(this.data.selected_color_id, id);
      this.setData({
        selected_size_id: id,
        selected_size_name: name
      })
    },

    //选择颜色
    handleChangeColor(event) {
      const {id, name} = event.currentTarget.dataset.color;
      this.updateProductCount(id, this.data.selected_size_id);
      this.setData({
        selected_color_id: id,
        selected_color_name: name
      })
    },

    updateProductCount(selected_color_id, selected_size_id) {
      if (!selected_color_id || !selected_size_id) {
        return;
      }
      this.getProductCount(selected_color_id, selected_size_id).then((res) => {
        if (res.data) {
          let count = res.data.count || 0;
          this.setData({
            count: count
          })
        }
      })
    },

    //显示库存信息(尺码与颜色均选中)
    getProductCount(selected_color_id, selected_size_id) {
      return util.request(`${api.GoodCount}?size_id=${selected_size_id}&color_id=${selected_color_id}&product_id=${this.properties.good_info.id}`);
    },

    /**
     * 增加数量
     */
    handleAddNum() {
      if (this.data.num === this.data.count) {
        return;
      }
      this.data.num ++ ;
      this.setData({
        num: this.data.num
      })
    },

    /**
     * 减少数量
     */
    handleReduceNum() {
      if (this.data.num === 1) {
        return;
      }
      this.data.num -- ;
      this.setData({
        num: this.data.num
      })
    },

    /**
     * 隐藏浮层
     */
    dismissModal() {
      this.triggerEvent('dismiss');
    },

    /**
     * 加入购物车
     */
    handleAddCart() {
      //--- 未选择尺寸、颜色，提示需要选择 ---
      if (this.data.selected_color_name.length === 0 || this.data.selected_size_name.length == 0) {
        console.log('请选择产品尺寸、颜色');
        return;
      }
      if (this.data.count === 0) {
        console.log('请等待更新库存');
        return;
      }
      //缓存中读取购物车数据
      let data = wx.getStorageSync(constant.StorageKey_Cart_Data);
      try {
        data = JSON.parse(data);
        if (!data) {
          data = [];
        }
        //如果存在同ID同尺寸同颜色的产品，则合并产品数量
        if (Array.isArray(data) && data.length > 0) {
          let cart_product = data.find(item => item.product_id === this.properties.good_info.id && item.color_id === this.data.selected_color_id && item.size_id === this.data.selected_size_id);
          if (cart_product) {
            cart_product.product_num++;
            cartUtil.updateCartProduct(cart_product.id, cart_product.product_num);
            this.dismissModal();
            return;
          }
        }
      } catch (error) {
        if (!data) {
          data = [];
        }
      }
      const cart_product = {
        'customer_id': 1, //warn: 此处需要依据真实用户ID修改
        'product_id': this.properties.good_info.id,
        'size_id': this.data.selected_size_id,
        'color_id': this.data.selected_color_id,
        'product_num': this.data.num
      };
      //提交产品至购物车
      cartUtil.addCartProduct(cart_product);
      this.dismissModal();    
    },

    /**
     * 立即购买
     */
    handleToBuy() {
      //产品信息 id、尺码、颜色、数量
      const products = [{
        'id': this.properties.good_info.id,
        'name': this.properties.good_info.name,
        'img': this.properties.good_info.picUrl,
        'price': this.properties.good_info.price,
        'color_id': this.data.selected_color_id,
        'size_id': this.data.selected_size_id,
        'color_name': this.data.selected_color_name,
        'size_name': this.data.selected_size_name,
        'num': this.data.num
      }];
      this.triggerEvent('toBuy', `/pages/checkout/index?products=${JSON.stringify(products)}`);
    }
  }
})
