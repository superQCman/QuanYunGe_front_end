// pages/generate/generate.js
import {sendText, getOwn} from "../../utils/request"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    own_id: '',
    TempImagPath:'',
    tempImagePath: "",
    text1:'',
    text2:'',
    getImage:false,
    userInfo: {
      avatarUrl: "",
      nickName: '用户',
      openId: ''
    },
    restart:false,
    submit_photo:false,
    isloading:false
  },
  onInputChange_1(e) {
    const text1 = e.detail.value
    this.setData({
      text1:text1
    })
  },
  onInputChange_2(e) {
    const text2 = e.detail.value
    this.setData({
      text2:text2
    })
  },
  // 自定义 base64ToArrayBuffer 函数，替代 atob
  base64ToArrayBuffer(base64) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
    let binaryString = '';
    let padding = '=';

    // 移除 Base64 字符串中结尾的 '='
    base64 = base64.replace(new RegExp(padding + "+$"), '');

    for (let i = 0; i < base64.length; i += 4) {
      const encoded1 = chars.indexOf(base64[i]);
      const encoded2 = chars.indexOf(base64[i + 1]);
      const encoded3 = chars.indexOf(base64[i + 2]);
      const encoded4 = chars.indexOf(base64[i + 3]);

      binaryString += String.fromCharCode((encoded1 << 2) | (encoded2 >> 4));
      if (encoded3 !== -1) {
        binaryString += String.fromCharCode(((encoded2 & 15) << 4) | (encoded3 >> 2));
      }
      if (encoded4 !== -1) {
        binaryString += String.fromCharCode(((encoded3 & 3) << 6) | encoded4);
      }
    }

    const buffer = new ArrayBuffer(binaryString.length);
    const bytes = new Uint8Array(buffer);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }

    return buffer;
  },

  // 异步保存照片的函数
  async savePhoto(coin_photo, coin_id, other) {
    const fileSystemManager = wx.getFileSystemManager();
    const filePath = `${wx.env.USER_DATA_PATH}/${other}_${coin_id}.png`;
    const base64Data = coin_photo;

    return new Promise((resolve, reject) => {
      fileSystemManager.access({
        path: filePath,
        success: () => {
          console.log('文件已存在，直接使用。');
          resolve(filePath); // 文件已存在，直接返回路径
        },
        fail: () => {
          console.log('文件不存在，开始生成图片文件。');
          const buffer = this.base64ToArrayBuffer(base64Data); // 使用自定义的 base64ToArrayBuffer 函数

          // 写入文件
          fileSystemManager.writeFile({
            filePath,
            data: buffer,
            encoding: 'binary',
            success: () => {
              console.log('文件已生成。');
              resolve(filePath); // 成功写入文件后返回路径
            },
            fail: err => {
              console.error("Failed to write base64 image to file:", err);
              reject(err); // 出错时拒绝 Promise
            }
          });
        }
      });
    });
  },
  async submit(){
    this.setData({
      isloading:true
    })
    const fileSystemManager = wx.getFileSystemManager();

    // 读取文件并转换为Base64
    const imageBase64 = fileSystemManager.readFileSync(this.data.tempImagePath, 'base64');
    // const image2Base64 = fileSystemManager.readFileSync(filePath_2, 'base64');
    const data = await sendText(this.data.userInfo.openId,this.data.text1,this.data.text2,imageBase64);
    this.setData({
      own_id: data.own_id
    })
    console.log("own_id: ",this.data.own_id)
    const photo = await getOwn(this.data.own_id)
    console.log(photo)
    const filePath = await this.savePhoto(photo.own_photo,this.data.own_id,"own");
    console.log("filePath: ",filePath);
    this.setData({
      TempImagPath:filePath
    })
    this.setData({
      getImage:true,
      restart:true,
      isloading:false
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (){
    const app = getApp();
    // 设置页面的初始数据
    this.setData({
      userInfo: app.globalData.userInfo
    });
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
      let tempImagePath = "";
  
      // 将选中的图片路径存储到 tempImagePath 数组中
      if (result.tempFiles && result.tempFiles.length > 0 && result.tempFiles[0].path) {
        tempImagePath = result.tempFiles[0].path;
      } else if (result.type) {
        tempImagePath = result.tempFiles[0].tempFilePath;
      }
  
      // 更新 tempImagePath 数据
      this.setData({
        tempImagePath: tempImagePath,
        submit_photo:true
      });
      
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  // onReady() {

  // },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    console.log("onShow is called");
    // 每次页面显示时，更新页面的数据
    const app = getApp();
    this.setData({
      userInfo: app.globalData.userInfo // 从全局变量获取最新的 userInfo
    });
    console.log(this.data.userInfo)
    if (this.data.userInfo.nickName.trim() ===""){
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
  restart(){
    this.setData({
      getImage:false,
      tempImagePath:"",
      restart:false,
      submit_photo:false
    })
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})