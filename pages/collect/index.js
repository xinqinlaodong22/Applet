import regeneratorRuntime from '../../lib/runtime/runtime';
import { showModal } from "../../utils/asyncWx.js"
Page({

    /**
     * 页面的初始数据
     */
    data: {
        tabs: [{
            id: 1,
            value: "商品收藏",
            isactive: true
        }, {
            id: 2,
            value: "品牌收藏",
            isactive: false
        }, {
            id: 3,
            value: "店铺收藏",
            isactive: false
        }, {
            id: 4,
            value: "浏览足迹",
            isactive: false
        }],
        collects: []
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
        const collects = wx.getStorageSync("collects") || [];
        this.setData({
            collects
        })
    },

    tabsItemChange(e) {
        const { index } = e.detail;
        let { tabs } = this.data
        tabs.forEach((v, i) => {
            i === index ? v.isactive = true : v.isactive = false
        });
        this.setData({
            tabs
        })
    },

    async handleClose(e) {
        console.log(e);
        const result = await showModal("是否要删除")
        if (result.confirm) {
            const { index } = e.currentTarget.dataset
            const collects = wx.getStorageSync("collects")
            collects.splice(index, 1)
            wx.setStorageSync("collects", collects)
            this.setData({
                collects
            })
        }
        console.log(result);
    }
})