// pages/wiki/index.js
const app = getApp()

Page({

    /**
     * 页面的初始数据
     */
    data: {
        url: app.globalData.url,
        version: app.globalData.version,
        cover: wx.setStorageSync("cover"),
        wiki: wx.getStorageSync("wiki")
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        this.LoadMenu()
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {},

    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {
        if (this.data.version != app.globalData.version) {
            this.setData({
                version: app.globalData.version
            })
            this.LoadMenu()
        }
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage() {

    },
    LoadMenu() {
        const that = this
        wx.showLoading({
            title: '加载目录...'
        })
        wx.request({
            url: that.data.url + 'menu/' + that.data.version,
            header: {
                'content-type': 'application/json'
            },
            success(res) {
                if (res.statusCode === 200) {
                    wx.setStorageSync("cover", res.data.cover)
                    wx.setStorageSync("wiki", res.data.wiki)
                    that.setData({
                        cover: res.data.cover,
                        wiki: res.data.wiki,
                    })
                } else {
                    wx.setStorageSync("cover", "")
                    wx.setStorageSync("wiki", {})
                    that.setData({
                        cover: "",
                        wiki: {},
                    })
                }
            },
            complete: () => wx.hideLoading()
        })
    }
})