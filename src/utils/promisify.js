export default async function promisify(callback) {
    return new Promise((resolve, reject) => {
        callback((err, res) => {
            if (err) {
                reject(err)
            } else {
                resolve(res)
            }
        })
    })
}