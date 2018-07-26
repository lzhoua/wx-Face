let app = getApp ()

let page = {
  data: {},
  onLoad () {}
}

let custom = {
  todo () {
    console.log(23423423423)
  }
}

Page(Object.assign(page, custom))