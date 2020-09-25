// pages/mycenter/orderList/index.js
const util = require('../../../utils/util');
const api = require('../../../config/api');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    user_id: 0,
    is_ready: false,
    order_list: [],
    top_titles: ['全部', '待支付', '待发货', '待收货', '待评价'],
    cur_top_index: 0,
    cur_order_list: [],
    order_status: ['待支付', '待发货', '待收货', '已完成', '已取消'], //0: 待支付 1: 待发货 2: 待收货 3: 已完成 4: 已取消
    cur_title_color: 'red',
    normal_title_color: 'black'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //-- options 参数 index 指定tab ---
    let index = 0;
    if (options && options.index) {
      index = parseInt(options.index);
      this.setData({
        cur_top_index: index,
      })
    }
    //---请求用户订单列表---
    let that = this;
    util.getUserInfo('customerAddrs, orders').then(res => {
      if (!res || !res.id || !res.orders) {
        return;
      }
      that.setData({
        user_id: res.id,
      })
      if (Array.isArray(res.orders)) {
        console.log('用户订单列表存在');
        res.orders.forEach(order => {
          //--- order_list 添加 order ----
          //获取订单 id、地址 id
          const {id, address_id, payment_money, status } = order;
          // customerAddrs 中找到对应 id 的地址
          let address = res.customerAddrs.find(address => address.id === address_id);
          that.data.order_list.push({
            'id': id,
            'shipping_user_name': address.shipping_user_name || '',
            'address_detail': `${address.city||''}${address.district||''}${address.address||''}`,
            'shipping_tel': address.telephone,
            'products': [],
            'payment_money': payment_money,
            'products_num': 0,
            'status': status
          })
          that.setData({
            is_ready: true,
            order_list: that.data.order_list,
            cur_order_list: that.getOrderListOfState(index, that.data.order_list)
          })
          util.request(`${api.CustomerOrderInfo}?id=${id}`, {expand: 'orderDetails'}).then(res => {
            if (!res || !res.data) {
              return;
            }
            if (res && res.data && res.data.orderDetails && Array.isArray(res.data.orderDetails)) {
              res.data.orderDetails.forEach(order_detail => {
                const {id, order_id, product_id, product_size, product_type, product_cnt} = order_detail;
                //--- products 添加 product ----
                let order = that.data.order_list.find(order => order.id === order_id);
                order && order.products.push({
                  'id': product_id,
                  'order_detail_id': id,
                  'num': product_cnt,
                  'name': '',
                  'size_name': '',
                  'color_name': ''
                })
                order && (order.products_num = order.products_num + product_cnt);
                that.setData({
                  order_list: that.data.order_list,
                  cur_order_list: that.getOrderListOfState(index, that.data.order_list)
                })
                util.request(`${api.GoodDetail}?id=${product_id}`, {'expand': 'picUrl'}).then(res => {
                  if (!res || !res.data) {
                    return;
                  }
                  //--- product 添加 name、price、ori_price、piUrl ----
                  let order = that.data.order_list.find(order => order.id === order_id);
                  if (order) {
                    let product = order.products.find(product => product.id === product_id);
                    product && (product = Object.assign(product, {
                      'name': res.data.name || '',
                      'price': res.data.price || 0.00,
                      'ori_price': res.data.ori_price || 0.00,
                      'image': res.data.picUrl || '',
                    }))
                  }
                  that.setData({
                    order_list: that.data.order_list,
                    cur_order_list: that.getOrderListOfState(index, that.data.order_list)
                  })
                })
                if (product_size) {
                  util.request(`${api.GoodSize}?id=${product_size}`).then(res => {
                    if (!res || !res.data) {
                      return;
                    }
                    //--- product 添加 size ----
                    let order = that.data.order_list.find(order => order.id === order_id);
                    if (order) {
                      let product = order.products.find(product => product.id === product_id);
                      product && (product = Object.assign(product, {
                        'size_name': res.data.name || '',
                      }))
                    }
                    that.setData({
                      order_list: that.data.order_list,
                      cur_order_list: that.getOrderListOfState(index, that.data.order_list)
                    })
                  })
                }
                if (product_type) {
                  util.request(`${api.GoodColor}?id=${product_type}`).then(res => {
                    if (!res || !res.data) {
                      return;
                    }
                    //--- product 添加 color ----
                    let order = that.data.order_list.find(order => order.id === order_id);
                    if (order) {
                      let product = order.products.find(product => product.id === product_id);
                      product && (product = Object.assign(product, {
                        'color_name': res.data.name || '',
                      }))
                    }
                    that.setData({
                      order_list: that.data.order_list,
                      cur_order_list: that.getOrderListOfState(index, that.data.order_list)
                    })
                  })
                }
              })
            }
          });
        });
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
   * 获取当前订单列表，支持传入 order_list 数据
   * @param {Number} index 订单状态
   * @param {Array} list 全部订单列表
   */
  getOrderListOfState(index, list) {
    if (index === 0) {
      return list;
    }
    const new_order_list = list.filter(order => order.status === (index-1));
    return new_order_list;
  },

  /**
   * 切换订单选项
   */
  handleChangeTopTitle(e) {
    const index = e.currentTarget.dataset.index;
    const orders = this.getOrderListOfState(index, this.data.order_list);
    this.setData({
      cur_top_index: index,
      cur_order_list: orders
    })
  },

  /**
   * 删除订单
   */
  handleDeleteOrder(e) {
    const order_id = e.currentTarget.dataset.orderid;
    const order = this.data.order_list.find(order => order.id === order_id);
    const order_detail_ids = order.products.map(product => product.order_detail_id);
    let count = order_detail_ids.length;
    order_detail_ids.forEach(order_detail_id => {
      util.request(`${api.DeleteOrderDetail}?id=${order_detail_id}`, undefined, 'DELETE').then(res => {
        console.log('删除订单购物清单产品成功！');
        count --;
        if (count === 0) {
          util.request(`${api.DeleteOrder}?id=${order_id}`, undefined, 'DELETE').then(res => {
            console.log('删除订单成功！');
          })
        }
      })
    })
  }
})