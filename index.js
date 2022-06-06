var expand = require('brace-expansion')
var evalExpr = require('./lib/expr.js')
var settings = require('./settings.js')()
var zoomStart = settings.zoomStart
var zoomEnd = settings.zoomEnd //inclusive

module.exports = function (opts) {
  var defaults = opts.defaults
  var stylesheet = opts.stylesheet
  parseKeys(stylesheet)
  parseZooms(stylesheet)
  var fkeys = opts.features
  var lw
  var heights = settings.heights
  var ranges = settings.ranges
  var totalHeight = settings.totalHeight
  var arrLength = 4*fkeys.length*totalHeight

  var data = new Uint8Array(arrLength)
  var offset = 0
  for (var y = zoomStart; y <= zoomEnd; y++) { //point
    for (var x = 0; x < fkeys.length; x++) {
      var a = parseHex(getStyle(defaults, stylesheet, fkeys[x], "point-fill-color", y))
      data[offset++] = a[0] //r
      data[offset++] = a[1] //g
      data[offset++] = a[2] //b
      data[offset++] = getStyle(defaults, stylesheet, fkeys[x], "point-opacity", y) //a
    }
    for (var x = 0; x < fkeys.length; x++) {
      var b = parseHex(getStyle(defaults, stylesheet, fkeys[x], "point-stroke-color", y))
      data[offset++] = b[0] //r
      data[offset++] = b[1] //g
      data[offset++] = b[2] //b
      data[offset++] = getStyle(defaults, stylesheet, fkeys[x], "point-opacity", y) //a
    }
    for (var x = 0; x < fkeys.length; x++) {
      data[offset++] = getStyle(defaults, stylesheet, fkeys[x], "point-size", y)
      data[offset++] = 0 //point-stroke-width-inner
      data[offset++] = 0 //point-stroke-width-outer
      data[offset++] = getStyle(defaults, stylesheet, fkeys[x], "point-zindex", y)
    }
    for (var x = 0; x < fkeys.length; x++) {
      data[offset++] = 0 //point-label-fill-color R
      data[offset++] = 0 //point-label-fill-color G
      data[offset++] = 0 //point-label-fill-color B 
      data[offset++] = 255 //point-label-fill-opacity
    }
    for (var x = 0; x < fkeys.length; x++) {
      data[offset++] = 0 //point-label-stroke-color R
      data[offset++] = 0 //point-label-stroke-color G
      data[offset++] = 0 //point-label-stroke-color B
      data[offset++] = 255 //point-label-stroke-opacity
    }
    for (var x = 0; x < fkeys.length; x++) {
      data[offset++] = 0 //point-label-font
      data[offset++] = 0 //point-label-font-size
      data[offset++] = 0 //point-label-priority
      data[offset++] = 255 //point-label-constraints
    }
    for (var x = 0; x < fkeys.length; x++) {
      data[offset++] = 0 //point-label-stroke-width
      data[offset++] = 0 //point-label-sprite
      data[offset++] = 0 //sprite0
      data[offset++] = 255 //sprite1
    }
  }
  for (var y = zoomStart; y <= zoomEnd; y++) { //line
    for (var x = 0; x < fkeys.length; x++) {
      var b = parseHex(getStyle(defaults, stylesheet, fkeys[x], "line-fill-color", y))
      data[offset++] = b[0] //r
      data[offset++] = b[1] //g
      data[offset++] = b[2] //b
      data[offset++] = getStyle(defaults, stylesheet, fkeys[x], "line-opacity", y) //a
      }
    for (var x = 0; x < fkeys.length; x++) {
      var c = parseHex(getStyle(defaults, stylesheet, fkeys[x], "line-stroke-color", y))
      data[offset++] = c[0] //r
      data[offset++] = c[1] //g
      data[offset++] = c[2] //b
      data[offset++] = getStyle(defaults, stylesheet, fkeys[x], "line-opacity", y) //a
    }
    for (var x = 0; x < fkeys.length; x++) {
      var lineStyleFill = parseLineStyle(defaults, stylesheet, fkeys[x], 'fill')
      var lineStyleStroke = parseLineStyle(defaults, stylesheet, fkeys[x], 'stroke')

      data[offset++] = lineStyleFill.dashLength
      data[offset++] = lineStyleFill.dashGap
      data[offset++] = lineStyleStroke.dashLength
      data[offset++] = lineStyleStroke.dashGap
    }
    for (var x = 0; x < fkeys.length; x++) {
      data[offset++] = getStyle(defaults, stylesheet, fkeys[x], "line-fill-width", y)
      data[offset++] = getStyle(defaults, stylesheet, fkeys[x], "line-stroke-width", y)
      data[offset++] = 0 //line-stroke-width-outer
      data[offset++] = getStyle(defaults, stylesheet, fkeys[x], "line-zindex", y)
    }
    for (var x = 0; x < fkeys.length; x++) {
      data[offset++] = 0 //line-label-fill-color R
      data[offset++] = 0 //line-label-fill-color G
      data[offset++] = 0 //line-label-fill-color B 
      data[offset++] = 255 //line-label-fill-opacity
    }
    for (var x = 0; x < fkeys.length; x++) {
      data[offset++] = 0 //line-label-stroke-color R
      data[offset++] = 0 //line-label-stroke-color G
      data[offset++] = 0 //line-label-stroke-color B
      data[offset++] = 255 //line-label-stroke-opacity
    }
    for (var x = 0; x < fkeys.length; x++) {
      data[offset++] = 0 //line-label-font
      data[offset++] = 0 //line-label-font-size
      data[offset++] = 0 //line-label-priority
      data[offset++] = 255 //line-label-constraints
    }
    for (var x = 0; x < fkeys.length; x++) {
      data[offset++] = 0 //line-label-stroke-width
      data[offset++] = 0 //line-label-sprite
      data[offset++] = 0 //sprite0
      data[offset++] = 255 //sprite1
    }
  }
  for (var y = zoomStart; y <= zoomEnd; y++) { //area
    for (var x = 0; x < fkeys.length; x++) {
      var d = parseHex(getStyle(defaults, stylesheet, fkeys[x], "area-fill-color", y))
      data[offset++] = d[0] //r
      data[offset++] = d[1] //g
      data[offset++] = d[2] //b
      data[offset++] = getStyle(defaults, stylesheet, fkeys[x], "area-opacity", y) //a
    }
    for (var x = 0; x < fkeys.length; x++) {
      data[offset++] = getStyle(defaults, stylesheet, fkeys[x], "area-zindex", y)
      data[offset++] = 0 //area-label-stroke-width
      data[offset++] = 0 //reserved
      data[offset++] = 255 //reserved
    }
    for (var x = 0; x < fkeys.length; x++) {
      data[offset++] = 0 //area-label-fill-color R
      data[offset++] = 0 //area-label-fill-color G
      data[offset++] = 0 //area-label-fill-color B 
      data[offset++] = 255 //area-label-fill-opacity
    }
    for (var x = 0; x < fkeys.length; x++) {
      data[offset++] = 0 //area-label-stroke-color R
      data[offset++] = 0 //area-label-stroke-color G
      data[offset++] = 0 //area-label-stroke-color B
      data[offset++] = 255 //area-label-stroke-opacity
    }
    for (var x = 0; x < fkeys.length; x++) {
      data[offset++] = 0 //area-label-font
      data[offset++] = 0 //area-label-font-size
      data[offset++] = 0 //area-label-priority
      data[offset++] = 255 //area-label-constraints
    }
    for (var x = 0; x < fkeys.length; x++) {
      data[offset++] = 0 //area-label-sprite
      data[offset++] = 0 //sprite0
      data[offset++] = 0 //sprite1
      data[offset++] = 255 //reserved
    }
  }
  for (var y = zoomStart; y <= zoomEnd; y++) { //areaborder
    for (var x = 0; x < fkeys.length; x++) {
      var d = parseHex(getStyle(defaults, stylesheet, fkeys[x], "area-border-color", y))
      data[offset++] = d[0] //r
      data[offset++] = d[1] //g
      data[offset++] = d[2] //b
      data[offset++] = getStyle(defaults, stylesheet, fkeys[x], "area-border-opacity", y) //a
    }
    for (var x = 0; x < fkeys.length; x++) {
      var areaBorderStyle = parseAreaBorderStyle (defaults, stylesheet, fkeys[x], y)
      data[offset++] = areaBorderStyle.dashLength
      data[offset++] = areaBorderStyle.dashGap
      data[offset++] = getStyle(defaults, stylesheet, fkeys[x], "area-border-width", y) //areaborder-width-inner
      data[offset++] = 255 //areaborder-width-outer
    }
    for (var x = 0; x < fkeys.length; x++) {
      data[offset++] = getStyle(defaults, stylesheet, fkeys[x], "area-border-zindex", y)
      data[offset++] = 0 //sprite0
      data[offset++] = 0 //sprite1
      data[offset++] = 255 //reserved
    }
  }
  return { 
    data,
    width: fkeys.length,
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
