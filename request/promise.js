// new Promise((resolve, reject) => {
//     setTimeout(() => resolve("a"), 2000)

// }).then(res => {
//     console.log(res);
// })

export const req = () => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve("a")
        }, 2000)
    })
}