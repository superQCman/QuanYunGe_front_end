module.exports = Behavior({
  properties: {

  },
  data: {
    // 获取胶囊高度
    backButtonStyle: `
    top:${wx.getMenuButtonBoundingClientRect().top}px;
    height:${wx.getMenuButtonBoundingClientRect().height}px;
    position:absolute;
    line-height:${wx.getMenuButtonBoundingClientRect().height}px;
  `,
    backBlockMarginTop: `
    margin-top:${wx.getMenuButtonBoundingClientRect().top+wx.getMenuButtonBoundingClientRect().height}px;
    `
  },
  created: function () {

  },
  attached: function () {},
  ready: function () {},
  moved: function () {},
  detached: function () {},
  methods: {

  }
})