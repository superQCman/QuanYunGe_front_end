import {
  baseUrl
} from './utils/request';
const defaultAvatarUrl = 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0';
// app.js
App({
  globalData: {
    userInfo: {
      avatarUrl: defaultAvatarUrl, // 默认头像地址
      nickName: '用户', // 用户昵称
      openId: wx.getStorageSync('openid') // 从缓存中读取 openId
    },
    LogIn: false
  },

  onLaunch() {
    this.userInfo = {
      avatarUrl: defaultAvatarUrl,
      nickName: '用户',
      openId: ''
    }
    // 展示本地存储能力
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    wx.showModal({
      title: '温馨提示',
      content: '亲，授权微信登录后才能正常使用小程序功能',
      success(res) {
        console.log(0)
        console.log(res)
        //如果用户点击了确定按钮
        if (res.confirm) {
          wx.getUserProfile({
            desc: '获取你的昵称、头像、地区及性别',
            success: res => {
              console.log(res);
              console.log(1);
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
            fail: res => {
              console.log(2);
              console.log(res)
              //拒绝授权
              wx.showToast({
                title: '您拒绝了请求,不能正常使用小程序',
                icon: 'error',
                duration: 2000
              });
              return;
            }
          });
        } else if (res.cancel) {
          //如果用户点击了取消按钮
          console.log(3);
          wx.showToast({
            title: '您拒绝了请求,不能正常使用小程序',
            icon: 'error',
            duration: 2000
          });
          return;
        }
      }
    });



  },
})
