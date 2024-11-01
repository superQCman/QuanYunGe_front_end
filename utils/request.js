// export const baseUrl = 'http://gz.nacldragon.top:38234'
export const baseUrl = 'https://www.policy-scut.cn'

export const sendUsername = async (username, openId) => {
  return new Promise((resolve, reject) => {
    wx.request({
      method: 'POST',
      url: `${baseUrl}/user/${openId}`,  // 后端服务器地址
      data: {
        name: username,
      },
      header: {
        'content-type': 'application/json' // 指定请求数据格式为 JSON
      },
      success: res => {
        resolve(res.data);
      },
      fail: error => {
        reject(error);
      },
    });
  });
};

export const uploadImageRequest = async (openId,filePath_1, filePath_2) => {
  return new Promise((resolve, reject) => {
    const fileSystemManager = wx.getFileSystemManager();

    // 读取文件并转换为Base64
    const image1Base64 = fileSystemManager.readFileSync(filePath_1, 'base64');
    const image2Base64 = fileSystemManager.readFileSync(filePath_2, 'base64');

    // 使用 wx.request 发送POST请求，包含Base64数据
    wx.request({
      url: `${baseUrl}/uploadImage`,
      method: 'POST',
      data: {
        openId: openId,
        image1: image1Base64,
        image2: image2Base64
      },
      header: {
        'Content-Type': 'application/json' // 设置为JSON格式
      },
      success: (res) => {
        resolve(res.data);
      },
      fail: (error) => {
        reject(error);
      }
    });
  });
};


export const downloadImage = (fileName) => {
  return new Promise((resolve, reject) => {
    wx.downloadFile({
      url: `${baseUrl}/downloadImage/${fileName}`, // 服务器上的图片地址
      success: res => {
        if (res.statusCode === 200) {
          resolve(res.tempFilePath); // 返回下载到本地的临时文件路径
          console.log("tempFilePath: ",res.tempFilePath)
        } else {
          reject(`Download failed with status code: ${res.statusCode}`);
        }
      },
      fail: error => {
        console.error("Download failed:", error); // 打印错误信息
        reject(error); // 处理下载失败的情况
      }
    });
  });
};

export const detailRequest = async (coinId) => { //已知钱币名称获取钱币具体信息
  return new Promise((resolve, reject) => {
    wx.request({
      method: 'get',
      url: `${baseUrl}/coins/${coinId}`,
      success: res => {
        resolve(res.data)
      },
      fail: error => {
        reject(error)
      },
    })
  })
}

export const historyRequest = async (openId) => { //已知钱币名称获取钱币具体信息
  return new Promise((resolve, reject) => {
    wx.request({
      method: 'post',
      url: `${baseUrl}/history`,
      data:{
        openId:openId
      },
      success: res => {
        resolve(res.data)
        console.log("history:",res.data)
      },
      fail: error => {
        reject(error)
      },
    })
  })
}

export const saveRequest = async (openId) => { //获取收藏信息
  return new Promise((resolve, reject) => {
    wx.request({
      method: 'get',
      url: `${baseUrl}/favorites/${openId}`,
      success: res => {
        resolve(res.data)
      },
      fail: error => {
        reject(error)
      },
    })
  })
}

export const whetherIsSave = async (openId,coinId) => { //获取收藏信息
  return new Promise((resolve, reject) => {
    wx.request({
      method: 'get',
      url: `${baseUrl}/favorite/${openId}/${coinId}`,
      success: res => {
        resolve(res.data)
      },
      fail: error => {
        reject(error)
      },
    })
  })
}

export const classifyRequest = async () => { //分类信息
  return new Promise((resolve, reject) => {
    wx.request({
      method: 'GET',
      url: `${baseUrl}/class`,
      success: res => {
        resolve(res.data)
        console.log("classify: ",res.data)
      },
      fail: error => {
        reject(error)
      },
    })
  })
}

export const CoinsResource = async (index) => { //分类信息
  return new Promise((resolve, reject) => {
    wx.request({
      method: 'GET',
      url: `${baseUrl}/class/${index}`,
      success: res => {
        resolve(res.data)
        console.log("CoinsResource: ",res.data)
      },
      fail: error => {
        reject(error)
      },
    })
  })
}

export const savePost = async (openId,coinId) => { //发送保存
  return new Promise((resolve, reject) => {
    wx.request({
      method: 'post',
      url: `${baseUrl}/favorite/${openId}/${coinId}`,
      success: res => {
        resolve(res.data)
        console.log(res.data)
        wx.showModal({
          title: '提示',
          content: '收藏成功',
          showCancel: false, // 不显示取消按钮
          confirmText: '确定' // 确认按钮文字
        });
      },
      fail: error => {
        reject(error)
      },
    })
  })
}

export const saveDelete = async (openId,coinId) => { //发送保存
  return new Promise((resolve, reject) => {
    wx.request({
      method: 'delete',
      url: `${baseUrl}/favorite/${openId}/${coinId}`,
      success: res => {
        resolve(res.data)
        console.log(res.data)
        wx.showModal({
          title: '提示',
          content: '取消收藏',
          showCancel: false, // 不显示取消按钮
          confirmText: '确定' // 确认按钮文字
        });
      },
      fail: error => {
        reject(error)
      },
    })
  })
}


export const dynastyRequest = async (index) => { //朝代介绍
  return new Promise((resolve, reject) => {
    wx.request({
      method: 'get',
      url: `${baseUrl}/dynasty`,
      data:{
        Index:index
      },
      success: res => {
        resolve(res.data)
        console.log("article:",res.data)
      },
      fail: error => {
        reject(error)
      },
    })
  })
}