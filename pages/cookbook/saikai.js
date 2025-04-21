// pages/cookbook/saikai.js
const app = getApp()

Page({

    /**
     * 页面的初始数据
     */
    data: {
        url: app.globalData.url,
        raw: [], // 菜谱:完整
        list: [], // 菜谱:显示
        replacementMap: {}, // 替换
        search: "", // 检索
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        const that = this
        wx.request({
            url: app.globalData.url + "replacementMap",
            header: {
                'content-type': 'application/json'
            },
            success(res) {
                that.setData({
                    replacementMap: res.data,
                })
            }
        })
        wx.request({
            url: app.globalData.url + "saikai" + '/cookbook',
            header: {
                'content-type': 'application/json'
            },
            success(res) {
                that.setData({
                    raw: res.data,
                    list: res.data,
                })
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

    },
    input_search(e) {
        // 使用字典完成名词替换
        let r = this.data.replacementMap[e.detail.value] || e.detail.value
        this.setData({
            search: r
        })
    },
    search_cookbook() {
        // 清空菜谱
        let l = []
        // 循环完整菜谱，向显示菜谱增加匹配到的结果
        for (let i of this.data.raw) {
            if (i.name.includes(this.data.search)) {
                l.push(i)
            } else if (i.ingredients.some(item => item.includes(this.data.search))) {
                l.push(i)
            }
        }
        this.setData({
            list: l
        })
    },
})