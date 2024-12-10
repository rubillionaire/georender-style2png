const fs = require('node:fs')
const makePNG = require('fast-png')
const makeTex = require('../')
makeTex({
  stylesheet: require('./style.json'),
  features: require('@rubenrodriguez/georender-pack/features.json'),
  defaults: require('../defaults.json')
}, function (error, data) {
  if (error) return console.log(error)
  const pngData = {
    width: data.width,
    height: data.height,
    data: data.data
  }
  var png = makePNG.encode(pngData)
  fs.writeFileSync('style-texture.png', png)
  const labelOpts = {
    fontFamily: data.labelFontFamily,
  }
  fs.writeFileSync('style-label-opts.json', JSON.stringify(labelOpts))
})
