// pages/resultPageNew/resultPageNew.js
const defaultAvatarUrl = 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0'
import {uploadImageRequest,downloadImage,detailRequest,savePost} from "../../utils/request"
Page({
  /**
   * 页面的初始数据
   */
  data: {
    coinName:'钱币名',
    TempImagPath:defaultAvatarUrl, // 识别图片地址（从后端得到）
    ImagePath_1:'',
    ImagePath_2:'',
    detectID:'',
    value:'5',
    history:'历史背景.....',
    version:[
      {
        name: '年份：',
        value: '2024'
      },
      {
        name: '重量：',
        value: '5'
      },
      {
        name: '直径：',
        value: '10'
      },
      {
        name: 'PCGS评级代号：',
        value: '100'
      },
    ],
  meanPrice:'20',
  isLoading: true,
  isSave: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(e) {
      const isSave = e.isSave === "true";
      const coinName = e.coinName;
      const ImagePath_1 = e.ImagePath_1;
      const ImagePath_2 = e.ImagePath_2;
      console.log("coinName: ",coinName,"\nImagePath_1: ",ImagePath_1,"\nImagePath_2:",ImagePath_2);
      console.log("isSave: ",isSave);
      this.setData({
        coinName: coinName,
        isSave: isSave,
        ImagePath_1: ImagePath_1,
        ImagePath_2:ImagePath_2
      })
      if(ImagePath_1.trim() !== "" && ImagePath_2.trim() !== "" && coinName.trim() === ""){
        this.handleUploadImage();
      } else if (coinName.trim() !== "") { // 已知钱币名称获取详细信息
        this.getDetail();
      }
  },
  async getDetail(){
    try {
      const data = await detailRequest(this.data.coinName);
      console.log(data);
      this.setData({
        isLoading: false,
        value: data.value,
        history: data.history,
        version: data.version,
        
      });
      const TempImagPath = await downloadImage(data.fileName);
      this.setData({
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
        detectID: data.id,
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
    const data = await savePost(openId,this.data.coinName,this.data.isSave);
    console.log(data.received);
    if(data.received === "1"){
      wx.showModal({
        title: '提示',
        content: '收藏成功',
        showCancel: false, // 不显示取消按钮
        confirmText: '确定' // 确认按钮文字
      });
      this.setData({
        isSave:true
      })
    }else{
      wx.showModal({
        title: '提示',
        content: '取消收藏',
        showCancel: false, // 不显示取消按钮
        confirmText: '确定' // 确认按钮文字
      });
      this.setData({
        isSave:false
      })
    }
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