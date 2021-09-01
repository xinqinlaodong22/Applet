//计数,当有请求动作时就+1
let ajaxTime = 0;
export const request = (params) => {
    let header = {...params.header };
    if (params.url.includes("/my/")) {
        header["Authorization"] = wx.getStorageSync("token");
    }


    ajaxTime++
    //加载特效
    wx.showLoading({
        title: '加载中',
        mask: true
    })


    const baseURL = "https://api-hmugo-web.itheima.net/api/public/v1"
    return new Promise((resolve, reject) => {
        wx.request({
            ...params,
            header,
            url: baseURL + params.url,
            success: (result) => {
                resolve(result);
            },
            fail: (err) => {
                reject(err)
            },
            //不管数据接收成功还是失败都会触发
            complete: () => {
                //当执行完请求后减1
                ajaxTime--;
                //当计数为0时才关闭加载特效,防止首页同时发送三个请求
                if (ajaxTime === 0) {
                    wx.hideLoading()
                }

            }
        })
    })
}