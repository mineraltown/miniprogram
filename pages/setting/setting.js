// pages/setting/setting.js
const app = getApp() // app.js > globalData

Page({

    /**
     * 页面的初始数据
     */
    data: {
        v: app.globalData.version,
        index: 0,
        version: [],
        todo: false,
        season: {
            "mineraltown": [
                ["春", "夏", "秋", "冬"], 30
            ],
            "saikai": [
                ["春", "夏", "秋", "冬"], 30
            ],
            "bazaar": [
                ["春", "夏", "秋", "冬"], 31
            ],
            "grabaza": [
            ["春", "夏", "秋", "冬"], 31
            ],
            // "welcome": [
            //     ["郁金香", "胡椒", "琥珀", "靛蓝"], 10
            // ],
        },
        year: 1, // 年
        month: 0, // 月（0-3）
        day: 1, // 日（1-30）
        advance_day: wx.getStorageSync("advance"), // 提前提醒天数
        name: wx.getStorageSync("name"), // 昵称
        birthday_month: 0, // 生日（月）
        birthday_day: 1, // 生日（日）
        day_list: [], // 日期选择器列表
        advance_list: [], // 提前提醒选择器列表
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        const that = this
        // 获取版本
        wx.showLoading({
            mask: true,
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
                    var picker = []
                    for (var i in res.data) {
                        picker.push({
                            label: res.data[i],
                            value: i,
                        })
                    }
                    for (var i in picker) {
                        if (picker[i].value == app.globalData.version) {
                            that.setData({
                                version: picker,
                                index: i
                            })
                            break
                        }
                    }
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
        // 判断当前版本是否存在提醒功能
        if (this.data.season[this.data.v] !== undefined) {
            this.initialization()
        } else {
            this.localStorage_to_data()
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
    // 存档
    data_to_localStorage() {
        wx.setStorageSync(this.data.v, {
            year: this.data.year,
            month: this.data.month,
            day: this.data.day,
            birthday_month: this.data.birthday_month,
            birthday_day: this.data.birthday_day,
        })
    },
    // 读档
    localStorage_to_data() {
        var d = wx.getStorageSync(this.data.v)
        this.setData({
            year: d.year,
            month: d.month,
            day: d.day,
            birthday_month: d.birthday_month,
            birthday_day: d.birthday_day,
        })
    },
    // 修改游戏版本
    changeVersion(e) {
        app.setVersion(this.data.version[e.detail.value].value)
        this.setData({
            index: e.detail.value,
            v: this.data.version[e.detail.value].value,
        })
        // 判断当前版本是否存在提醒功能
        if (this.data.season[this.data.v] !== undefined) {
            this.initialization()
        }
    },
    // 修改昵称
    changeName(e) {
        const that = this
        wx.showModal({
            title: '修改昵称',
            editable: true,
            content: that.data.name,
            success(res) {
                if (res.confirm) {
                    wx.setStorageSync("name", res.content)
                    that.setData({
                        name: res.content,
                    })
                }
            }
        })
    },
    // 修改生日
    birthdayMultiPickerChange(e) {
        this.setData({
            birthday_month: e.detail.value[0],
            birthday_day: e.detail.value[1] + 1,
        })
        this.data_to_localStorage()
    },
    // 修改游戏时间（年）
    changeYear(e) {
        const that = this
        wx.showModal({
            title: '修改游戏时间（年）',
            editable: true,
            content: that.data.year.toString(),
            success(res) {
                if (res.confirm) {
                    if (!isNaN(res.content) && res.content !== '' && res.content !== null && res.content !== undefined) {
                        var n = parseInt(res.content)
                        if (n > 0) {
                            that.setData({
                                year: n,
                            })
                            that.data_to_localStorage()
                        }
                    }
                }
            }
        })
    },
    // 修改游戏时间（月/日）
    dayMultiPickerChange(e) {
        this.setData({
            month: e.detail.value[0],
            day: e.detail.value[1] + 1,
        })
        this.data_to_localStorage()
    },
    // 修改提前提醒天数
    changeAdvance(e) {
        wx.setStorageSync("advance", e.detail.value)
        this.setData({
            advance_day: e.detail.value,
        })
    },
    // 初始化数据
    initialization() {
        const that = this
        // 读档
        if (!wx.getStorageSync(that.data.v)) {
            console.log("初始化")
            wx.setStorageSync(that.data.v, {
                year: 1,
                month: 0,
                day: 1,
                birthday_month: 0,
                birthday_day: 1,
            })
        } else {
            this.localStorage_to_data()
        }
        // 生成季节列表
        that.setData({
            day_list: Array.from({
                length: that.data.season[that.data.v][1]
            }, (_, i) => i + 1)
        })
        // 生成提前提醒天数列表
        let advance_list = []
        for (let i = 0; i <= 7; i++) {
            if (i == 0) {
                advance_list.push({
                    label: '不提醒',
                    value: i,
                })
            } else {
                advance_list.push({
                    label: i + ' 天',
                    value: i,
                })
            }
        }
        that.setData({
            advance_list: advance_list,
        })
    }
})