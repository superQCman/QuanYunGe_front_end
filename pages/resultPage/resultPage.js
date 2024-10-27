import { uploadImageRequest, articleRequest } from '../../utils/request.js'
import { setColor } from '../../utils/color.js'
import {color} from '../../utils/color'

const app = getApp()
Page({
  data: {
    animationMain: null, //正面
    animationBack: null, //背面
    tempImagePath: '',
    color: [],
    isLoading: true,
    archi: [],
    detectName : '',
    detectID : ''
  },
  onLoad: function (e) {
    this.setData({
      tempImagePath: e.tempImagePath[0],
      color: color
    })
    console.log("")
    this.handleUploadImage(this.tempImagePath)
  },
  async handleUploadImage() {
    try {
      const data = await uploadImageRequest(this.data.tempImagePath)
      console.log(data.data.archi);
      this.setData({
        isLoading: false,
        archi: data.data.archi
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
  async clickBuildingButton(e) {
    let id = e.currentTarget.dataset.id
    try {
      const data=await articleRequest(id)
      this.animation_main = wx.createAnimation({
        duration: 400,
        timingFunction: 'linear'
      })
      this.animation_back = wx.createAnimation({
        duration: 400,
        timingFunction: 'linear'
      })
      this.animation_main.rotateY(0).step()
      this.animation_back.rotateY(-180).step()
      console.log("article:",data.data);
      this.setData({
        animationMain: this.animation_main.export(),
        animationBack: this.animation_back.export(),
        article:data.data
      })
    }  catch (error) {
      wx.showToast({
        title: '错误请求',
        duration: 2000,
        icon:"error"
      })
    }

  },
  clickArticleBack(e) {
    console.log("click back");
    this.animation_main = wx.createAnimation({
      duration: 400,
      timingFunction: 'linear'
    })
    this.animation_back = wx.createAnimation({
      duration: 400,
      timingFunction: 'linear'
    })
    this.animation_main.rotateY(180).step()
    this.animation_back.rotateY(0).step()
    this.setData({
      animationMain: this.animation_main.export(),
      animationBack: this.animation_back.export(),
    })
  },
  // rotateFn(e) {
  //   this.animation_main = wx.createAnimation({
  //     duration: 400,
  //     timingFunction: 'linear'
  //   })
  //   this.animation_back = wx.createAnimation({
  //     duration: 400,
  //     timingFunction: 'linear'
  //   })
  //   if (id == 1) {
  //     this.animation_main.rotateY(180).step()
  //     this.animation_back.rotateY(0).step()
  //     this.setData({
  //       animationMain: this.animation_main.export(),
  //       animationBack: this.animation_back.export(),
  //     })
  //   }
  //   // 点击文章的返回
  //   else {
  //     this.animation_main.rotateY(0).step()
  //     this.animation_back.rotateY(-180).step()
  //     this.setData({
  //       animationMain: this.animation_main.export(),
  //       animationBack: this.animation_back.export(),
  //     })
  //   }
  // },
})