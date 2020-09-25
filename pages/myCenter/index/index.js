// pages/myCenter/index/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    is_logined: false,
    user_avatar: 'https://res.wx.qq.com/wxdoc/dist/assets/img/0.4cb08bb4.jpg',
    user_name: '测试帐号',
    user_grade: 0, //用户等级 0: 普通用户 1: 铜卡 2: 银卡 3: 金卡 4: 钻石卡 5: 铂金卡
    user_grade_class: [0, 500, 2000, 8000, 15000, 30000], //用户等级积分进阶梯度
    user_grade_integral: 0,
    user_grade_integral_reduce: 500,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
   * 导航-我的订单页
   */
  handleToOrderList(e) {
    const index = e.currentTarget.dataset.index;
    wx.navigateTo({
      url: `/pages/myCenter/orderList/index?index=${index}`,
    })
  }
})