// pages/crop/crop.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    activeCorner: '',
    clipBoxBeforeScalePageX: 0,
    clipBoxBeforeScalePageY: 0,
    clipBoxBeforeScaleClipX: 0,
    clipBoxBeforeScaleClipY: 0,
    clipBoxBeforeScaleWidth: 0,
    clipBoxBeforeScaleHeight: 0,
    imagePath: '',
    panelWidth: 0,
    panelHeight: 0,
    clipWidth: 0,
    clipHeight: 0,
    clipX: 0,
    clipY: 0,
    clipImgX: 0,
    clipImgY: 0,
    croppingImageWidth: 0,
    croppingImageHeight: 0,
    xScale: 1,
    yScale: 1,
    isCropped: false
  },
  back() {
    wx.navigateBack({})
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    
    const imagePath = options.ImagePath_1;
    this.setData({ imagePath });

    // 获取图片信息，计算面板和裁剪框的尺寸
    wx.getImageInfo({
      src: imagePath,
      success: (res) => {
        const imgWidth = res.width;
        const imgHeight = res.height;

        // 获取窗口信息
        const { windowWidth, windowHeight } = wx.getWindowInfo();

        // 计算面板尺寸
        let panelW = windowWidth - 20;
        let panelH = windowHeight - 100;

        if (panelH / panelW >= imgHeight / imgWidth) {
          panelH = Math.floor(panelW * imgHeight / imgWidth);
        } else {
          panelW = Math.floor(panelH * imgWidth / imgHeight);
        }

        // 计算缩放比例
        const xScale = panelW / imgWidth;
        const yScale = panelH / imgHeight;

        // 设置数据用于渲染
        this.setData({
          panelWidth: panelW,
          panelHeight: panelH,
          clipWidth: panelW,
          clipHeight: panelH,
          croppingImageWidth: imgWidth,
          croppingImageHeight: imgHeight,
          clipX: 0,
          clipY: 0,
          clipImgX: 0,
          clipImgY: 0,
          xScale,
          yScale
        });
        
      },
      fail: (err) => {
        console.error("Failed to get image info:", err);
      }
    });
  },

  touchstartM(event) {
    const { clipX, clipY } = this.data;
    const { pageX, pageY } = event.touches[0];
    // 获取鼠标点在裁剪框的内部位置信息
    this.setData({
      clipBoxMoveInnerX: pageX - clipX,
      clipBoxMoveInnerY: pageY - clipY
    });
  },

  touchmoveM(event) {
    const { pageX, pageY } = event.touches[0];
    const { panelWidth, panelHeight, clipHeight, clipWidth, clipBoxMoveInnerX, clipBoxMoveInnerY } = this.data;

    // 裁剪框不能脱离面板
    let clipX = pageX - clipBoxMoveInnerX;
    clipX = Math.max(clipX, 0);
    const panelX = panelWidth - clipWidth;
    clipX = Math.min(clipX, panelX);

    let clipY = pageY - clipBoxMoveInnerY;
    clipY = Math.max(clipY, 0);
    const panelY = panelHeight - clipHeight;
    clipY = Math.min(clipY, panelY);

    // 裁剪框底图位置信息
    const clipImgX = 0 - clipX;
    const clipImgY = 0 - clipY;

    this.setData({
      clipX,
      clipY,
      clipImgX,
      clipImgY
    });
  },

  touchstart(event) {
    const dragId = event.currentTarget.dataset.id;
    const { pageX, pageY } = event.touches[0];
    const { clipX, clipY, clipHeight, clipWidth } = this.data;

    // 初始化缩放时临时变量的值
    this.setData({
      activeCorner: dragId,
      clipBoxBeforeScalePageX: pageX,
      clipBoxBeforeScalePageY: pageY,
      clipBoxBeforeScaleClipX: clipX,
      clipBoxBeforeScaleClipY: clipY,
      clipBoxBeforeScaleWidth: clipWidth,
      clipBoxBeforeScaleHeight: clipHeight
    });
  },

  touchmove(event) {
    const { pageX, pageY } = event.touches[0];
    const { panelWidth, panelHeight, clipBoxBeforeScalePageX, clipBoxBeforeScalePageY, clipBoxBeforeScaleWidth, clipBoxBeforeScaleHeight, clipBoxBeforeScaleClipX, clipBoxBeforeScaleClipY, xScale, yScale, activeCorner } = this.data;

    // 缩放在X上的偏移
    const xWidthOffset = this.getScaleXWidthOffset(pageX - clipBoxBeforeScalePageX);
    let clipWidth = Math.max(clipBoxBeforeScaleWidth + xWidthOffset, 36);
    let tempPanelWidth = pageX > clipBoxBeforeScalePageX ? panelWidth - clipBoxBeforeScaleClipX : clipBoxBeforeScaleWidth + clipBoxBeforeScaleClipX;
    clipWidth = Math.min(clipWidth, tempPanelWidth);

    // 缩放在Y上的偏移
    const yHeightOffset = this.getScaleYHeightOffset(pageY - clipBoxBeforeScalePageY);
    let clipHeight = Math.max(clipBoxBeforeScaleHeight + yHeightOffset, 36);
    let tempPanelHeight = pageY > clipBoxBeforeScalePageY ? panelHeight - clipBoxBeforeScaleClipY : clipBoxBeforeScaleHeight + clipBoxBeforeScaleClipY;
    clipHeight = Math.min(clipHeight, tempPanelHeight);

    // 裁剪框位置信息
    let clipX = this.getClipX(clipWidth);
    let clipY = this.getClipY(clipHeight);
    let clipImgX = 0 - clipX;
    let clipImgY = 0 - clipY;

    this.setData({
      clipWidth,
      clipHeight,
      clipX,
      clipY,
      clipImgX,
      clipImgY,
      croppingImageWidth: parseInt(clipWidth / xScale),
      croppingImageHeight: parseInt(clipHeight / yScale)
    });
  },

  // 处理缩放动作中不同corner时的尺寸位置信息
  getClipX(clipWidth) {
    const { activeCorner, clipBoxBeforeScaleClipX, clipBoxBeforeScaleWidth } = this.data;
    switch (activeCorner) {
      case 'leftTop':
      case 'leftBottom':
        return clipBoxBeforeScaleClipX + (clipBoxBeforeScaleWidth - clipWidth);
      case 'rightTop':
      case 'rightBottom':
        return clipBoxBeforeScaleClipX;
      default:
        return 0;
    }
  },

  getClipY(clipHeight) {
    const { activeCorner, clipBoxBeforeScaleClipY, clipBoxBeforeScaleHeight } = this.data;
    switch (activeCorner) {
      case 'leftTop':
      case 'rightTop':
        return clipBoxBeforeScaleClipY + (clipBoxBeforeScaleHeight - clipHeight);
      case 'leftBottom':
      case 'rightBottom':
        return clipBoxBeforeScaleClipY;
      default:
        return 0;
    }
  },

  getScaleXWidthOffset(offsetW) {
    const { activeCorner } = this.data;
    switch (activeCorner) {
      case 'leftTop':
      case 'leftBottom':
        return -offsetW;
      case 'rightTop':
      case 'rightBottom':
        return offsetW;
      default:
        return 0;
    }
  },

  getScaleYHeightOffset(offsetH) {
    const { activeCorner } = this.data;
    switch (activeCorner) {
      case 'rightBottom':
      case 'leftBottom':
        return offsetH;
      case 'rightTop':
      case 'leftTop':
        return -offsetH;
      default:
        return 0;
    }
  },

  // Function to trigger cropping
  cropImage() {
    wx.showLoading({ title: '正在裁剪...' });

    const { imagePath, croppingImageWidth, croppingImageHeight, clipImgX, clipImgY, xScale, yScale } = this.data;
    const query = wx.createSelectorQuery();

    // 选择 `canvas` 节点并获取绘图上下文
    query.select('#main')
      .node()
      .exec((res) => {
        if (!res[0] || !res[0].node) {
          wx.hideLoading();
          console.error("Canvas node not found");
          return;
        }
        const canvas = res[0].node;
        const ctx = canvas.getContext('2d');

        // 设置 Canvas 尺寸
        canvas.width = croppingImageWidth;
        canvas.height = croppingImageHeight;

        // 清除画布
        ctx.clearRect(0, 0, croppingImageWidth, croppingImageHeight);

        // 计算裁剪区域的坐标和尺寸
        const width = croppingImageWidth;
        const height = croppingImageHeight;
        const xPos = Math.abs(clipImgX / xScale);
        const yPos = Math.abs(clipImgY / yScale);

        // 加载并绘制图片
        const img = canvas.createImage();
        img.src = imagePath;
        img.onload = () => {
          // 将图片绘制到裁剪区域
          ctx.drawImage(img, xPos, yPos, width, height, 0, 0, width, height);

          // 导出裁剪后的图像
          setTimeout(() => {
            wx.canvasToTempFilePath({
              x: 0,
              y: 0,
              width,
              height,
              destWidth: width,
              destHeight: height,
              canvas: canvas,
              success: (canRes) => {
                wx.hideLoading();
                this.setData({
                  isCropped:true
                })
                // Navigate to the next page with the cropped image path
                wx.navigateTo({
                  url: `/pages/resultPageNew/resultPageNew?ImagePath_1=${canRes.tempFilePath}`
                });
              },
              fail: (err) => {
                wx.hideLoading();
                console.error('Failed to export cropped image:', err);
              }
            });
          }, 200);
        };

        img.onerror = (error) => {
          wx.hideLoading();
          console.error("Failed to load image:", error);
        };
      });
  },
  
});
