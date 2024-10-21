import {baseUrl} from './utils/request';
// app.js
App({
  onLaunch() {
    // 展示本地存储能力
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        if (res.code) {
          console.log('登录凭证：', res.code);
          // 将 code 发送给服务器以换取 openid 和 session_key
          wx.request({
            url: `${baseUrl}/get_openid`, // 你的后端地址
            method: 'POST',
            data: {
              code: res.code
            },
            success: (response) => {
              console.log('获取的用户 openid:', response.data.openid);
              // 可以将 openid 存储在本地
              wx.setStorageSync('openid', response.data.openid);
            },
            fail: (error) => {
              console.error('请求失败:', error);
            }
          });
        } else {
          console.error('登录失败！' + res.errMsg);
        }
      },
      fail: (err) => {
        console.error('wx.login 接口调用失败:', err);
      }
    })
  },
  globalData: {
    userInfo: null
  }
})
