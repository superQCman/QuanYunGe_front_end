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

export const uploadImageRequest = async (filePath) => {
  return new Promise((resolve, reject) => {
    wx.uploadFile({
      filePath,
      name: 'image',
      method: 'POST',
      url: `${baseUrl}/uploadImage`,
      success: res => {
        resolve(JSON.parse(res.data))
        // resolve(res.data)
      },
      fail: error => {
        reject(error)
      },
    })
  })
}
export const articleRequest = async (id) => {
  return new Promise((resolve, reject) => {
    wx.request({
      method: 'get',
      url: `${baseUrl}/article`,
      data:{
        id
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
