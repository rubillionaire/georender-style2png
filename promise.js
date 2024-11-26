const makeTex = require('./index')

module.exports = function (opts, cb) {
  return new Promise((resolve, reject) => {
    makeTex(opts, (err, tex) => {
      if (err) reject(err)
      else resolve(tex)
    })
  })  
}
