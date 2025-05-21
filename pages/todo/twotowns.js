// pages/todo/twotowns.js
const app = getApp() // app.js > globalData

Component({
    options: {
      addGlobalClass: true, // 允许外部全局样式穿透
      styleIsolation: 'shared' // 或 'apply-shared'
    },
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
        animal_id: -1, // 动物ID
        animal_page: false, // 添加动物
        animal_change: false, // 修改动物
        animal_list: [], // 动物列表
        animal_type: ["鸡","黑鸡","牛","茶牛","羊","黑羊","白色羊驼","茶色羊驼"], // 动物类型
        animal: {
            name: "", // 名字
            type: 0, // 类型
            plan: 0, // 计划增产
            cookie: [3,4,5,6], // 普通、野菜、谷物、鱼味
            current: -1, // 选中项
        }, // 添加动物
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
        if (!wx.getStorageSync("twotowns")) {
            console.log("初始化")
            wx.setStorageSync("twotowns", {
                year: 1,
                month: 0,
                day: 1,
                birthday_month: 0,
                birthday_day: 1,
                animal_list: []
            })
        } else {
            var d = wx.getStorageSync("twotowns")
            this.setData({
                year: d.year,
                month: d.month,
                day: d.day,
                birthday_month: d.birthday_month,
                birthday_day: d.birthday_day,
                animal_list: d.animal_list ? d.animal_list : []
            })
        }
        wx.request({
            url: app.globalData.url + "todo/twotowns/resident",
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
            url: app.globalData.url + "todo/twotowns/festival",
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
        // 添加动物
        animal_add() {
            this.setData({
                animal_page: true,
                animal: {
                    name: "",
                    type: 0,
                    plan: 0,
                    cookie: [0,0,0,0],
                    current: -1,
                },
            })
        },
        // 修改动物名称
        changeName(e) {
            const that = this
            wx.showModal({
                title: '修改动物名称',
                editable: true,
                content: that.data.animal.name,
                success(res) {
                    if (res.confirm) {
                        var animal = that.data.animal
                        animal.name = res.content
                        that.setData({
                            animal: animal,
                        })
                    }
                }
            })
        },
        // 修改计划增产数量
        animal_plan(e) {
            var animal = this.data.animal
            animal.plan = e.detail.value
            this.setData({
                animal: animal,
            })
        },
        // 修改饼干数量
        animal_cookie(e) {
            var n = parseInt(e.currentTarget.dataset.mode)
            const that = this
            wx.showModal({
                title: '修改饼干数量',
                editable: true,
                content: that.data.animal.cookie[n].toString(),
                success(res) {
                    if (res.confirm) {
                        var INT = new RegExp("^[1-9][0-9]*$")
                        if ( INT.test(res.content) ) {
                            var cookie_number = parseInt(res.content)
                        } else {
                            var cookie_number = 0
                        }
                        var animal = that.data.animal
                        animal.cookie[n] = cookie_number
                        that.setData({
                            animal: animal,
                        })
                    }
                }
            })
        },
        // 保存动物
        animal_save() {
            var animal = this.data.animal
            var animal_list = this.data.animal_list
            if (animal.name == "") {
                animal.name = this.data.animal_type[animal.type] + "@" + (animal_list.length + 1).toString()
            }
            if (this.data.animal_id == -1) {
                animal_list.push(animal)
            }
            this.setData({
                animal: animal,
                animal_list: animal_list,
                animal_page: false,
                animal_change: false,
                animal_id: -1
            })
            this.data_to_localStorage()
        },
        // 选择动物类型
        animal_picker(e) {
            var animal = this.data.animal
            animal.type = e.detail.value
            this.setData({
                animal: animal,
            })
        },
        // 选择茶点类型
        switch_counter(e) {
            var i = parseInt(e.currentTarget.dataset.current)
            var s = parseInt(e.currentTarget.dataset.id)
            var animal_list = this.data.animal_list
            if (animal_list[s].current == i) {
                animal_list[s].current = -1
            } else {
                animal_list[s].current = i
            }
            this.setData({
                animal_list: animal_list,
            })
            this.data_to_localStorage()
        },
        // 修改动物信息
        animal_edit(e) {
            var i = parseInt(e.currentTarget.dataset.id)
            this.setData({
                animal: this.data.animal_list[i],
                animal_id: i,
                animal_page: true,
                animal_change: true
            })
        },
        // 删除动物
        animal_del() {
            var animal_list = this.data.animal_list
            animal_list.splice(this.data.animal_id, 1)
            this.setData({
                animal_list: animal_list,
                animal_page: false,
                animal_change: false,
                animal_id: -1
            })
            this.data_to_localStorage()
        },
        // 存档
        data_to_localStorage() {
            wx.setStorageSync("twotowns", {
                year: this.data.year,
                month: this.data.month,
                day: this.data.day,
                birthday_month: this.data.birthday_month,
                birthday_day: this.data.birthday_day,
                animal_list: this.data.animal_list,
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
            // 茶点计数器
            var animal_list = this.data.animal_list
            for (let i in animal_list) {
                if (animal_list[i].current != -1) {
                    animal_list[i].cookie[animal_list[i].current] += 1
                }
            }
            this.setData({
                animal_list: animal_list,
            })
            // 存档
            console.log('第' + this.data.year + '年 ' + this.data.season[this.data.month][1] + this.data.day + '日 星期' + this.data.week[((this.data.year - 1) * 124 + this.data.month * 31 + this.data.day - 1) % 7])
            this.data_to_localStorage()
        }
    }
})