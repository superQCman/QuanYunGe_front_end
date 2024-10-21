import {baseUrl} from '../../utils/request'
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    article: {
      type: Object,
      value: {}
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    baseUrl
  },

  /**
   * 组件的方法列表
   */
  methods: {
    back() {
      this.triggerEvent('back')
    }
  }
})