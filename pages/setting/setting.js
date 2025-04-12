// pages/setting/setting.js
const app = getApp() // app.js > globalData

Page({

    /**
     * 页面的初始数据
     */
    data: {
        index: 0,
        version: [],
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        const that = this
        wx.showLoading({
            title: '获取版本...'
        })
        wx.request({
            url: app.globalData.url + 'menu/',
            header: {
                'content-type': 'application/json'
            },
            success(res) {
                if (res.statusCode === 200) {
                    // 生成版本列表，用于picker
                    let p = []
                    for (let i in res.data) {
                        p.push({
                            label: res.data[i],
                            value: i,
                        })
                    }
                    that.setData({
                        version: p
                    })
                }
            },
            complete: () => wx.hideLoading()
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