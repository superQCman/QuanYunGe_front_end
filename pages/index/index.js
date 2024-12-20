// index.js
const defaultAvatarUrl = 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0'
import {
  sendUsername
} from '../../utils/request'; // 假设 sendUsername 定义在 utils/api.js 中
// import {setColor} from '../../utils/color.js';
// import {configRequest} from '../../utils/request'
Page({
  data: {
    motto: '登录',
    mainpage: false,
    tempImagePath: [],
    userInfo: {
      avatarUrl: defaultAvatarUrl,
      nickName: '',
      openId: wx.getStorageSync('openid')
    },
    hasUserInfo: false,
    hasLogIn: false,
    chname: false,
    canIUseGetUserProfile: wx.canIUse('getUserProfile'),
    canIUseNicknameComp: wx.canIUse('input.type.nickname'),
  },
  bindViewTap() {
    wx.navigateTo({
      url: '../logs/logs'
    })
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
  saveAvatarUrl(){
    wx.setStorageSync('avatarUrl', this.data.userInfo.avatarUrl);
  },
  // 页面加载时读取本地存储的用户信息
  onLoad() {
    const nickName = wx.getStorageSync('nickName');
    const avatarUrl = wx.getStorageSync('avatarUrl');
    const openId = wx.getStorageSync('openid');
  
    console.log("openId:", openId);
  
    if (nickName && avatarUrl) {
      // 更新页面的 data 中的 userInfo
      this.setData({
        "userInfo.nickName": nickName,
        "userInfo.avatarUrl": avatarUrl,
        "userInfo.openId": openId,
        hasUserInfo: nickName && avatarUrl && avatarUrl !== defaultAvatarUrl
      });
    }
  },
  onInputChange(e) {
    const nickName = e.detail.value
    const {
      avatarUrl
    } = this.data.userInfo
    this.setData({
      "userInfo.nickName": nickName,
      hasUserInfo: nickName && avatarUrl && avatarUrl !== defaultAvatarUrl,
      chname : false
    })
    // 保存用户信息到本地
    this.saveNickName();
  },
  saveNickName() {
    wx.setStorageSync('nickName', this.data.userInfo.nickName);
    console.log("nickName:",this.data.userInfo.nickName)
  },
  getUserProfile() {
    // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认，开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
    wx.getUserProfile({
      desc: '展示用户信息', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        console.log(res)
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    })
  },
  async LogIn() {
    const {
      nickName
    } = this.data.userInfo; // 从页面数据中获取 nickName
    const {
      openId
    } = this.data.userInfo;
    const {
      avatarUrl
    } = this.data.userInfo;
    if (nickName.trim() !== "" && this.data.userInfo.avatarUrl !== defaultAvatarUrl) {
      console.log("有昵称输入：" + nickName);
      this.setData({
        mainpage: true
      })
      try {
        // 调用 sendUsername 发送用户名到后端
        const response = await sendUsername(nickName, openId);
        const app = getApp();
        // 同步更新全局的 userInfo
        app.globalData.userInfo = {
          nickName: nickName,
          avatarUrl: avatarUrl,
          openId: openId
        };

        console.log("全局 userInfo:", app.globalData.userInfo);
        // console.log('后端返回数据:', response.data);
      } catch (error) {
        console.error('提交用户名失败:', error);
      }
    } else if (nickName.trim() == "") {
      console.log("没有昵称输入");
      wx.showModal({
        title: '提示',
        content: '请输入昵称',
        showCancel: false, // 不显示取消按钮
        confirmText: '确定' // 确认按钮文字
      });
    } else if (this.data.userInfo.avatarUrl == defaultAvatarUrl) {
      console.log("没有头像输入");
      wx.showModal({
        title: '提示',
        content: '请上传头像',
        showCancel: false, // 不显示取消按钮
        confirmText: '确定' // 确认按钮文字
      });
    }
    this.setData({
      hasLogIn:true
    })
  },
  goToNextPage() {
    console.log("传输tempImagePath：",this.data.tempImagePath);
    if (this.data.tempImagePath.length == 1) {
      const ImagePath_1 = this.data.tempImagePath[0];
      // const ImagePath_2 = this.data.tempImagePath[1];
      this.setData({
        tempImagePath: []
      })
      console.log("tempfilePath:", this.data.tempImagePath.length)
      wx.navigateTo({
        url: `../crop/crop?ImagePath_1=${ImagePath_1}`,
      })
    }
  },
  selectPhoto(callBack) {
    let itemList = ['拍照', '从手机相册选择', '从聊天记录选择'];
    wx.showActionSheet({
      itemList,
      success: (action) => {
        if (action.tapIndex === 0) {
          // 从拍照选择图片，使用 chooseMedia
          wx.chooseMedia({
            sourceType: ['camera'],
            success: (res) => {
              if (callBack) callBack(res);
            }
          });
        } else if (action.tapIndex === 1) {
          // 从手机相册选择图片，使用 chooseMedia
          wx.chooseMedia({
            sourceType: ['album'],
            success: (res) => {
              if (callBack) callBack(res);
            }
          });
        } else if (action.tapIndex === 2) {
          // 从聊天记录选择图片，使用 chooseMessageFile
          wx.chooseMessageFile({
            success: (res) => {
              console.log("res:",res);
              if (callBack) callBack(res);
            }
          });
        }
      }
    });

  },
  handleSelectPhoto() {
    // 使用 this 来调用 selectPhoto 方法
    this.selectPhoto((result) => {
      console.log('选择的结果:', result);
      // 获取当前的 tempImagePath 数组
      let tempImagePath = this.data.tempImagePath || [];
  
      // 将选中的图片路径存储到 tempImagePath 数组中
      if (result.tempFiles && result.tempFiles.length > 0 && result.tempFiles[0].path) {
        tempImagePath.push(result.tempFiles[0].path);
      } else if (result.type) {
        tempImagePath.push(result.tempFiles[0].tempFilePath);
      }
  
      // 更新 tempImagePath 数据
      this.setData({
        tempImagePath: tempImagePath
      });
  
      // 检查 tempImagePath 数组的长度，如果已经有两个图片地址了，就不再继续
      if (tempImagePath.length === 1) {
        console.log('已选择一张图片，停止拍摄');
        this.goToNextPage();
      }
  
      // 提示用户是否继续拍照
      // wx.showModal({
      //   title: '继续拍照',
      //   content: '是否继续拍摄下一张照片？',
      //   showCancel: false,
      //   success: (res) => {
      //     if (res.confirm) {
      //       // 用户点击了“确定”按钮，继续拍摄下一张照片
      //       this.handleSelectPhoto();
      //     }
      //   }
      // });
    });
  },
  
  chName: function () {
    console.log('Image clicked');
    this.setData({
      chname: true
    })
    console.log('chname:', this.data.chname)
  },
  goHome(){
    wx.navigateTo({
      url: `/pages/home/home?nickName=${this.data.userInfo.nickName}&avatarUrl=${this.data.userInfo.avatarUrl}`,
    });
  },

})
