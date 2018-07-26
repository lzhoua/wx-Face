let app = getApp()

// const url = 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1531117436906&di=e98e0593fbf106d2a805f1376dff468e&imgtype=0&src=http%3A%2F%2Ff.hiphotos.baidu.com%2Fzhidao%2Fpic%2Fitem%2F8601a18b87d6277f831ff2b22c381f30e924fc2f.jpg'
// const url = 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1531117371100&di=777c11f5860e4e945f768b430faf8325&imgtype=0&src=http%3A%2F%2Fimg3.duitang.com%2Fuploads%2Fitem%2F201510%2F11%2F20151011161012_5HZia.thumb.700_0.jpeg'
const url = 'https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=1270927438,3552653667&fm=11&gp=0.jpg'
// const url = 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1531112355673&di=d5e6c10aa7c361852377eacc94bcfa03&imgtype=0&src=http%3A%2F%2Fpic1.zhimg.com%2Fv2-589959691d0b0b07aeccd4ba89f7f3d0_b.jpg'
const apiKey = 'RfBOgPr1mAZTo3NjUawqyjITuPiOB3eD'
const apiSecret = 'GILdu2nioI9uSVM2mK_b2AHBchkCKj2L'

let page = {
  data: {
    url: url,
    resultImage: '', // 最终返回的图片地址
    imgWidth: 0,  // 上传图片的原始宽度
    imgHeight: 0, // 上传图片的原始高度
    widthReturn: 720, // 设置返回图片宽度
    heightReturn: 480, // 设置返回图片高度
    faceSize: 200 // 设置人脸的大小
  },
  onLoad () {
    this.imageInfo()
  }
}

let custom = {
  // 人脸识别
  getFaceInfo () {
    console.log(1212121, this.data.imgHeight)
    let _this = this
    wx.request({
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      url: 'https://api-cn.faceplusplus.com/facepp/v3/detect',
      data: {
        api_key: apiKey,
        api_secret: apiSecret,
        image_url: url
      },
      success: function (res) {
        console.log(res.data.faces[0].face_rectangle)
        let info = res.data.faces[0].face_rectangle
        let faceSize = _this.data.faceSize
        // 人脸超出设置的尺寸
        if (info.width >= faceSize) {
          // 算出缩放后比例
          let [widthDiff, heightDiff] = [
            faceSize / info.width,
            faceSize / info.height
          ]
          _this.setData({
            imgWidth: _this.data.imgWidth * widthDiff,
            imgHeight: _this.data.imgHeight * heightDiff,
          })
          info.top = info.top * widthDiff
          info.left = info.left * widthDiff
          info.width = faceSize
          info.height = faceSize
        } else if (info.width < 150) {
          // 算出缩放后比例
          let [widthDiff, heightDiff] = [
            faceSize / info.width,
            faceSize / info.height
          ]
          _this.setData({
            imgWidth: _this.data.imgWidth * widthDiff,
            imgHeight: _this.data.imgHeight * heightDiff,
          })
          info.top = info.top * widthDiff
          info.left = info.left * widthDiff
          info.width = faceSize
          info.height = faceSize
        }
        // 计算人脸到顶部和坐边的距离
        let widthLen= (_this.data.widthReturn - info.width) / 2 - info.left
        let heightLen = (_this.data.heightReturn - info.height) /2 - info.top
        // 人脸框四个角的坐标
        let[x1, x2, y1, y2] = [
          info.left + widthLen,
          info.left + info.width + widthLen,
          info.top + heightLen,
          info.top + info.height + heightLen
        ]
        console.log('------>', x1, x2, y1, y2)
        _this.drawCanvas(x1, x2, y1, y2,  widthLen, heightLen)
      }
    })
  },
  // 画布上画图
  drawCanvas (x1, x2, y1, y2, widthLen, heightLen) {
    let _this = this
    let ctx = wx.createCanvasContext('canvas')
    let data = this.data
    ctx.drawImage(url, widthLen, heightLen, this.data.imgWidth, this.data.imgHeight)
    // 画十字架
    ctx.setStrokeStyle('red')
    ctx.moveTo(0, data.heightReturn / 2)
    ctx.lineTo(data.widthReturn, data.heightReturn / 2)
    ctx.moveTo(data.widthReturn / 2, 0)
    ctx.lineTo(data.widthReturn / 2, data.heightReturn)
    ctx.moveTo(x1, y1)
    ctx.lineTo(x2, y1)
    ctx.lineTo(x2, y2)
    ctx.lineTo(x1, y2)
    ctx.lineTo(x1, y1)
    ctx.stroke()
    ctx.draw(false, () => {
      console.log(101010101010)
      _this.cutImage()
    })
  },
  // 截图
  cutImage () {
    let _this = this
    let [width, height] = [
      this.data.widthReturn,
      this.data.heightReturn
    ]
    wx.canvasToTempFilePath({
      x: 0,
      y: 0,
      width: width,
      height: height,
      destWidth: width,
      destHeight: height,
      fileType: 'jpg',
      canvasId: 'canvas',
      success: function (res) {
        console.log('====', res.tempFilePath)
        _this.setData({
          resultImage: res.tempFilePath
        })
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath
        })
      }
    })
  },
  // 得到图片信息
  imageInfo () {
    let _this = this
    wx.getImageInfo({
      src: url,
      success: function (res) {
        _this.setData({
          imgWidth: res.width,
          imgHeight: res.height
        })
        // _this.drawCanvas()
      }
    })
  }
}

Page(Object.assign(page, custom))
