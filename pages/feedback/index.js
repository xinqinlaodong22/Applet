import { request } from "../../request/index.js";
import regeneratorRuntime from '../../lib/runtime/runtime';
import { showToast } from "../../utils/asyncWx.js"
Page({

    /**
     * 页面的初始数据
     */
    data: {
        tabs: [{
            id: 1,
            value: "体验问题",
            isactive: true
        }, {
            id: 2,
            value: "商家，商品投诉",
            isactive: false
        }],
        imgs: [],
        inpVal: ""
    },
    // 存放图片外网的链接
    UpLoadImgs: [],

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {

    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {

    },

    tabsItemChange(e) {
        const { index } = e.detail
        const { tabs } = this.data
        tabs.forEach((v, i) => {
            i === index ? v.isactive = true : v.isactive = false
        })
        this.setData({
            tabs
        })
    },
    // 点击“+”添加图片，将图片的url保存在imgs中
    hangdleImg() {
        wx.chooseImage({
            count: 9,
            sizeType: ['original', 'compressed'],
            sourceType: ['album', 'camera'],
            success: (result) => {
                let imgs = result.tempFilePaths
                this.setData({
                    imgs: [...this.data.imgs, ...imgs]
                })
            },

        });

    },

    // 点击小图片删除功能
    handleDel(e) {
        const { index } = e.currentTarget.dataset
        const { imgs } = this.data
        imgs.splice(index, 1)
        this.setData({
            imgs
        })
    },

    // 在输入框输入值的时候
    handleVal(e) {
        this.setData({
            inpVal: e.detail.value
        })
    },


    // 点击提交按钮
    async handleSubmit() {
        // 先校验输入的文本合不合法        
        const { inpVal, imgs } = this.data
        if (!inpVal.trim()) {
            //表明输入框中的值不合法
            await showToast("输入的值不能为空", "none")
            return
        }
        // 上传过程中有个提示
        wx.showLoading({
            title: "正在上传,请等待",
            mask: true,
        });

        // 判断用户是否上传图片，如果没有，则上传文字，如果有则文字和图片都上传
        if (imgs.length !== 0) {
            // 图片上传到外网只能一张一张上传，所以要遍历
            imgs.forEach((v, i) => {
                var upTask = wx.uploadFile({
                    url: 'https://img.coolcr.cn/api/upload',
                    filePath: v,
                    name: "image",
                    formData: {},
                    success: (result) => {
                        let url = JSON.parse(result.data).data.url
                        this.UpLoadImgs.push(url)

                        if (i === imgs.length - 1) {
                            // 关闭上传提示
                            wx.hideLoading();

                            // 说明最后一张图片的url也获得了
                            console.log("所有的文字与图片都发送到外网，但是没有外网的接口，只能模拟");
                            // 重置页面,并返回
                            this.setData({
                                imgs: [],
                                inpVal: ""
                            })
                            wx.navigateBack({
                                delta: 1
                            });

                        }
                    },
                    fail: (err) => {
                        console.log("获取失败");
                    }
                });
            })
        } else {
            wx.hideLoading();
            console.log("只是上传了文字");
            wx.navigateBack({
                delta: 1
            });

        }




    }
})