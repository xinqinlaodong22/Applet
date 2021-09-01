import { request } from "../../request/index.js";
import regeneratorRuntime from '../../lib/runtime/runtime';
import { login } from "../../utils/asyncWx.js"
Page({

    /**
     * 页面的初始数据
     */
    data: {

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
    async handlegetuserinfo(e) {
        try {
            const { encryptedData, rawData, iv, signature } = e.detail
            const { code } = await login()
            const loginParams = { encryptedData, rawData, iv, signature, code }
            const res = await request({ url: "/users/wxlogin", data: loginParams, method: "post" })
                // 通过res.data.message可以获取token，但需要企业级appid所以不行
            const token = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjIzLCJpYXQiOjE1NjQ3MzAwNzksImV4cCI6MTAwMTU2NDczMDA3OH0.YPt-XeLnjV-_1ITaXGY2FhxmCe4NvXuRnRB8OMCfnPo"
            wx.setStorageSync("token", token);
            wx.navigateBack({
                delta: 1
            });
        } catch (error) {
            console.log(error);
        }
    }
})