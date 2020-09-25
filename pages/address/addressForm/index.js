// pages/address/addressForm/index.js
const api = require('../../../config/api.js');
const util = require('../../../utils/util.js');
const constant = require('../../../config/constant/index.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    user_id: 0,
    address_id: 0,
    region: ['请选择', '请选择', '请选择'],
    address: '',
    zip: '200050',
    is_default: 0,
    telephone: '',
    shipping_user_name: '',
    customItem: "请选择",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);

    if (options && options.address) {
      const address = JSON.parse(options.address);
      this.setData({
        address_id: address ? address.id : 0,
        region: address ? [address.province, address.city, address.district] : ['请选择', '请选择', '请选择'],
        address: address ? address.address : '',
        zip: address ? address.zip : '200050',
        is_default: address ? address.is_default : 0,
        telephone: address ? address.telephone : '',
        shipping_user_name: address ? address.shipping_user_name : ''
      })
    }
    if (options && options.user_id) {
      this.setData({
        user_id: options.user_id,
      })
    }
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
   * 省市区选择 
   */
  handleRegionChange(e) {
    console.log(e.detail);
    
    this.setData({
      region: e.detail.value,
    })
  },

  /**
   * 提交表单
   */
  handleSubmit(e) {
    console.log(e.detail.value);
    //验证表单
    //提交表单
    const that = this;
    if (this.data.address_id === 0) {
      //新增地址
      const address = {
        'customer_id': this.data.user_id,
        'zip': e.detail.value.zip,
        'province': e.detail.value.region[0],
        'city': e.detail.value.region[1],
        'district': e.detail.value.region[2],
        'address': e.detail.value.address,
        'is_default': e.detail.value.address_is_default ? 1 : 0,
        'telephone': e.detail.value.telephone,
        'shipping_user_name': e.detail.value.shipping_user_name,
      };
      util.request(`${api.CreateAddress}`, address, 'POST').then(res => {
        console.log('添加地址成功!');
        !e.detail.value.address_is_default && that.updateSuccess();
        e.detail.value.address_is_default && that.updateOriDefaultAddr(res.data.id);
      })
    } else {
      //更新地址
      const address = {
        'zip': e.detail.value.zip,
        'province': e.detail.value.region[0],
        'city': e.detail.value.region[1],
        'district': e.detail.value.region[2],
        'address': e.detail.value.address,
        'is_default': e.detail.value.address_is_default ? 1 : 0,
        'telephone': e.detail.value.telephone,
        'shipping_user_name': e.detail.value.shipping_user_name,
      };
      util.request(`${api.UpdateAddress}?id=${this.data.address_id}`, address, 'PUT').then(res => {
        console.log('更新地址成功!');
        !e.detail.value.address_is_default && that.updateSuccess();
        e.detail.value.address_is_default && that.updateOriDefaultAddr(this.data.address_id);
      })
    }
    
  },

  /**
   * 操作成功
   */
  updateSuccess() {
    this.notifyListUpdateAddrs();
    wx.navigateBack({
      delta: 1,
    })
  },
  /**
   * 通知列表更新用户地址
   */
  notifyListUpdateAddrs() {
    if (util.compareVersion(wx.getSystemInfoSync().SDKVersion, '2.7.3') >= 0) {
      const eventChannel = this.getOpenerEventChannel();
      eventChannel.emit('updateAddrs');
    }
  },

  /**
   * 地址设为默认，需将原默认地址设为非默认
   */
  updateOriDefaultAddr(id) {
    const that = this;
    util.getUserInfo().then(res => {
      if (!res || !res.id) {
        return;
      }
      //是否有旧的默认地址
      if (Array.isArray(res.customerAddrs)) {
        if (res.customerAddrs.length > 0) {
          const oriDefaultAddr = res.customerAddrs.find(item => item.id !== id && item.is_default === 1);
          if (oriDefaultAddr) {
            util.request(`${api.UpdateAddress}?id=${oriDefaultAddr.id}`, {'is_default': 0}, 'PUT').then(res => {
              console.log('原默认地址已被修改为非默认!');
              that.updateSuccess();
            }).catch(() => {
              console.log('原默认地址修改为非默认失败!');
            })
          } else {
            that.updateSuccess();
          }
        } else {
          console.log('用户无地址');
        }
      } else {
        console.log('用户无地址');
      }
    })
  }

})