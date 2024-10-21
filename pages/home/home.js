Page({
  data: {
    userInfo: {
      avatarUrl: '',
      nickName: '',
    },
    chname: false
  },

  onInputChange(e) {
    const nickName = e.detail.value
    const {
      avatarUrl
    } = this.data.userInfo
    if(nickName.trim() !== ""){
      this.setData({
        "userInfo.nickName": nickName,
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
  onLoad: function (e) {
    this.setData({
      'userInfo.avatarUrl': e.avatarUrl,
      'userInfo.nickName': e.nickName
    })
    console.log('avatarUrl:', e.avatarUrl)
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
    const {
      avatarUrl
    } = e.detail
    const {
      nickName
    } = this.data.userInfo
    this.setData({
      "userInfo.avatarUrl": avatarUrl,
      hasUserInfo: nickName && avatarUrl && avatarUrl !== defaultAvatarUrl,
    })
    this.saveAvatarUrl();
  },
  saveAvatarUrl() {
    wx.setStorageSync('avatarUrl', this.data.userInfo.avatarUrl);
  },
  back() {
    // 获取页面栈
    let pages = getCurrentPages();
    if (pages.length > 1) {
      // 获取上一个页面
      let prevPage = pages[pages.length - 2];

      // 直接修改上一个页面的 data 中的数据
      prevPage.setData({
        'userInfo.avatarUrl': this.data.userInfo.avatarUrl,
        'userInfo.nickName': this.data.userInfo.nickName,
      });
    }

    // 返回上一个页面
    wx.navigateBack({});
  },
});