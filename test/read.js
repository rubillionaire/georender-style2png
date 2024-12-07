const test = require('brittle')
const makeTex = require('../promise')
const defaults = require('../defaults.json')
const features = require('@rubenrodriguez/georender-pack/features.json')
const stylesheet = require('./stylesheet')
const Read = require('../read')
const Settings = require('../settings')
const parseHex = require('../lib/parse-hex')

test('read', async (t) => {
  const lighthouseIndex = features.indexOf('man_made.lighthouse')
  const stylesheetOpts = {
    baseOpacity: 24,
    doubleOpacity: 24 * 2,
    labelFillColor: "#ea0064",
    labelStrokeColor: "#008580",
    labelFontFamily1: 'sans-serif',
    labelFontFamily2: 'serif',
    labelFontSize: 16,
    labelPriority: 55,
    labelConstraints: 0,
    labelStrokeWidth: 4,
    pointSize: 32,
    zindex: 17,
  }
  const tex = await makeTex({
    defaults,
    features,
    stylesheet: stylesheet(stylesheetOpts)
  })

  const read = Read({
    pixels: tex.data,
    imageWidth: tex.settings.imageWidth,
    zoomCount: tex.settings.zoomCount,
  })

  const po8 = read.opacity('point', lighthouseIndex, 8)
  const lo8 = read.opacity('line', lighthouseIndex, 8)
  const ao8 = read.opacity('area', lighthouseIndex, 8)
  const abo8 = read.opacity('areaBorder', lighthouseIndex, 8)
  const abo11 = read.opacity('areaBorder', lighthouseIndex, 11)

  t.is(po8, stylesheetOpts.baseOpacity, `point : opacity ${stylesheetOpts.baseOpacity} : zoom 8`)
  t.is(lo8, stylesheetOpts.baseOpacity, `line : opacity ${stylesheetOpts.baseOpacity} : zoom 8`)
  t.is(ao8, stylesheetOpts.baseOpacity, `area : opacity ${stylesheetOpts.baseOpacity} : zoom 8`)
  t.is(abo8, stylesheetOpts.baseOpacity, `areaBorder : opacity ${stylesheetOpts.baseOpacity} : zoom 8`)
  t.is(abo11, stylesheetOpts.doubleOpacity, `areaBorder : opacity ${stylesheetOpts.doubleOpacity} : zoom 11`)

  const labelFillColorRgb = parseHex(stylesheetOpts.labelFillColor)
  const labelStrokeColorRgb = parseHex(stylesheetOpts.labelStrokeColor)

  const pl = read.label('point', lighthouseIndex, 8)
  const ll = read.label('line', lighthouseIndex, 8)
  const al = read.label('area', lighthouseIndex, 8)

  t.is(pl.pointSize, stylesheetOpts.pointSize, `point : point size ${stylesheetOpts.pointSize} : zoom 8`)

  t.is(pl.fillColor[0], labelFillColorRgb[0], `point : label fill color red ${labelFillColorRgb[0]} : zoom 8`)
  t.is(pl.fillColor[1], labelFillColorRgb[1], `point : label fill color green ${labelFillColorRgb[1]} : zoom 8`)
  t.is(pl.fillColor[2], labelFillColorRgb[2], `point : label fill color blue ${labelFillColorRgb[2]} : zoom 8`)

  t.is(ll.fillColor[0], labelFillColorRgb[0], `line : label fill color red ${labelFillColorRgb[0]} : zoom 8`)
  t.is(ll.fillColor[1], labelFillColorRgb[1], `line : label fill color green ${labelFillColorRgb[1]} : zoom 8`)
  t.is(ll.fillColor[2], labelFillColorRgb[2], `line : label fill color blue ${labelFillColorRgb[2]} : zoom 8`)

  t.is(al.fillColor[0], labelFillColorRgb[0], `area : label fill color red ${labelFillColorRgb[0]} : zoom 8`)
  t.is(al.fillColor[1], labelFillColorRgb[1], `area : label fill color green ${labelFillColorRgb[1]} : zoom 8`)
  t.is(al.fillColor[2], labelFillColorRgb[2], `area : label fill color blue ${labelFillColorRgb[2]} : zoom 8`)

  t.is(pl.fillOpacity, stylesheetOpts.baseOpacity, `point : label fill opacity ${stylesheetOpts.baseOpacity} : zoom 8`)
  t.is(ll.fillOpacity, stylesheetOpts.baseOpacity, `line : label fill opacity ${stylesheetOpts.baseOpacity} : zoom 8`)
  t.is(al.fillOpacity, stylesheetOpts.baseOpacity, `area : label fill opacity ${stylesheetOpts.baseOpacity} : zoom 8`)

  t.is(al.strokeColor[0], labelStrokeColorRgb[0], `area : label stroke color red ${labelStrokeColorRgb[0]} : zoom 8`)
  t.is(al.strokeColor[1], labelStrokeColorRgb[1], `area : label stroke color green ${labelStrokeColorRgb[1]} : zoom 8`)
  t.is(al.strokeColor[2], labelStrokeColorRgb[2], `area : label stroke color blue ${labelStrokeColorRgb[2]} : zoom 8`)

  t.is(pl.strokeOpacity, stylesheetOpts.baseOpacity, `point : label stroke opacity ${stylesheetOpts.baseOpacity} : zoom 8`)
  t.is(ll.strokeOpacity, stylesheetOpts.baseOpacity, `line : label stroke opacity ${stylesheetOpts.baseOpacity} : zoom 8`)
  t.is(al.strokeOpacity, stylesheetOpts.baseOpacity, `area : label stroke opacity ${stylesheetOpts.baseOpacity} : zoom 8`)

  t.is(tex.labelFontFamily[pl.fontFamily], stylesheetOpts.labelFontFamily1, `point : label font family ${stylesheetOpts.labelFontFamily1} : zoom 8`)
  t.is(tex.labelFontFamily[ll.fontFamily], stylesheetOpts.labelFontFamily2, `line : label font family ${stylesheetOpts.labelFontFamily2} : zoom 8`)
  t.is(tex.labelFontFamily[al.fontFamily], stylesheetOpts.labelFontFamily2, `area : label font family ${stylesheetOpts.labelFontFamily2} : zoom 8`)

  t.is(pl.fontSize, stylesheetOpts.labelFontSize, `point : label font size ${stylesheetOpts.labelFontSize} : zoom 8`)
  t.is(ll.fontSize, stylesheetOpts.labelFontSize, `line : label font size ${stylesheetOpts.labelFontSize} : zoom 8`)
  t.is(al.fontSize, stylesheetOpts.labelFontSize, `area : label font size ${stylesheetOpts.labelFontSize} : zoom 8`)

  t.is(pl.priority, stylesheetOpts.labelPriority, `point : label priority ${stylesheetOpts.labelPriority} : zoom 8`)
  t.is(ll.priority, stylesheetOpts.labelPriority, `line : label priority ${stylesheetOpts.labelPriority} : zoom 8`)
  t.is(al.priority, stylesheetOpts.labelPriority, `area : label priority ${stylesheetOpts.labelPriority} : zoom 8`)

  t.is(pl.constraints, stylesheetOpts.labelConstraints, `point : label constraints ${stylesheetOpts.labelConstraints} : zoom 8`)
  t.is(ll.constraints, stylesheetOpts.labelConstraints, `line : label constraints ${stylesheetOpts.labelConstraints} : zoom 8`)
  t.is(al.constraints, stylesheetOpts.labelConstraints, `area : label constraints ${stylesheetOpts.labelConstraints} : zoom 8`)

  t.is(pl.strokeWidth, stylesheetOpts.labelStrokeWidth, `point : label stroke width ${stylesheetOpts.labelStrokeWidth} : zoom 8`)
  t.is(ll.strokeWidth, stylesheetOpts.labelStrokeWidth, `line : label stroke width ${stylesheetOpts.labelStrokeWidth} : zoom 8`)
  t.is(al.strokeWidth, stylesheetOpts.labelStrokeWidth, `area : label stroke width ${stylesheetOpts.labelStrokeWidth} : zoom 8`)

  const pz = read.zindex('point', lighthouseIndex, 8)
  const lz = read.zindex('line', lighthouseIndex, 8)
  const az = read.zindex('area', lighthouseIndex, 8)

  t.is(pz, stylesheetOpts.zindex, `point : zindex ${stylesheetOpts.zindex} : zoom 8`)
  t.is(lz, stylesheetOpts.zindex, `line : zindex ${stylesheetOpts.zindex} : zoom 8`)
  t.is(az, stylesheetOpts.zindex, `area : zindex ${stylesheetOpts.zindex} : zoom 8`)

  t.end()
})
