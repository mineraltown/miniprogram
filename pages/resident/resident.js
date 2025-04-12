// pages/resident/resident.js
const app = getApp()

Page({

    /**
     * 页面的初始数据
     */
    data: {
        url: app.globalData.url,
        version: app.globalData.version,
        resident: {}
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        const that = this
        wx.request({
            url: that.data.url + 'resident/' + that.data.version + "/" + options.id,
            header: {
                'content-type': 'application/json'
            },
            success(res) {
                console.log(res.data)
                if (res.statusCode === 200) {
                    that.setData({
                        resident: res.data,
                    })
                    wx.setNavigationBarTitle({
                        title: res.data.name.cn
                    })
                } else {
                    that.setData({
                        resident: {},
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