var fs = require('fs')
var expand = require('brace-expansion')
var evalExpr = require('./lib/expr.js')
var settings = require('./settings.js')()
var zoomStart = settings.zoomStart
var zoomEnd = settings.zoomEnd //inclusive

module.exports = function (opts) {
  var defaults = opts.defaults
  var stylesheet = opts.stylesheet
  var fkeys = opts.features
  parseKeys(stylesheet)
  /*
  var spriteFiles = getSpriteFiles(defaults, stylesheet)
  readSpriteFiles(spriteFiles, function (err, sprites) {
    console.log(err, sprites)
  })
  */
  parseZooms(stylesheet)
  var lw
  var heights = settings.heights
  var totalHeight = settings.imageHeight
  var totalWidth = settings.imageWidth
  var arrLength = 4*totalWidth*totalHeight


  var data = new Uint8Array(arrLength)
  for (var z = zoomStart; z <= zoomEnd; z++) { //point
    for (var x = 0; x < fkeys.length; x++) {
      var offset = findOffset(x, 7*(z-zoomStart)+0, totalWidth)
      var a = parseHex(getStyle(defaults, stylesheet, fkeys[x], "point-fill-color", z))
      data[offset+0] = a[0] //r
      data[offset+1] = a[1] //g
      data[offset+2] = a[2] //b
      data[offset+3] = getStyle(defaults, stylesheet, fkeys[x], "point-opacity", z) //a
    }
    for (var x = 0; x < fkeys.length; x++) {
      var offset = findOffset(x, 7*(z-zoomStart)+1, totalWidth)
      var b = parseHex(getStyle(defaults, stylesheet, fkeys[x], "point-stroke-color", z))
      data[offset+0] = b[0] //r
      data[offset+1] = b[1] //g
      data[offset+2] = b[2] //b
      data[offset+3] = getStyle(defaults, stylesheet, fkeys[x], "point-opacity", z) //a
    }
    for (var x = 0; x < fkeys.length; x++) {
      var offset = findOffset(x, 7*(z-zoomStart)+2, totalWidth)
      data[offset+0] = getStyle(defaults, stylesheet, fkeys[x], "point-size", z)
      data[offset+1] = getStyle(defaults, stylesheet, fkeys[x], "point-stroke-width-inner", z)
      data[offset+2] = getStyle(defaults, stylesheet, fkeys[x], "point-stroke-width-outer", z)
      data[offset+3] = getStyle(defaults, stylesheet, fkeys[x], "point-zindex", z)
    }
    for (var x = 0; x < fkeys.length; x++) {
      var offset = findOffset(x, 7*(z-zoomStart)+3, totalWidth)
      var plfrgb = parseHex(getStyle(defaults, stylesheet, fkeys[x], "point-label-fill-color", z))
      data[offset+0] = plfrgb[0] //r
      data[offset+1] = plfrgb[1] //g
      data[offset+2] = plfrgb[2] //b
      data[offset+3] = getStyle(defaults, stylesheet, fkeys[x], "point-label-fill-opacity", z) //a
    }
    for (var x = 0; x < fkeys.length; x++) {
      var offset = findOffset(x, 7*(z-zoomStart)+4, totalWidth)
      var plsrgb = parseHex(getStyle(defaults, stylesheet, fkeys[x], "point-label-stroke-color", z))
      data[offset+0] = plsrgb[0] //r
      data[offset+1] = plsrgb[1] //g
      data[offset+2] = plsrgb[2] //b
      data[offset+3] = getStyle(defaults, stylesheet, fkeys[x], "point-label-stroke-opacity", z) //a
    }
    for (var x = 0; x < fkeys.length; x++) {
      var offset = findOffset(x, 7*(z-zoomStart)+5, totalWidth)
      data[offset+0] = getStyle(defaults, stylesheet, fkeys[x], "point-label-font", z)
      data[offset+1] = getStyle(defaults, stylesheet, fkeys[x], "point-label-font-size", z)
      data[offset+2] = getStyle(defaults, stylesheet, fkeys[x], "point-label-priority", z)
      data[offset+3] = 255 || getStyle(defaults, stylesheet, fkeys[x], "point-label-constraints", z)
    }
    for (var x = 0; x < fkeys.length; x++) {
      var offset = findOffset(x, 7*(z-zoomStart)+6, totalWidth)
      data[offset+0] = getStyle(defaults, stylesheet, fkeys[x], "point-label-stroke-width", z)
      data[offset+1] = getSprite() //point-label-sprite
      data[offset+2] = getSprite() //sprite0
      data[offset+3] = 255 || getSprite() //sprite1
    }
  }
  var y = heights.point
  for (var z = zoomStart; z <= zoomEnd; z++) { //line
    for (var x = 0; x < fkeys.length; x++) {
      var offset = findOffset(x, y+8*(z-zoomStart)+0, totalWidth)
      var b = parseHex(getStyle(defaults, stylesheet, fkeys[x], "line-fill-color", z))
      data[offset+0] = b[0] //r
      data[offset+1] = b[1] //g
      data[offset+2] = b[2] //b
      data[offset+3] = getStyle(defaults, stylesheet, fkeys[x], "line-opacity", z) //a
      }
    for (var x = 0; x < fkeys.length; x++) {
      var offset = findOffset(x, y+8*(z-zoomStart)+1, totalWidth)
      var c = parseHex(getStyle(defaults, stylesheet, fkeys[x], "line-stroke-color", z))
      data[offset+0] = c[0] //r
      data[offset+1] = c[1] //g
      data[offset+2] = c[2] //b
      data[offset+3] = getStyle(defaults, stylesheet, fkeys[x], "line-opacity", z) //a
    }
    for (var x = 0; x < fkeys.length; x++) {
      var offset = findOffset(x, y+8*(z-zoomStart)+2, totalWidth)
      var lineStyleFill = parseLineStyle(defaults, stylesheet, fkeys[x], 'fill')
      var lineStyleStroke = parseLineStyle(defaults, stylesheet, fkeys[x], 'stroke')

      data[offset+0] = lineStyleFill.dashLength
      data[offset+1] = lineStyleFill.dashGap
      data[offset+2] = lineStyleStroke.dashLength
      data[offset+3] = lineStyleStroke.dashGap
    }
    for (var x = 0; x < fkeys.length; x++) {
      var offset = findOffset(x, y+8*(z-zoomStart)+3, totalWidth)
      data[offset+0] = getStyle(defaults, stylesheet, fkeys[x], "line-fill-width", z)
      data[offset+1] = getStyle(defaults, stylesheet, fkeys[x], "line-stroke-width", z) //line-stroke-width-inner
      data[offset+2] = 
      data[offset+2] = getStyle(defaults, stylesheet, fkeys[x], "line-stroke-width-outer", z)
      data[offset+3] = getStyle(defaults, stylesheet, fkeys[x], "line-zindex", z)
    }
    for (var x = 0; x < fkeys.length; x++) {
      var llfrgb = parseHex(getStyle(defaults, stylesheet, fkeys[x], "line-label-fill-color", z))
      var offset = findOffset(x, y+8*(z-zoomStart)+4, totalWidth)
      data[offset+0] = llfrgb[0] //r
      data[offset+1] = llfrgb[1] //g
      data[offset+2] = llfrgb[2] //b
      data[offset+3] = 255 || getStyle(defaults, stylesheet, fkeys[x], "line-label-fill-opacity", z) //a
    }
    for (var x = 0; x < fkeys.length; x++) {
      var llsrgb = parseHex(getStyle(defaults, stylesheet, fkeys[x], "line-label-stroke-color", z))
      var offset = findOffset(x, y+8*(z-zoomStart)+5, totalWidth)
      data[offset+0] = llsrgb[0] //r
      data[offset+1] = llsrgb[1] //g
      data[offset+2] = llsrgb[2] //b
      data[offset+3] = getStyle(defaults, stylesheet, fkeys[x], "line-label-stroke-opacity", z) //a
    }
    for (var x = 0; x < fkeys.length; x++) {
      var offset = findOffset(x, y+8*(z-zoomStart)+6, totalWidth)
      data[offset+0] = getStyle(defaults, stylesheet, fkeys[x], "line-label-font", z)
      data[offset+1] = getStyle(defaults, stylesheet, fkeys[x], "line-label-font-size", z)
      data[offset+2] = getStyle(defaults, stylesheet, fkeys[x], "line-label-priority", z)
      data[offset+3] = 255 || getStyle(defaults, stylesheet, fkeys[x], "line-label-constraints", z)
    }
    for (var x = 0; x < fkeys.length; x++) {
      var offset = findOffset(x, y+8*(z-zoomStart)+7, totalWidth)
      data[offset+0] = getStyle(defaults, stylesheet, fkeys[x], "line-label-stroke-width", z)
      data[offset+1] = getSprite() //line-label-sprite
      data[offset+2] = getSprite() //sprite0
      data[offset+3] = 255 || getSprite() //sprite1
    }
  }
  var y = heights.point + heights.line
  for (var z = zoomStart; z <= zoomEnd; z++) { //area
    for (var x = 0; x < fkeys.length; x++) {
      var offset = findOffset(x, y+6*(z-zoomStart)+0, totalWidth)
      var e = parseHex(getStyle(defaults, stylesheet, fkeys[x], "area-fill-color", z))
      data[offset+0] = e[0] //r
      data[offset+1] = e[1] //g
      data[offset+2] = e[2] //b
      data[offset+3] = getStyle(defaults, stylesheet, fkeys[x], "area-opacity", z) //a
    }
    for (var x = 0; x < fkeys.length; x++) {
      var offset = findOffset(x, y+6*(z-zoomStart)+1, totalWidth)
      data[offset+0] = getStyle(defaults, stylesheet, fkeys[x], "area-zindex", z)
      data[offset+1] = getStyle(defaults, stylesheet, fkeys[x], "area-label-stroke-width", z) //area-label-stroke-width
      data[offset+2] = 0 //reserved
      data[offset+3] = 255 //reserved
    }
    for (var x = 0; x < fkeys.length; x++) {
      var offset = findOffset(x, y+6*(z-zoomStart)+2, totalWidth)
      var alfrgb = parseHex(getStyle(defaults, stylesheet, fkeys[x], "area-label-fill-color", z))
      data[offset+0] = alfrgb[0] //area-label-fill-color R
      data[offset+1] = alfrgb[1] //area-label-fill-color G
      data[offset+2] = alfrgb[2] //area-label-fill-color B
      data[offset+3] = 255 || getStyle(defaults, stylesheet, fkeys[x], "area-label-fill-opacity", z) //a
    }
    for (var x = 0; x < fkeys.length; x++) {
      var offset = findOffset(x, y+6*(z-zoomStart)+3, totalWidth)
      var alsrgb = parseHex(getStyle(defaults, stylesheet, fkeys[x], "area-label-stroke-color", z))
      data[offset+0] = alsrgb[0] //area-label-stroke-color R
      data[offset+1] = alsrgb[1] //area-label-stroke-color G
      data[offset+2] = alsrgb[2] //area-label-stroke-color B
      data[offset+3] = getStyle(defaults, stylesheet, fkeys[x], "area-label-stroke-opacity", z) //a
    }
    for (var x = 0; x < fkeys.length; x++) {
      var offset = findOffset(x, y+6*(z-zoomStart)+4, totalWidth)
      data[offset+0] = getStyle(defaults, stylesheet, fkeys[x], "area-label-font", z) //area-label-font
      data[offset+1] = getStyle(defaults, stylesheet, fkeys[x], "area-label-font-size", z) //area-label-font-size
      data[offset+2] = getStyle(defaults, stylesheet, fkeys[x], "area-label-priority", z) //area-label-priority
      data[offset+3] = 255 || getStyle(defaults, stylesheet, fkeys[x], "area-label-constraints", z) //area-label-constraints
    }
    for (var x = 0; x < fkeys.length; x++) {
      var offset = findOffset(x, y+6*(z-zoomStart)+5, totalWidth)
      data[offset+0] = getStyle(defaults, stylesheet, fkeys[x], "area-label-sprite", z) //area-label-sprite
      data[offset+1] = getSprite() //sprite0
      data[offset+2] = getSprite() //sprite1
      data[offset+3] = 255 //reserved
    }
  }
  var y = heights.point + heights.line + heights.area
  for (var z = zoomStart; z <= zoomEnd; z++) { //areaborder
    for (var x = 0; x < fkeys.length; x++) {
      var offset = findOffset(x, y+3*(z-zoomStart)+0, totalWidth)
      var f = parseHex(getStyle(defaults, stylesheet, fkeys[x], "area-border-color", z))
      data[offset+0] = f[0] //r
      data[offset+1] = f[1] //g
      data[offset+2] = f[2] //b
      data[offset+3] = getStyle(defaults, stylesheet, fkeys[x], "area-border-opacity", z) //a
    }
    for (var x = 0; x < fkeys.length; x++) {
      var offset = findOffset(x, y+3*(z-zoomStart)+1, totalWidth)
      var areaBorderStyle = parseAreaBorderStyle (defaults, stylesheet, fkeys[x], z)
      data[offset+0] = areaBorderStyle.dashLength
      data[offset+1] = areaBorderStyle.dashGap
      data[offset+2] = getStyle(defaults, stylesheet, fkeys[x], "area-border-width", z) //areaborder-width-inner
      data[offset+3] = 255 //areaborder-width-outer
    }
    for (var x = 0; x < fkeys.length; x++) {
      var offset = findOffset(x, y+3*(z-zoomStart)+2, totalWidth)
      data[offset+0] = getStyle(defaults, stylesheet, fkeys[x], "area-border-zindex", z)
      data[offset+1] = 0 //sprite0
      data[offset+2] = 0 //sprite1
      data[offset+3] = 255 //reserved
    }
  }
  return { 
    data,
    width: totalWidth,
    height: totalHeight
  }
}

function parseHex (hex) {
  return hex.match(/([0-9a-f]{2})/ig).map(s => parseInt(s,16))
}

function parseLineStyle (defaults, stylesheet, type, property) {
  var style = getStyle(defaults, stylesheet, type, `line-${property}-style`)
  var x = getStyle(defaults, stylesheet, type, `line-${property}-dash-length`)
  var y = getStyle(defaults, stylesheet, type, `line-${property}-dash-gap`)
  var lineStyle = {}

  if (style === "solid") {
    lineStyle['dashLength'] = 1
    lineStyle['dashGap'] = 0
  }
  if (style === "dot") {
    lineStyle['dashLength'] = 3
    lineStyle['dashGap'] = y
  }
  if (style === "dash") {
    lineStyle['dashLength'] = x
    lineStyle['dashGap'] = y
  }
  return lineStyle
}

function parseAreaBorderStyle (defaults, stylesheet, type, zoom) {
  var style = getStyle(defaults, stylesheet, type, `area-border-style`, zoom)
  var x = getStyle(defaults, stylesheet, type, `area-border-dash-length`, zoom)
  var y = getStyle(defaults, stylesheet, type, `area-border-dash-gap`, zoom)
  var areaBorderStyle = {}

  if (style === "solid") {
    areaBorderStyle['dashLength'] = 1
    areaBorderStyle['dashGap'] = 0
  }
  if (style === "dot") {
    areaBorderStyle['dashLength'] = 3
    areaBorderStyle['dashGap'] = y || 2
  }
  if (style === "dash") {
    areaBorderStyle['dashLength'] = x || 5
    areaBorderStyle['dashGap'] = y || 5
  }
  return areaBorderStyle
}

function getStyle (defaults, stylesheet, type, property, zoom) {
  var x = getProp(stylesheet[type], property, zoom)
  if (x !== undefined) return x
  if (type !== undefined) {
    var dtype = type.split('.')[0]+'.*'
    var y = getProp(stylesheet[dtype], property, zoom)
    if (y !== undefined) return y
  }
  var z = getProp(stylesheet['*'], property, zoom)
  if (z !== undefined) return z
  else return defaults[property]
}

function getProp (rules, property, zoom) {
  if (!rules) return undefined
  var zkey = property + "[zoom=" + zoom + "]"
  if (rules[zkey] !== undefined) {
    return rules[zkey]
  }
  if (rules[property] !== undefined) {
    return rules[property]
  }
}

function parseZooms (stylesheet) {
  var vars = { zoom: 0 }
  var keys = Object.keys(stylesheet)
  for (var i=0; i<keys.length; i++) {
    var pkeys = Object.keys(stylesheet[keys[i]])
    for (var j=0; j<pkeys.length; j++) {
      var m = /([\w-]+)(?:\s*\[([^\]]*)\]\s*)/.exec(pkeys[j])
      if (!m) continue
      for (var zoom=zoomStart; zoom<=zoomEnd; zoom++) {
        vars.zoom = zoom
        if (!evalExpr(m[2], vars)) continue
        var zkey = m[1] + "[zoom=" + zoom + "]"
        stylesheet[keys[i]][zkey] = stylesheet[keys[i]][pkeys[j]]
      }
    }
  }
  return stylesheet
}

function parseKeys (stylesheet) {
  var keys = Object.keys(stylesheet)
  for (var i=0; i<keys.length; i++) {
    var re = /((?:{[^}]+}|[^,])+)\s*(?:,|$)\s*/g
    var m
    var nmatches = 0
    while (m = re.exec(keys[i])) {
      var e = expand(m[1])
      for (var j=0; j<e.length; j++) {
        nmatches++
        stylesheet[e[j]] = stylesheet[keys[i]]
      }
    }
    if (nmatches > 1) {
      delete stylesheet[keys[i]]
    }
  }
  return stylesheet
}

function getSpriteFiles (defaults, stylesheet) {
  var spriteFileNames = new Set()
  var dkeys = Object.keys(defaults)
  var keys = Object.keys(stylesheet)
  var re = /(-sprite)+/g
  for (var h=0; h<dkeys.length; h++) {
    if (re.test(dkeys[h]))  {
      spriteFileNames.add(defaults[dkeys[h]])
    }
  }
  for (var i=0; i<keys.length; i++) {
    if (stylesheet[keys[i]] !== undefined) {
      k = Object.keys(stylesheet[keys[i]])
      for (var j=0; j<k.length; j++) {
        if (re.test(k[j])) {
          spriteFileNames.add(stylesheet[keys[i]][k[j]])
        }
      }
    }
  }
  return spriteFileNames
}

function fileExists (fileName, cb) {
  fs.stat(fileName, function (error, stats) {
    if (error && error.code === 'ENOENT') cb(null, false)
    else if (error) cb(error)
    else cb(null, stats.isFile())
  })
}

function readSpriteFiles (spriteFileNames, cb) {
  var pending = 1
  var sprites = {}
  spriteFileNames.forEach(file => {
    pending++
    fs.readFile(file, function onRead (err, buf) {
      if (err) {
        var f = cb
        cb = noop
        return f(err)
      }
      sprites[file] = buf
      if (--pending === 0) cb(null, sprites)
    })
  })
  if (--pending === 0) cb(null, sprites)
}

function findOffset(x, y, imageWidth) {
  return (x + imageWidth * y) * 4
}

function getSprite () {}

function noop () {}
