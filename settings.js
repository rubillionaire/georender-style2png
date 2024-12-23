const features = require('@rubenrodriguez/georender-pack/features.json')

module.exports = function () {
  var zoomStart = 1
  var zoomEnd = 21 //inclusive
  var zoomCount = zoomEnd - zoomStart + 1
  var fbHeights = {
    point: 7*zoomCount,
    line: 8*zoomCount,
    area: 6*zoomCount,
    areaborder: 3*zoomCount,
    spritemeta: 2
  }
  var fbTotalHeight = fbHeights.point + fbHeights.line + fbHeights.area + fbHeights.areaborder
  var imageWidth = features.length

  return { 
    zoomStart,
    zoomEnd,
    zoomCount,
    fbHeights,
    fbTotalHeight,
    imageWidth
  }
}
