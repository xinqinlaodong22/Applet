import { request } from "../../request/index.js";
import regeneratorRuntime from '../../lib/runtime/runtime';
/* 
1 用户上滑页面 滚动条触底 开始加载下一页数据
  1 找到滚动条触底事件  微信小程序官方开发文档寻找
  2 判断还有没有下一页数据
    1 获取到总页数  只有总条数
      总页数 = Math.ceil(总条数 /  页容量  pagesize)
      总页数     = Math.ceil( 23 / 10 ) = 3
    2 获取到当前的页码  pagenum
    3 判断一下 当前的页码是否大于等于 总页数 
      表示 没有下一页数据

  3 假如没有下一页数据 弹出一个提示
  4 假如还有下一页数据 来加载下一页数据
    1 当前的页码 ++
    2 重新发送请求
    3 数据请求回来  要对data中的数组 进行 拼接 而不是全部替换！！！
2 下拉刷新页面
  1 触发下拉刷新事件 需要在页面的json文件中开启一个配置项
    找到 触发下拉刷新的事件
  2 重置 数据 数组 
  3 重置页码 设置为1
  4 重新发送请求
  5 数据请求回来 需要手动的关闭 等待效果

 */
Page({

    /**
     * 页面的初始数据
     */
    data: {
        tabs: [{
            id: 1,
            value: "综合",
            isactive: true
        }, {
            id: 2,
            value: "销量",
            isactive: false
        }, {
            id: 3,
            value: "价格",
            isactive: false
        }],
        goodsList: []
    },
    QueryParams: {
        query: "",
        cid: "",
        pagenum: 1,
        pagesize: 10
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        this.QueryParams.cid = options.cid || ""
        this.QueryParams.query = options.query || ""

        this.getGoodsList();
    },

    totalPages: 1,
    // 获取商品列表数据
    async getGoodsList() {
        const res = await request({ url: "/goods/search", data: this.QueryParams })
        const total = res.data.message.total
            // 计算总页数
        this.totalPages = Math.ceil(total / this.QueryParams.pagesize)
        this.setData({
                goodsList: [...this.data.goodsList, ...res.data.message.goods]
            })
            //请求好数据后,关闭加载效果
        wx.stopPullDownRefresh()

    },

    // 从子组件传递的标题点击事件
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

    //上拉加载数据
    onReachBottom() {
        //    判断还有没有下一页数据
        if (this.QueryParams.pagenum >= this.totalPages) {
            wx.showToast({
                title: '人家也是有底线的拉',
            });

        } else {
            this.QueryParams.pagenum++;
            this.getGoodsList()
        }
    },

    //下拉刷新数据
    onPullDownRefresh() {
        // 1重置数组
        this.setData({
            goodsList: []
        })

        //2重置页码
        this.QueryParams.pagenum = 1

        //3发送请求
        this.getGoodsList()
    },
})