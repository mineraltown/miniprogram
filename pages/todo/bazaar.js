// pages/todo/bazaar.js
const app = getApp() // app.js > globalData

Component({

    /**
     * 页面的初始数据
     */
    data: {
        season: [
            ["spring", "春"],
            ["summer", "夏"],
            ["autumn", "秋"],
            ["winter", "冬"],
        ],
        week: ["日", "一", "二", "三", "四", "五", "六"],
        year: 1, // 年
        month: 0, // 月（0-3）
        day: 1, // 日（1-31）
        advance_day: 3, // 提前提醒天数
        name: "", // 昵称
        birthday_month: 0, // 生日（月）
        birthday_day: 1, // 生日（日）
        resident: [], // 居民生日
        festival: [], // 节日
        calendar: [], // 动态日历
    },
    /**
     * 生命周期函数--在组件实例刚刚被创建时执行
     */
    created() {
        const that = this
        this.setData({
            advance_day: wx.getStorageSync("advance"), // 提前提醒天数
            name: wx.getStorageSync("name"), // 昵称
        })

        // 读档
        if (!wx.getStorageSync("bazaar")) {
            console.log("初始化")
            wx.setStorageSync("bazaar", {
                year: 1,
                month: 0,
                day: 1,
                birthday_month: 0,
                birthday_day: 1,
            })
        } else {
            var d = wx.getStorageSync("bazaar")
            this.setData({
                year: d.year,
                month: d.month,
                day: d.day,
                birthday_month: d.birthday_month,
                birthday_day: d.birthday_day,
            })
        }
        wx.request({
            url: app.globalData.url + "todo/bazaar/resident",
            header: {
                'content-type': 'application/json'
            },
            success(res) {
                if (res.statusCode === 200) {
                    for (var i in res.data) {
                        // 如果生日和候补生日重复，则替换为备选生日日期
                        if (res.data[i]["birthday"]["month"] == that.data.season[that.data.birthday_month][1]) {
                            if (res.data[i]["birthday"]["day"] == that.data.birthday_day) {
                                if (res.data[i]["birthday"]["day2"] != null) {
                                    res.data[i]["birthday"]["day"] =
                                        res.data[i]["birthday"]["day2"]
                                }
                            }
                        }
                    }
                    that.setData({
                        resident: res.data,
                    })
                }
            }
        })
        wx.request({
            url: app.globalData.url + "todo/bazaar/festival",
            header: {
                'content-type': 'application/json'
            },
            success(res) {
                if (res.statusCode === 200) {
                    that.setData({
                        festival: res.data,
                    })
                }
            }
        })
    },
    observers: {
        'cookbook, resident, festival': function () {
            this.get_calendar()
        },
        'year, month, day': function () {
            this.get_calendar()
        }
    },
    pageLifetimes: {
        // 组件所在页面的生命周期函数
        show: function () {},
    },
    methods: {
        // 存档
        data_to_localStorage() {
            wx.setStorageSync("bazaar", {
                year: this.data.year,
                month: this.data.month,
                day: this.data.day,
                birthday_month: this.data.birthday_month,
                birthday_day: this.data.birthday_day,
            })
        },
        // 获取日历（当周）
        get_calendar() {
            var ThisWeek = []
            var today = ((this.data.year - 1) * 124 + this.data.month * 31 + this.data.day - 1) % 7
            // 当天之前（不含当天）
            for (var i = today; i > 0; i--) {
                var d = this.data.day - i
                if (d <= 0) {
                    ThisWeek.push([this.data.month - 1, 31 + d, this.data.year])
                } else {
                    ThisWeek.push([this.data.month, d, this.data.year])
                }
            }
            // 当天之后（含当天）
            for (var i = today; i < 7; i++) {
                var d = this.data.day + (i - today)
                if (d > 31) {
                    ThisWeek.push([this.data.month + 1, d - 31, this.data.year])
                } else {
                    ThisWeek.push([this.data.month, d, this.data.year])
                }
            }
            // 如果出现'-1'或'4'则重置为'3'或'0'
            for (var x of ThisWeek) {
                if (x[0] > 3) {
                    x[0] = 0
                    x[2] = this.data.year + 1
                } else if (x[0] < 0) {
                    x[0] = 3
                    x[2] = this.data.year - 1
                }
            }
            // 循环日历列表（周），通过月份和日期添加事件名
            for (var x of ThisWeek) {
                var z = []
                // 日历事件
                for (var y of this.data.festival) {
                    if (this.data.season[x[0]][1] == y.month && x[1] == y.day) {
                        // 第一年春1日的年糕大会不举行
                        if (!(this.data.year == 1 && this.data.month == 0 && x[1] == 1)) {
                            z.push(y.name)
                        }
                    }
                }
                // 居民生日
                for (var y of this.data.resident) {
                    if (this.data.season[x[0]][1] == y.birthday.month && x[1] == y.birthday.day) {
                        z.push(y.name)
                    }
                }
                x.push(z)
            }
            // 返回值 [[<月>,<日>,<节日/生日>],...]
            this.setData({
                calendar: ThisWeek,
            })
        },
        // 修改日历
        change_calendar(event) {
            const year = event.currentTarget.dataset.year
            const month = event.currentTarget.dataset.month
            const day = event.currentTarget.dataset.day
            this.setData({
                year: year,
                month: month,
                day: day,
            })
            // 存档
            this.data_to_localStorage()
        },
        // 下一天
        next() {
            // 日期 +1
            if (this.data.day + 1 <= 31) {
                this.setData({
                    day: this.data.day + 1,
                })
            } else {
                this.setData({
                    day: 1,
                })
                if (this.data.month + 1 < 4) {
                    this.setData({
                        month: this.data.month + 1,
                    })
                } else {
                    this.setData({
                        month: 0,
                        year: this.data.year + 1,
                    })
                }
            }
            console.log('第' + this.data.year + '年 ' + this.data.season[this.data.month][1] + this.data.day + '日 星期' + this.data.week[((this.data.year - 1) * 124 + this.data.month * 31 + this.data.day - 1) % 7])
            // 存档
            this.data_to_localStorage()
        }
    }
})