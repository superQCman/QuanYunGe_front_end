// pages/history/history.js
const defaultAvatarUrl = 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0'
import {historyRequest, downloadImage, saveRequest} from "../../utils/request"
Page({
  /**
   * 页面的初始数据
   */
  data: {
    coinName:['Name1','Name2'],
    coinID: ['12344','34552'],
    TempImagPath:[defaultAvatarUrl,defaultAvatarUrl], // 识别图片地址（从后端得到）
    time:['2022年10月1日 14:23','2022年10月2日 14:23'],
    isLoading: true,
    isHistory: true
  },
  goToResult: function(e){
    const Index = e.currentTarget.dataset.index; // index
    console.log("index:", Index);
    const ImagePath = "";
    wx.navigateTo({
      url: `/pages/resultPageNew/resultPageNew?coinName=${this.data.coinName[Index]}&ImagePath_1=${ImagePath}&ImagePath_2=${ImagePath}`,
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
      const data = await historyRequest();
      console.log(data);
      this.setData({
        isLoading: false,
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
  async getSave(){
    try {
      const data = await saveRequest();
      console.log(data);
      this.setData({
        isLoading: false,
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