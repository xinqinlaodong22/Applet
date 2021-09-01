import { request } from "../../request/index.js";
import regeneratorRuntime, { async } from '../../lib/runtime/runtime';

Page({

    /**
     * 页面的初始数据
     */
    data: {
        // 存入搜索到的商品
        goods: [],
        // 控制按钮是否隐藏
        ishidden: false,
        // 搜索输入框内的值为空
        inpValue: ""
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

    },
    // 定时器 全局变量
    timeId: -1,

    //搜索输入框输入数据时
    handleInput(e) {
        const { value } = e.detail
        if (!value.trim()) {
            clearTimeout(this.timeId)
            this.setData({
                goods: [],
                ishidden: false
            })
            return;
        }
        this.setData({
                ishidden: true
            })
            // 防抖操作，先删除定时器，然后再执行定时器，这就发送了一次请求
        clearTimeout(this.timeId)
        this.timeId = setTimeout(() => {
            this.getSearchData(value)
        }, 1000)

    },

    // 向服务器发出请求，获取数据，并保存在goods中
    async getSearchData(query) {
        const req = await request({ url: "/goods/search", data: { query: query } })
        console.log(req);
        const { goods } = req.data.message
        this.setData({
            goods
        })
    },

    // 点击取消按钮输入框为空，数据隐藏，按钮隐藏
    handleCancel() {
        this.setData({
            goods: [],
            ishidden: false,
            inpValue: ""
        })
    }


})