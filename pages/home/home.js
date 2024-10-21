const defaultAvatarUrl = 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0';
Page({
  data: {
    userInfo: {
      avatarUrl: defaultAvatarUrl,
      nickName: '用户',
      openId: ''
    },
    chname: false
  },

  onInputChange(e) {
    const nickName = e.detail.value
    const app = getApp();
    // const {
    //   avatarUrl
    // } = app.globalData.avatarUrl;
    if(nickName.trim() !== ""){
      app.globalData.userInfo.nickName = nickName;  
      this.setData({
        'userInfo.nickName':nickName,
        chname : false
      })
      // 保存用户信息到本地
      this.saveNickName();
    }else{
      console.log("没有昵称输入");
      wx.showModal({
        title: '提示',
        content: '请输入昵称',
        showCancel: false, // 不显示取消按钮
        confirmText: '确定' // 确认按钮文字
      });
    }
    
  },
  saveNickName() {
    wx.setStorageSync('nickName', this.data.userInfo.nickName);
    console.log("nickName:", this.data.userInfo.nickName)
  },
  onShow() {
    // 每次页面显示时，更新页面的数据
    const app = getApp();
    this.setData({
      userInfo: app.globalData.userInfo // 从全局变量获取最新的 userInfo
    });
    if (this.data.userInfo.avatarUrl.trim() === defaultAvatarUrl || this.data.userInfo.nickName.trim() ===""){
      wx.showModal({
        title: '提示',
        content: '请先登录',
        showCancel: false,
        complete: (res) => {      
          if (res.confirm) {
            wx.reLaunch({
              url: '/pages/index/index',
            })
          }
        }
      })
    }
  },
  onLoad: function () {
    const app = getApp();
    console.log("defaultAvatarUrl:",defaultAvatarUrl)
    // 设置页面的初始数据
    this.setData({
      userInfo: app.globalData.userInfo
    });
  },

  onShareAppMessage() {
    return {};
  },
  chName: function () {
    console.log('Image clicked');
    this.setData({
      chname: true
    })
    console.log('chname:', this.data.chname)
  },
  onChooseAvatar(e) {
    const app = getApp();
    const {
      avatarUrl
    } = e.detail;
    app.globalData.userInfo.avatarUrl = avatarUrl;
    this.setData({
      "userInfo.avatarUrl": avatarUrl
    })
    this.saveAvatarUrl();
  },
  saveAvatarUrl() {
    wx.setStorageSync('avatarUrl', this.data.userInfo.avatarUrl);
  },
  back() {
    // 返回上一个页面
    wx.navigateBack({});
  },
});