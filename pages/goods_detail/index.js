import { request } from "../../request/index.js";
import regeneratorRuntime from '../../lib/runtime/runtime';
import { showToast } from "../../utils/asyncWx.js"
Page({

    /**
     * 页面的初始数据
     */
    data: {
        goodsObj: {},
        iscollects: false
    },
    GoodsInfo: {},
    /**
     * 生命周期函数--监听页面加载
     */
    // 用onShow是因为详情页频繁被调用
    onShow: function() {
        let pages = getCurrentPages();
        let currentPage = pages[pages.length - 1]
        let options = currentPage.options
        const { goods_id } = options;
        this.getGoodsDetail(goods_id)

    },


    async getGoodsDetail(goods_id) {
        const res = await request({ url: "/goods/detail", data: { goods_id } })
        const goodsObj = res.data.message
        this.GoodsInfo = goodsObj
            //获取缓存中collects数组,这个数组包含收藏的商品
        const collects = wx.getStorageSync("collects") || []
            // 数组.some,表示只要数组中有一个符合条件就返回true,当商品页的goods_id与收藏中某一个商品的goods_id相等就表示改商品收藏了
        const iscollects = collects.some(v => v.goods_id === this.GoodsInfo.goods_id)
        this.setData({
            goodsObj: {
                goods_name: goodsObj.goods_name,
                goods_price: goodsObj.goods_price,
                goods_introduce: goodsObj.goods_introduce.replace(/\.webp/g, '.jpg'),
                pics: goodsObj.pics
            },
            iscollects
        })


    },

    // 点击轮播图，放大预览
    handlePrevewImage(e) {
        const urls = this.GoodsInfo.pics.map(v => v.pics_mid)
        console.log(e);
        const current = e.currentTarget.dataset.url
        wx.previewImage({
            current,
            urls,

        });

    },

    /*
    点击购物车按钮
    1绑定点击事件
    2获取缓存中的数据，要数组格式
    3判断当前的商品是否在购物车中
    4已经存在，商品数量++
    5不存在，购物车数组添加一个新元素，把购物车数组填充回缓存中
    6弹出提示框
    */
    handleCartAdd(e) {
        let cart = wx.getStorageSync("cart") || [];
        let index = cart.findIndex(v => v.goods_id === this.GoodsInfo.goods_id)
        if (index === -1) {
            // 不存在购物车中
            this.GoodsInfo.num = 1;
            this.GoodsInfo.checked = true
            cart.push(this.GoodsInfo)
        } else {
            // 存在购物车中
            cart[index].num++
        }
        // 把购物车放回缓存中
        wx.setStorageSync("cart", cart);
        // 弹窗提示
        wx.showToast({
            title: '成功加入购物车',
            icon: 'success',
            mask: true,
        });

    },

    // 点击收藏的业务逻辑
    async handleCollect() {
        // 获取缓存中收藏的数据
        let collects = wx.getStorageSync("collects") || []
            // 给iscollects取默认值false
        let iscollects = false
            // 将收藏中的goods_id与当前页详细信息的goods_id做判断
        let index = collects.findIndex(v => v.goods_id === this.GoodsInfo.goods_id)
            // 如果不为-1,则说明收藏数组中含有该商品
        if (index !== -1) {
            // 将该商品从收藏数组中删去
            collects.splice(index, 1)
            iscollects = false
            await showToast("取消收藏", "error")
        } else {
            // 说明该商品不在收藏数组中,把商品添加到收藏数组中
            collects.push(this.GoodsInfo)
            iscollects = true
            await showToast("收藏成功", "success")
        }
        // 将新的收藏数组保存到缓存中
        wx.setStorageSync("collects", collects);
        this.setData({
            iscollects
        })
    }

})