// pages/category/index.js
import { request } from "../../request/index.js";
import regeneratorRuntime from '../../lib/runtime/runtime';
Page({

    /**
     * 页面的初始数据
     */
    data: {
        //左侧的菜单数据
        leftMenuList: [],
        // 右侧的商品数据
        rightContent: [],
        // 左边菜单栏当前被点击的坐标
        currentIndex: 0,
        scrolltop: 0
    },

    Cates: [],
    // 当点击左侧菜单时，右边显示对应的商品，且选中的左侧菜单会改变样式
    handleItemTap(e) {
        let { index } = e.currentTarget.dataset
        let rightContent = this.Cates[index].children;
        this.setData({
            currentIndex: index,
            rightContent,
            scrolltop: 0
        })
    },

    onLoad: function(options) {
        /*
        1先判断本地存储中有没有旧数据
        2没有旧数据直接发送请求
        3有旧数据且没有过期重新渲染
        */
        // 1向本地获取数据
        const Cates = wx.getStorageSync("cates");
        //如果本地为空
        if (!Cates) {
            this.getCates()
        } else {
            //本地不为空，但是超时10秒种
            if (Date.now() - Cates.time > 1000 * 10) {
                this.getCates()
            } else {
                //本地不为空，不超时，数据重新赋值
                this.Cates = Cates.data
                let leftMenuList = this.Cates.map(i => i.cat_name)
                let rightContent = this.Cates[0].children;
                this.setData({
                    leftMenuList,
                    rightContent
                })
            }
        }



    },

    // getCates() {
    //     request({
    //         url: "/categories"
    //     }).then(res => {
    //         this.Cates = res.data.message;
    //         // 向本地存储数据，存什么类型数据，获取的就是什么数据，不会类型转换的
    //         wx.setStorageSync("cates", { time: Date.now(), data: this.Cates });

    //         let leftMenuList = this.Cates.map(i => i.cat_name)
    //         let rightContent = this.Cates[0].children;
    //         this.setData({
    //             leftMenuList,
    //             rightContent
    //         })
    //     })
    // },
    async getCates() {
        const res = await request({ url: "/categories" })
        this.Cates = res.data.message;
        // 向本地存储数据，存什么类型数据，获取的就是什么数据，不会类型转换的
        wx.setStorageSync("cates", { time: Date.now(), data: this.Cates });

        let leftMenuList = this.Cates.map(i => i.cat_name)
        let rightContent = this.Cates[0].children;
        this.setData({
            leftMenuList,
            rightContent
        })
    }

})