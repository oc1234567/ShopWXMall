const api = require('../config/api.js');
const { AppId } = require('../config/constant/app_id');
const { AppSecret } = require('../config/constant/app_secret');

/**
 * 封装微信的的request
 */
function request(url, data = {}, method = "GET", header = "application/json") {
    // wx.showLoading({
    //     title: '加载中...',
    // });
    return new Promise(function (resolve, reject) {
        wx.request({
            url: url,
            data: data,
            method: method,
            header: {
                'Content-Type': header,
                'X-Nideshop-Token': wx.getStorageSync('token')
            },
            success: function (res) {
                // wx.hideLoading();
                console.log(res);
                if (res.statusCode == 200 || res.statusCode == 201 || res.statusCode == 204) {
                    if (res.data.errno == 401) {
                        wx.navigateTo({
                            url: '/pages/auth/btnAuth/btnAuth',
                        })
                    } else {
                        resolve(res);
                    }
                } else {
                    reject(res.errMsg);
                }

            },
            fail: function (err) {
                reject(err)
            }
        })
    });
}

/**
 * 检测登录态是否过期
 */
function checkSession() {
    return new Promise((resolve, reject) => {
        wx.checkSession({
          success: () => {
              //登录态未过期
              resolve(true);
          },
          fail: () => {
              //登录态已过期
              reject(false);
          }
        })
    })
}

/**
 * 调用微信登录
 */
function login() {
    return new Promise((resolve, reject) => {
        wx.login({
            success: (res) => {
                if (res.code) {
                    resolve(res);
                } else {
                    reject(res);
                }
            },
            fail: (err) => {
                reject(err);
            },
        })
    })
}

/**
 * 调用微信接口 code2Session 服务，获取用户唯一标识 openid 与 会话密钥 session_key
 */
function getOpenIdAndSessionKey(code) {
    const code2Session_Url = `https://api.weixin.qq.com/sns/jscode2session?appid=${AppId}&secret=${AppSecret}&js_code=${code}&grant_type=authorization_code`;
    return request(code2Session_Url);
}
//获取用户登录信息
function getUserInfo(expand = 'customerAddrs') {
  return new Promise((resolve, reject) => {
    checkSession().then(() => {
        console.log('session valid');
        const openid = wx.getStorageSync('openid', `${openid}`);
        request(api.CustomerInfo, {openid: openid, expand: expand}).then((res) => {
            if (res.data) {
                if (Array.isArray(res.data)) {
                    if (res.data.length > 0) {
                        let user = res.data[0];
                        resolve(user);
                    }
                }
            }
        }).catch(() => {
            console.log('CustomerInfo api failed!');
        })
      }).catch(() => {
        console.log('session invalid!');
        login().then(res => {
        //   console.log(`login code: ${res.code}`);
            getOpenIdAndSessionKey(res.code).then((res) => {
                if (res.data) {
                    const {openid, session_key} = res.data;
                    //判断此用户是否存在
                    let isRegistered = false;
                    request(api.CustomerInfo, {openid: openid, expand: expand}).then((res) => {
                        if (res.data) {
                            if (Array.isArray(res.data)) {
                                if (res.data.length > 0) {
                                    isRegistered = true;
                                }
                            }
                        }
                        //用户不存在
                        if (!isRegistered) {
                                //注册用户
                                request(api.CreateCustomerByWeixin, {openid: openid}, 'POST').then((res) => {
                                    if (res.data) {
                                        if (Array.isArray(res.data)) {
                                            if (res.data.length > 0) {
                                            let user = res.data[0];
                                            resolve(user);
                                            wx.setStorageSync('openid', `${openid}`);
                                            }
                                        }
                                    }
                                }).catch(() => {
                                    console.log('create customer api failed!');
                                })
                        } else {
                            //用户已存在
                            let user = res.data[0];
                            resolve(user);
                            wx.setStorageSync('openid', `${openid}`);
                        }
                    }).catch(() => {
                        console.log('CustomerInfo api failed!');
                    })
                }
            }).catch(() => {
                console.log('code2session api failed!');
            });
        }).catch(() => {
          console.log('get user login code fail!');
        })
      })
  })
}
/**
 * 检查版本号
 */
function compareVersion(v1, v2) {
    v1 = v1.split('.');
    v2 = v2.split('.');
    const len = Math.max(v1.length, v2.length);

    while (v1.length < len) {
        v1.push('0');
    }
    while (v2.length < len) {
        v2.push('0');
    }

    for (let i = 0; i < len; i++) {
        const num1 = parseInt(v1[i]);
        const num2 = parseInt(v2[i]);
        
        if (num1 > num2) {
            return 1;
        } else if (num1 < num2) {
            return -1;
        }
    }
    return 0;
}

 module.exports = {
    request,
    checkSession,
    login,
    getOpenIdAndSessionKey,
    getUserInfo,
    compareVersion
}


