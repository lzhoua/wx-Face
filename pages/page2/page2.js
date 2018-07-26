// const app = getApp()
const url1 = 'http://p2.qhimgs4.com/t01a4fff1fc1124e29c.jpg'
const url2 = 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1531229290628&di=9a561ed17dd9a3fe2c4716e4c9c4c1ca&imgtype=0&src=http%3A%2F%2Fnpic7.edushi.com%2Fcn%2Fzixun%2Fzh-chs%2F2017-07%2F27%2F4052919-6_20170727080729_p8pyy.png'
const apiKey = 'RfBOgPr1mAZTo3NjUawqyjITuPiOB3eD'
const apiSecret = 'GILdu2nioI9uSVM2mK_b2AHBchkCKj2L'
let page = {
  data: {
    url1: url1,
    url2: url2,
    result: ''
  },
  // onLoad: function () {},
  // onReady: function () {},
  // onShow: function () {},
  // onHide: function () {},
  // onUnload: function () {}
}
let custom = {
  clickOn () {
    let _this = this
    this.getModeInfo()
    .then((info) => {
      console.log(info)
      wx.request({
        method: 'POST',
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        url: 'https://api-cn.faceplusplus.com/imagepp/v1/mergeface',
        data: {
          api_key: apiKey,
          api_secret: apiSecret,
          template_url: url1,
          template_rectangle: info,
          merge_url: url2,
          merge_rate: 100
        },
        success: function(res) {
          console.log('------>', res.data)
          _this.setData({
            result: res.data.result
          })
        }
      })
    })
  },
  getModeInfo () {
    return new Promise((resolve) => {
      wx.request({
        method: 'POST',
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        url: 'https://api-cn.faceplusplus.com/facepp/v3/detect',
        data: {
          api_key: apiKey,
          api_secret: apiSecret,
          image_url: url1
        },
        success: function (res) {
          console.log(res.data.faces[0].face_rectangle)
          let info = res.data.faces[0].face_rectangle
          let result = `${info.top},${info.left},${info.width},${info.height}`
          resolve(result)
        }
      })
    })
  }
}
Page(Object.assign(page, custom))