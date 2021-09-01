export const login = () => {
    return new Promise((res, rej) => {
        wx.login({
            timeout: 10000,
            success: (result) => {
                res(result)
            },
            fail: (err) => {
                rej(err)
            },

        });

    })
}

// 小程序内置支付功能封装
export const requestPayment = (pay) => {
    return new Promise((resolve, reject) => {
        wx.requestPayment({
            timeStamp: '',
            nonceStr: '',
            package: '',
            signType: '',
            paySign: '',
            success: (result) => {
                resolve(result)
            },
            fail: (err) => {
                reject(err)
            },
            complete: () => {}
        });


    })
}

export const showToast = (title, icon) => {
    return new Promise((resolve, reject) => {
        wx.showToast({
            title,
            icon,
            image: '',
            duration: 1500,
            mask: true,
            success: (result) => {
                resolve(result)
            },

        });

    })
}

export const showModal = (content) => {
    return new Promise((resolve, reject) => {
        wx.showModal({
            title: '提示',
            content,
            showCancel: true,
            cancelText: '取消',
            cancelColor: '#000000',
            confirmText: '确定',
            confirmColor: '#3CC51F',
            success: (result) => {
                if (result.confirm) {
                    resolve(result)
                }
            }

        });

    })
}