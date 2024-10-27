// export const baseUrl = 'http://gz.nacldragon.top:38234'
export const baseUrl = 'http://8.138.127.46:5000'

export const sendUsername = async (username, openId) => {
  return new Promise((resolve, reject) => {
    wx.request({
      method: 'POST',
      url: `${baseUrl}/username`,  // 后端服务器地址
      data: {
        username: username,
        openId: openId
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

export const getHistory = async ()=>{
  return new Promise ((resolve,reject) => {
    wx.request({
      method: 'POST',
      url: `${baseUrl}/history`,
      header: {
        'content-type': 'application/json' // 指定请求数据格式为 JSON
      },
      success: res => {
        resolve(JSON.parse(res.data))
      },
      
      fail: error => {
        reject(error)
      },
    })
  })
}

export const sendSave = async (idList) =>{ // 收藏
  return new Promise ((resolve,reject) =>{
    wx.request({
      method: 'POST',
      url: `${baseUrl}/save`,
      data:{
        ID:idList
      },
      success: res => {
        resolve(JSON.parse(res.data))
        console.log("sendSaveBack:",res.data)
      },
      
      fail: error => {
        reject(error)
      },
    })
  })
}
export const configRequest = async () => {
  return new Promise((resolve, reject) => {
    wx.request({
      method: 'POST',
      url: `${baseUrl}/config`,
      header: {
        'content-type': 'application/json' // 指定请求数据格式为 JSON
      },
      success: res => {
        resolve(res.data)
      },
      
      fail: error => {
        reject(error)
      },
    })
  })
}

export const uploadImageRequest = async (filePath_1, filePath_2) => {
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

export const detailRequest = async (name) => { //已知钱币名称获取钱币具体信息
  return new Promise((resolve, reject) => {
    wx.request({
      method: 'post',
      url: `${baseUrl}/detail`,
      data:{
        Name:name
      },
      success: res => {
        resolve(res.data)
      },
      fail: error => {
        reject(error)
      },
    })
  })
}

export const historyRequest = async () => { //已知钱币名称获取钱币具体信息
  return new Promise((resolve, reject) => {
    wx.request({
      method: 'post',
      url: `${baseUrl}/history`,
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

export const saveRequest = async () => { //已知钱币名称获取钱币具体信息
  return new Promise((resolve, reject) => {
    wx.request({
      method: 'post',
      url: `${baseUrl}/save`,
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

export const classifyRequest = async (index) => { //分类信息
  return new Promise((resolve, reject) => {
    wx.request({
      method: 'post',
      url: `${baseUrl}/classify`,
      data:{
        Index:index
      },
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