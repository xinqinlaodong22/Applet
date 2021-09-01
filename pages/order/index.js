import { request } from "../../request/index.js";
import regeneratorRuntime from '../../lib/runtime/runtime';
// pages/order/index.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        orders: [],
        tabs: [{
            id: 1,
            value: "全部订单",
            isactive: true
        }, {
            id: 2,
            value: "待付款",
            isactive: false
        }, {
            id: 3,
            value: "待收货",
            isactive: false
        }, {
            id: 4,
            value: "退款/退货",
            isactive: false
        }],
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {

    },



    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {
        // 判断缓存中是否有token
        const token = wx.getStorageSync("token");
        if (!token) {
            wx.navigateTo({
                url: '/pages/auth/index',
            });
            return;
        }


        //通过getCurrentPages()方法获取url中type值
        let pages = getCurrentPages();
        let currentPage = pages[pages.length - 1]
            //获取url上的type参数
        const { type } = currentPage.options
            // 激活选中页面标题
        this.changeTitleByIndex(type - 1)
        this.getOrders(type)
    },
    //获取历史订单接口的方法
    async getOrders(type) {
        const res = await request({ url: "/my/orders/all", data: { type } })
            //在orders中新增一个重新组织好的时间数据
        res.data.message.orders.map(v => {
            v.createtime_cn = new Date(v.create_time * 1000).toLocaleString("zh-CN")
        })
        this.setData({
            orders: res.data.message.orders
        })
    },
    // 根据标题索引来激活选中标题数组
    changeTitleByIndex(index) {
        let { tabs } = this.data
        tabs.forEach((v, i) => {
            i === index ? v.isactive = true : v.isactive = false
        });
        this.setData({
            tabs
        })
    },

    // 从子组件传递的标题点击事件
    tabsItemChange(e) {
        const { index } = e.detail;
        console.log(e);
        this.changeTitleByIndex(index)
        this.getOrders(index + 1)
    },
})