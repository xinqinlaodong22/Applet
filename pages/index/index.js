import { request } from "../../request/index.js";

//Page Object
Page({
    data: {
        //轮播图数组
        swiperList: [],
        catesList: [],
        floorList: [],
    },
    //页面一加载就会触发
    onLoad: function(options) {
        this.getSwiperList(),
            this.getCatesList(),
            this.getFloorList()
    },
    //获取轮播图数据
    getSwiperList() {
        request({ url: '/home/swiperdata' })
            .then(result => {
                this.setData({
                    swiperList: result.data.message
                })
            })
    },
    //获取分类导航数据
    getCatesList() {
        request({ url: '/home/catitems' })
            .then(result => {
                this.setData({
                    catesList: result.data.message
                })
            })
    },
    //获取楼层数据
    getFloorList() {
        request({ url: '/home/floordata' })
            .then(result => {
                result.data.message.forEach(v => v.product_list.forEach(a => { a.navigator_url = a.navigator_url.replace("?", "/index?") }))
                this.setData({
                    floorList: result.data.message
                })
            })
    },

    onReady: function() {

    },
    onShow: function() {

    },
    onHide: function() {

    },
    onUnload: function() {

    },
    onPullDownRefresh: function() {

    },
    onReachBottom: function() {

    },
    onShareAppMessage: function() {

    },
    onPageScroll: function() {

    },
    //item(index,pagePath,text)
    onTabItemTap: function(item) {

    }
});