// pages/cart/index.js

Page({

    /**
     * 页面的初始数据
     */
    data: {
        address: {},
        cart: [],
        allchecked: false,
        totalPrice: 0,
        totalNum: 0
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {

    },

    handleChooseAddress() {
        wx.chooseAddress({
            success: (address) => {
                address.all = address.provinceName + address.cityName + address.countyName + address.detailInfo
                wx.setStorageSync('address', address)
            }
        });
    },

    onShow() {
        const address = wx.getStorageSync("address") || [];
        // 拿到缓存中cart中的数据
        const cart = wx.getStorageSync("cart") || []
            // 这样做和下面的循环重复了，浪费性能
            // const allchecked = cart.length ? cart.every(v => v.checked) : false
            // 总价格
        this.setData({ address })
        this.setCart(cart)
    },

    // 复选框取消
    handleItemChange(e) {

        const goods_id = e.currentTarget.dataset.id
        let { cart } = this.data
        let index = cart.findIndex(v => v.goods_id === goods_id);
        cart[index].checked = !cart[index].checked

        this.setCart(cart)

    },

    // 设置购物车状态checked时，重新计算底部工具栏的数据 全选 总价格 购买的数量
    setCart(cart) {
        let totalPrice = 0;
        let totalNum = 0;
        let allchecked = true
        cart.forEach(v => {
            if (v.checked) {
                totalPrice += v.goods_price * v.num
                totalNum += v.num
            } else {
                allchecked = false
            }
        });

        allchecked = cart.length ? allchecked : false
        this.setData({
            cart,
            allchecked,
            totalPrice,
            totalNum
        })
        wx.setStorageSync("cart", cart);


    },
    // 处理全选
    handleAllChecked(e) {
        let { cart, allchecked } = this.data
        if (!allchecked) {
            cart.forEach(v => v.checked = true)
            this.setCart(cart)
        } else {
            cart.forEach(v => v.checked = false)
            this.setCart(cart)
        }
    },


    // 点击“+”，“-”按钮，数值加1或减1
    handleNum(e) {
        let { goods_id, operation } = e.currentTarget.dataset
        let { cart } = this.data
        const index = cart.findIndex(v => v.goods_id === goods_id)
        if (cart[index].num <= 1 && operation == -1) {
            wx.showModal({
                title: '警告',
                content: '您确定要删除该商品吗？',
                showCancel: true,
                cancelText: '取消',
                confirmText: '确定',
                success: (result) => {
                    if (result.confirm) {
                        cart.splice(index, 1)
                        this.setCart(cart)
                    }
                }
            });

        } else {
            cart[index].num += operation;
            this.setCart(cart)
        }

    },

    // 点击结算
    handlePay() {
        const { address, totalNum } = this.data
        if (!address.userName) {
            wx.showToast({
                title: '您还没有选择收货地址',
                icon: 'none',
                mask: true,
                success: (result) => {}
            });
            return;
        }
        if (totalNum == 0) {
            wx.showToast({
                title: '您还没有选购商品',
                icon: 'none',
                mask: true,
                success: (result) => {}
            });
            return;
        }
        // 跳转到支付页面
        wx.navigateTo({
            url: '/pages/pay/index',

        });

    }

})