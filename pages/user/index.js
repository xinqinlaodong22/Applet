// pages/user/index.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        userInfo: {},
        collectNum: 0
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
        const userInfo = wx.getStorageSync("userInfo");
        //显示收藏数据的个数,但是这里有bug,要先判断是否登录
        const collects = wx.getStorageSync("collects") || [];
        let collectNum = collects.length
        this.setData({
            userInfo,
            collectNum
        })
    },




})