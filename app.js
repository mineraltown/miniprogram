// app.js
App({
    globalData: {
        url: "https://api.mineraltown.net/",
        version: "saikai",
    },
    // 小程序初始化完成时触发，全局只触发一次。
    onLaunch() {
        if (wx.getStorageSync("version")) {
            this.globalData.version = wx.getStorageSync("version")
        } else {
            wx.setStorageSync("version", this.globalData.version)
        }
        if (!wx.getStorageSync("advance")) {
            wx.setStorageSync("advance", 3)
        }
    },
    // 监听小程序启动或切前台。
    onShow() {
        this.globalData.version = wx.getStorageSync("version")
    },
    setVersion(version) {
        this.globalData.version = version
        wx.setStorageSync("version", version)
    }
})