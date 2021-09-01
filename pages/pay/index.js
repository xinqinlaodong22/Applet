import { request } from "../../request/index.js";
import regeneratorRuntime from '../../lib/runtime/runtime';
import { login, requestPayment, showToast } from "../../utils/asyncWx.js"
// pages/pay/index.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        address: {},
        cart: [],
        totalPrice: 0,
        totalNum: 0
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        const address = wx.getStorageSync("address");
        const cart = wx.getStorageSync("cart").filter(v => v.checked == true)
        let totalPrice = 0
        let totalNum = 0
        cart.forEach(v => {
            totalPrice += v.goods_price * v.num
            totalNum += v.num
        })
        this.setData({
            address,
            cart,
            totalPrice,
            totalNum
        })

    },

    async handleOrderPay() {
        try {
            //判断缓存中有没有token
            const token = wx.getStorageSync("token");
            if (!token) {
                wx.navigateTo({
                    url: '/pages/auth/index',
                });
                return;
            }
            // const header = { Authorization: token }
            const order_price = this.data.totalPrice
            const consignee_addr = this.data.address.all
            const cart = this.data.cart
            let goods = []
            cart.forEach(v => {
                goods.push({
                    goods_id: v.goods_id,
                    goods_number: v.num,
                    goods_price: v.goods_price
                })
            })
            const orderParams = { order_price, consignee_addr, goods }
            const req = await request({ url: "/my/orders/create", method: "POST", data: orderParams })
                // 创建订单，获取订单编号
            const { order_number } = req.data.message
                // 发起预支付接口
            const re = await request({ url: "/my/orders/req_unifiedorder", method: "POST", data: { order_number } })
            const { pay } = re.data.message
                // 发起微信支付，但是报错了
            const result = await requestPayment({ pay })
                // 查询后台 订单状态,也是报错
            const requ = await request({ url: "/my/orders/chkOrder", method: "POST", data: { order_number } })
            await showToast("支付成功", "success")

        } catch (error) {
            await showToast("支付失败", "error")
            const cart = wx.getStorageSync("cart").filter(v => !v.checked)
            wx.setStorageSync("cart", cart)
            wx.navigateTo({
                url: '/pages/order/index',
            });


        }
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {

    },


})