// pages/history/history.js
const defaultAvatarUrl = 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0'
import {historyRequest, downloadImage, saveRequest, whetherIsSave} from "../../utils/request"
Page({
  /**
   * 页面的初始数据
   */
  data: {
    coinName:[],
    coinID: [],
    TempImagPath:[], // 识别图片地址（从后端得到）
    time:['2022年10月1日 14:23','2022年10月2日 14:23'],
    isLoading: true,
    isHistory: true,
    isSave: true
  },
  goToResult: function(e){
    const Index = e.currentTarget.dataset.index; // index
    console.log("index:", Index);
    const ImagePath = "";
    // this.checkSave(this.data.coinName[Index]);
    wx.navigateTo({
      url: `/pages/resultPageNew/resultPageNew?coinName=${this.data.coinName[Index]}&ImagePath_1=${ImagePath}&ImagePath_2=${ImagePath}&coinId=${this.data.coinID[Index]}`,
    })
  },
  async checkSave(name){
    const app = getApp();
      const {
        openId
      } = app.globalData.userInfo;
    const data = await whetherIsSave(openId,name);
    this.setData({
      isSave:data.isSave
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(e) {
    const isHistory = e.isHistory === "true";
    this.setData({
      isHistory:isHistory
    })
    console.log("isHistory: ",this.data.isHistory)
    if(this.data.isHistory){
      // console.log("isHistory: ",isHistory)
      this.getHistory();
    }else{
      this.getSave();
    }
  },
  async getHistory(){
    try {
      const app = getApp();
      const {
        openId
      } = app.globalData.userInfo;
      console.log('openID: ', openId)
      const data = await historyRequest(openId);
      console.log(data);
      this.setData({
        coinName: data.coinName,
        coinID: data.ID,
        time: data.time
      });
      const TempImagPath = [];
      console.log("fileName.length: ",data.fileName.length);

      for(let i=0; i<data.fileName.length;i++){
        TempImagPath[i] = await downloadImage(data.fileName[i]);
      }
      
      this.setData({
        isLoading: false,
        TempImagPath: TempImagPath
      })
    }catch(error){
      wx.showToast({
        title: '错误请求',
        duration: 2000,
        icon:"error"
      })
      setTimeout(() => {
        wx.navigateBack({})
      }, 2000);
    }
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
    async savePhoto(coin_photo, coin_id) {
      const fileSystemManager = wx.getFileSystemManager();
      const filePath = `${wx.env.USER_DATA_PATH}/${coin_id}.png`;
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
  


  async getSave(){
    try {
      const app = getApp();
      const {
        openId
      } = app.globalData.userInfo;
      console.log('openID: ', openId)
      const data = await saveRequest(openId);
      console.log(data);
      console.log(data.length)
      let coin_name = [];
      let coin_id = [];
      let coin_photo = [];
      for(let i = 0;i<data.length;i++){
        coin_name.push(data[i].coin_name);
        coin_id.push(data[i].coin_id);
        coin_photo.push(data[i].coin_photo);
      }
      console.log(coin_name)
      this.setData({
        coinName: coin_name,
        coinID: coin_id,
      });
      console.log("coin_photo: ",coin_photo)
      let TempImagPath = []
      for(let i=0; i<data.length;i++){
        try{
          console.log("coinId: ",coin_id[i])
          TempImagPath[i] = await this.savePhoto(coin_photo[i],coin_id[i]);
        }catch(error){
          console.log("error: ",error)
        }
      }
      console.log(TempImagPath)
      
      this.setData({
        isLoading:false,
        TempImagPath: TempImagPath
      })
    }catch(error){
      console.log("error: ",error)
      wx.showToast({
        title: '错误请求',
        duration: 2000,
        icon:"error"
      })
      setTimeout(() => {
        wx.navigateBack({})
      }, 2000);
    }
  },
  back() {
    wx.navigateBack({})
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

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