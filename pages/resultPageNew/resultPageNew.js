// pages/resultPageNew/resultPageNew.js
const defaultAvatarUrl = 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0'
import {uploadImageRequest,downloadImage,detailRequest,savePost,saveDelete,whetherIsSave} from "../../utils/request"
Page({
  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {
      avatarUrl: defaultAvatarUrl,
      nickName: '用户',
      openId: ''
    },
    coinName:'钱币名',
    coinId:'',
    TempImagPath:defaultAvatarUrl, // 识别图片地址（从后端得到）
    ImagePath_1:'',
    ImagePath_2:'',
    ismore:false,
    history:'历史背景.....',
    version:[],
    transList:[],
    unit: ['年','g','mm'],
  meanPrice:'20',
  isLoading: true,
  isSave: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(e) {
      const app = getApp();
      this.setData({
        userInfo: app.globalData.userInfo // 从全局变量获取最新的 userInfo
      });
      const coinName = e.coinName;
      const ImagePath_1 = e.ImagePath_1;
      const ImagePath_2 = e.ImagePath_2;
      const coinId = e.coinId;
      this.checkSave(coinId)
      console.log("coinName: ",coinName,"\nImagePath_1: ",ImagePath_1,"\nImagePath_2:",ImagePath_2);
      this.setData({
        coinName: coinName,
        ImagePath_1: ImagePath_1,
        ImagePath_2:ImagePath_2,
        coinId: coinId
      })
      if(ImagePath_1.trim() !== "" && ImagePath_2.trim() !== "" && coinName.trim() === ""){
        this.handleUploadImage();
      } else if (coinName.trim() !== "") { // 已知钱币名称获取详细信息
        this.getDetail();
      }
  },
  async checkSave(coinId){
    const data = await whetherIsSave(this.data.userInfo.openId,coinId);
    if(data === 1){
      this.setData({
        isSave:true
      })
    }if(data === 2){
      this.setData({
        isSave:false
      })
    }
  },
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

  async savePhoto(coin_photo, trans_id) {
    const fileSystemManager = wx.getFileSystemManager();
    const filePath = `${wx.env.USER_DATA_PATH}/${trans_id}_transaction.png`;
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

  async getDetail(){
    try {
      const data = await detailRequest(this.data.coinId);
      console.log(data);
      let version = []
      const version_name = ['年份：','重量：','直径：']
      const item_year = {
        name: version_name[0],
        value: data.coin_year
      }
      version.push(item_year);
      const item_weight = {
        name: version_name[1],
        value: data.coin_weight
      }
      version.push(item_weight);
      const item_diameter = {
        name: version_name[2],
        value: data.coin_diameter
      } 
      version.push(item_diameter);
      console.log("version: ",version);
      this.setData({
        history: data.coin_story,
        version: version,
      });
      let FilePathList = data.transactions;
      for (let i = 0;i<FilePathList.length;i++){
        try{
          const filePath = await this.savePhoto(data.transactions[i].transaction_photo,data.transactions[i].trans_id);
          FilePathList[i].transaction_photo = filePath;
        }catch(error){
          console.log("error: ",error)
        }
      }
      console.log("FilePathList: ",FilePathList);
      this.setData({
        transList: FilePathList
      })

      const fileSystemManager = wx.getFileSystemManager();
      const filePath = `${wx.env.USER_DATA_PATH}/${this.data.coinId}.png`;
      const base64Data = data.coin_photo;

      // 先检测文件是否存在
      fileSystemManager.access({
        path: filePath,
        success: () => {
          console.log('文件已存在，直接使用。');
          // 如果文件存在，直接设置图片路径
          this.setData({
            TempImagPath: `${filePath}`
          });
          console.log("TempImagPath: ",this.data.TempImagPath)
        },
        fail: () => {
          console.log('文件不存在，开始生成图片文件。');
          // 如果文件不存在，将 Base64 数据转换为 ArrayBuffer
          const buffer = this.base64ToArrayBuffer(base64Data);

          // 使用 FileSystemManager 将数据写入临时文件
          fileSystemManager.writeFile({
            filePath,
            data: buffer,
            encoding: 'binary',
            success: res => {
              console.log('文件已生成。');
              // 成功写入文件后，将其路径设置为 <image> 组件的 src
              this.setData({
                TempImagPath: `${filePath}`
              });
            },
            fail: err => {
              console.error("Failed to write base64 image to file:", err);
            }
          });
        }
      });
      console.log("TempImagPath: ",this.data.TempImagPath)
      // const TempImagPath = await downloadImage(data.fileName);
      // this.setData({
      //   TempImagPath: filePath
      // })
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
    this.setData({
      isLoading:false
    })
  },
  async handleUploadImage() {
    try {
      const app = getApp();
      const {
        openId
      } = app.globalData.userInfo;
      const data = await uploadImageRequest(openId,this.data.ImagePath_1,this.data.ImagePath_2)
      console.log(data);
      this.setData({
        isLoading: false,
        coinName:data.coinName,
        value: data.value,
        history: data.history,
        version: data.version
      });
      console.log(data.fileName);
      console.log("id",data.id);
      const TempImagPath = await downloadImage(data.fileName);

      this.setData({
        TempImagPath: TempImagPath
      })
    }  catch (error) {
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
  async save(){
    const app = getApp();
    const {
      openId
    } = app.globalData.userInfo;
    console.log('openID: ',openId)
    let data;
    if (!this.data.isSave) {
      console.log("this.data.isSave: ", this.data.isSave)
      data = await savePost(openId, this.data.coinId);

      this.setData({
        isSave: true
      })
      console.log("isSave: ",this.data.isSave)
    } else {
      console.log("this.data.isSave: ", this.data.isSave)
      data = await saveDelete(openId, this.data.coinId);

      this.setData({
        isSave: false
      })
      console.log("isSave: ",this.data.isSave)
    }
  },
  toggleMore: function () {
    this.setData({
      isMore: !this.data.isMore  // 切换 isMore 的值
    });
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