// pages/classify/classify.js
const defaultAvatarUrl = 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0';
import { classifyRequest, whetherIsSave } from '../../utils/request.js'
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
    ismore:false,
    items: [],
    selectedIndex: 0, // 记录当前选中的索引
    categories: [
      '先秦', 
      '秦汉', 
      '三国\n两晋',
      '南北朝', 
      '隋唐',
      '五代\n十国', 
      '宋', 
      '辽金\n西夏元', 
      '明', 
      '清', 
      '民国'
    ],
    introduce:"",
    isSave:false
  },
  async selectCategory(e) {
    const index = e.currentTarget.dataset.index;
    this.setData({
      selectedIndex: index
    });
    console.log("selectedIndex: ",this.data.selectedIndex);
    const data = await  classifyRequest(index);
    this.setData({
      items: data.items,
      introduce: data.introduce
    })
  },
  toggleMore: function () {
    this.setData({
      isMore: !this.data.isMore  // 切换 isMore 的值
    });
  },
  goToResult: function(e){
    const outerIndex = e.currentTarget.dataset.outerIndex; // 外层 index
    const innerIndex = e.currentTarget.dataset.innerIndex; // 内层 index
    console.log("Outer index:", outerIndex, "Inner index:", innerIndex);
    console.log("value: ",this.data.items[outerIndex].value[innerIndex]);
    const ImagePath = "";
    this.checkSave(this.data.items[outerIndex].value[innerIndex]);
    wx.navigateTo({
      url: `/pages/resultPageNew/resultPageNew?coinName=${this.data.items[outerIndex].value[innerIndex]}&ImagePath_1=${ImagePath}&ImagePath_2=${ImagePath}&isSave=${this.data.isSave}`,
    })
  },

  async checkSave(name){
    const data = await whetherIsSave(name);
    this.setData({
      isSave:data.isSave
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad(options) {
    const index = 0;
    const data = await classifyRequest(index);
    this.setData({
      items: data.items,
      introduce: data.introduce
    })
    
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