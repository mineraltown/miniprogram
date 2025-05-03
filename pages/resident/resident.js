// pages/resident/resident.js
const app = getApp()

Page({

    /**
     * 页面的初始数据
     */
    data: {
        url: app.globalData.url,
        name: "",
        photo: "",
        html: "",
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        const that = this
        wx.request({
            url: that.data.url + 'resident/' + options.version + "/" + options.id,
            header: {
                'content-type': 'application/json'
            },
            success(res) {
                if (res.statusCode === 200) {
                    that.setData({
                        name: res.data.name,
                        photo: that.data.url + res.data.photo,
                        html: res.data.html,
                    })
                    wx.setNavigationBarTitle({
                        title: res.data.name.cn
                    })
                } else {
                    that.setData({
                        html: "<p style='text-align: center;'>数据加载失败</p>",
                    })
                }
            }
        })
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {

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

    }
})