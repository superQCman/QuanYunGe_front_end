// pages/classify/classify.js
const defaultAvatarUrl = 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0';
import { classifyRequest, whetherIsSave,CoinsResource,detailRequest } from '../../utils/request.js'
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
    items: ['null'],
    selectedIndex: 0, // 记录当前选中的索引
    class_id:[],
    categories: [],
    introduce:"null",
    all_data:[],
    isSave:false
  },
  async selectCategory(e) {
    const index = e.currentTarget.dataset.index;
    this.setData({
      selectedIndex: index
    });
    console.log("selectedIndex: ",this.data.selectedIndex);
    let data = await classifyRequest();
    console.log("data.class_story: ",data.class_story)
    console.log("introduce: ", data.class_story[index])
    this.setData({
      introduce: data.class_story[index],
    })
    data = await CoinsResource(index);
    console.log(data.coins)
    this.setData({
      items: data.coins,
      introduce: data.class_story.class_story
    })
  },
  toggleMore: function () {
    this.setData({
      isMore: !this.data.isMore  // 切换 isMore 的值
    });
  },
  goToResult: function(e){
    // const outerIndex = e.currentTarget.dataset.outerIndex; // 外层 index
    const coinId = e.currentTarget.dataset.innerIndex; // 内层 index
    const coin_name = e.currentTarget.dataset.name;
    console.log( "Inner index:", coinId);
    console.log("name: ",coin_name);
    const ImagePath = "";
    // this.checkSave(coinId);
    wx.navigateTo({
      url: `/pages/resultPageNew/resultPageNew?coinName=${coin_name}&ImagePath_1=${ImagePath}&ImagePath_2=${ImagePath}&coinId=${coinId}`,
    })
  },

  async detail(coinId){
    const test_data = await detailRequest(coinId)
    console.log("test_data: ",test_data)
  },
  async checkSave(coinId){
    const data = await whetherIsSave(this.data.userInfo.openId,coinId);
    console.log(data)
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
  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad(options) {
    let data = await classifyRequest();
    console.log("data.class_story: ",data.class_story)
    this.setData({
      categories: data.class
    })
    let index = this.data.categories[0].class_id;
    data = await CoinsResource(index);
    console.log(data.coins)
    this.setData({
      items: data.coins,
      introduce: data.class_story.class_story,
      selectedIndex: index
    })
    console.log("items: ",this.data.items);
    console.log("introduce: ",this.data.introduce);
    // this.setData({
    //   items: data.items,
    //   introduce: data.introduce
    // })
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