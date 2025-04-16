// pages/fish/saikai.js
const app = getApp()

Page({

    /**
     * 页面的初始数据
     */
    data: {
        url: app.globalData.url,
        raw: [], // 鱼图鉴:完整
        list: [], // 鱼图鉴:显示
        season: {
            spring: true,
            summer: true,
            autumn: true,
            winter: true
        },
        ground: {
            "海边": true,
            "湖边": true,
            "泉水": true,
            "上游": true,
            "下游": true,
            "池塘": true,
            "温泉": true,
            "地底湖": true,
        },
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        const that = this
        wx.request({
            url: app.globalData.url + "saikai" + '/fish',
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
    filter() {
        // 按选中项过滤
        let l = []
        // 循环完整列表
        for (let x in this.data.raw) {
            // 循环匹配选中季节
            for (let z in this.data.season) {
                if (this.data.season[z] && this.data.raw[x].season[z] != 0) {
                    // 循环匹配选中地点
                    for (let y in this.data.ground) {
                        if (this.data.ground[y] && this.data.raw[x].location.includes(y)) {
                            l.push(this.data.raw[x])
                            break
                        } else if (this.data.raw[x].trash) {
                            // 垃圾全年存在
                            l.push(this.data.raw[x])
                            break
                        }
                    }
                    break
                }
            }
        }
        this.setData({
            list: l,
        })
    },
    change_season(event) {
        const season = event.currentTarget.dataset.season;
        let s = this.data.season
        s[season] = !s[season]
        this.setData({
            season: s,
        })
        this.filter()
    },
    change_ground(event) {
        const ground = event.currentTarget.dataset.ground;
        let s = this.data.ground
        s[ground] = !s[ground]
        this.setData({
            ground: s,
        })
        this.filter()
    },
    reverse(event) {
        const e = event.currentTarget.dataset.mode
        const all = event.currentTarget.dataset.all
        if (e == "season") {
            let s = this.data.season
            for (let n in s) {
                if (all == "t") {
                    s[n] = true
                } else {
                    s[n] = !s[n]
                }
            }
            this.setData({
                season: s,
            })
        } else if (e == "ground") {
            let s = this.data.ground
            for (let n in s) {
                if (all == "t") {
                    s[n] = true
                } else {
                    s[n] = !s[n]
                }
            }
            this.setData({
                ground: s,
            })
        }
        this.filter()
    }
})