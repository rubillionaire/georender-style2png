const test = require('brittle')
const fs = require('node:fs/promises')
const path = require('node:path')
const {encode, decode} = require('fast-png')
const makeTex = require('../promise')
const defaults = require('../defaults.json')
const features = require('@rubenrodriguez/georender-pack/features.json')
const stylesheet = require('./stylesheet')
const Read = require('../read')
const Settings = require('../settings')
const parseHex = require('../lib/parse-hex')

const featureType = features[Math.floor(Math.random() * (features.length - 1))]
const featureIndex = features.indexOf(featureType)
const zoom = 8
const stylesheetOpts = {
  featureType,
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

// makeText () => { tex, texPngFile }
// readTex (tex) => results
// sourceLibOutput (tex) => readTex(tex)
// sourcePngOutput (textPngFile) => readTex(readPng(tex))

test('read', async (t) => {
  const tex = await makeTex({
    defaults,
    features,
    stylesheet: stylesheet(stylesheetOpts)
  })

  const { data, width, height } = tex
  const png = encode({
    data,
    width,
    height,
  })
  const json = JSON.stringify({
    fontFamily: tex.labelFontFamily,
  })

  const texPngFile = path.join(__dirname, 'tex.png')
  const texJsonFile = path.join(__dirname, 'tex.json')
  await fs.writeFile(texPngFile, png)
  await fs.writeFile(texJsonFile, json)

  const inflightOpts = {
    labelOpts: {
      fontFamily: tex.labelFontFamily,
    },
    readOpts: {
      pixels: tex.data,
      imageWidth: tex.settings.imageWidth,
      zoomCount: tex.settings.zoomCount,
    }
  }

  const settings = Settings()
  const pngOpts = {
    labelOpts: JSON.parse((await fs.readFile(texJsonFile)).toString()),
    readOpts: {
      pixels: decode(await fs.readFile(texPngFile)).data,
      imageWidth: settings.imageWidth,
      zoomCount: settings.zoomCount,
    },
  }

  t.ok(true, `${featureType}: results`)

  t.test('read : inflight', (sub) => readTests(sub, inflightOpts))
  t.test('read : png', (sub) => readTests(sub, pngOpts))

  await fs.unlink(texPngFile)
  await fs.unlink(texJsonFile)

  t.end()
})

function readTests (t, { labelOpts, readOpts }) {
  const read = Read(readOpts)

  const po8 = read.opacity('point', featureIndex, zoom)
  const lo8 = read.opacity('line', featureIndex, zoom)
  const ao8 = read.opacity('area', featureIndex, zoom)
  const abo8 = read.opacity('areaBorder', featureIndex, zoom)
  const abo11 = read.opacity('areaBorder', featureIndex, 11)

  t.is(po8, stylesheetOpts.baseOpacity, `point : opacity ${stylesheetOpts.baseOpacity} : zoom ${zoom}`)
  t.is(lo8, stylesheetOpts.baseOpacity, `line : opacity ${stylesheetOpts.baseOpacity} : zoom ${zoom}`)
  t.is(ao8, stylesheetOpts.baseOpacity, `area : opacity ${stylesheetOpts.baseOpacity} : zoom ${zoom}`)
  t.is(abo8, stylesheetOpts.baseOpacity, `areaBorder : opacity ${stylesheetOpts.baseOpacity} : zoom ${zoom}`)
  t.is(abo11, stylesheetOpts.doubleOpacity, `areaBorder : opacity ${stylesheetOpts.doubleOpacity} : zoom 11`)

  const labelFillColorRgb = parseHex(stylesheetOpts.labelFillColor)
  const labelStrokeColorRgb = parseHex(stylesheetOpts.labelStrokeColor)

  const pl = read.label('point', featureIndex, 8)
  const ll = read.label('line', featureIndex, 8)
  const al = read.label('area', featureIndex, 8)

  t.is(pl.pointSize, stylesheetOpts.pointSize, `point : point size ${stylesheetOpts.pointSize} : zoom ${zoom}`)

  t.is(pl.fillColor[0], labelFillColorRgb[0], `point : label fill color red ${labelFillColorRgb[0]} : zoom ${zoom}`)
  t.is(pl.fillColor[1], labelFillColorRgb[1], `point : label fill color green ${labelFillColorRgb[1]} : zoom ${zoom}`)
  t.is(pl.fillColor[2], labelFillColorRgb[2], `point : label fill color blue ${labelFillColorRgb[2]} : zoom ${zoom}`)

  t.is(ll.fillColor[0], labelFillColorRgb[0], `line : label fill color red ${labelFillColorRgb[0]} : zoom ${zoom}`)
  t.is(ll.fillColor[1], labelFillColorRgb[1], `line : label fill color green ${labelFillColorRgb[1]} : zoom ${zoom}`)
  t.is(ll.fillColor[2], labelFillColorRgb[2], `line : label fill color blue ${labelFillColorRgb[2]} : zoom ${zoom}`)

  t.is(al.fillColor[0], labelFillColorRgb[0], `area : label fill color red ${labelFillColorRgb[0]} : zoom ${zoom}`)
  t.is(al.fillColor[1], labelFillColorRgb[1], `area : label fill color green ${labelFillColorRgb[1]} : zoom ${zoom}`)
  t.is(al.fillColor[2], labelFillColorRgb[2], `area : label fill color blue ${labelFillColorRgb[2]} : zoom ${zoom}`)

  t.is(pl.fillOpacity, stylesheetOpts.baseOpacity, `point : label fill opacity ${stylesheetOpts.baseOpacity} : zoom ${zoom}`)
  t.is(ll.fillOpacity, stylesheetOpts.baseOpacity, `line : label fill opacity ${stylesheetOpts.baseOpacity} : zoom ${zoom}`)
  t.is(al.fillOpacity, stylesheetOpts.baseOpacity, `area : label fill opacity ${stylesheetOpts.baseOpacity} : zoom ${zoom}`)

  t.is(al.strokeColor[0], labelStrokeColorRgb[0], `area : label stroke color red ${labelStrokeColorRgb[0]} : zoom ${zoom}`)
  t.is(al.strokeColor[1], labelStrokeColorRgb[1], `area : label stroke color green ${labelStrokeColorRgb[1]} : zoom ${zoom}`)
  t.is(al.strokeColor[2], labelStrokeColorRgb[2], `area : label stroke color blue ${labelStrokeColorRgb[2]} : zoom ${zoom}`)

  t.is(pl.strokeOpacity, stylesheetOpts.baseOpacity, `point : label stroke opacity ${stylesheetOpts.baseOpacity} : zoom ${zoom}`)
  t.is(ll.strokeOpacity, stylesheetOpts.baseOpacity, `line : label stroke opacity ${stylesheetOpts.baseOpacity} : zoom ${zoom}`)
  t.is(al.strokeOpacity, stylesheetOpts.baseOpacity, `area : label stroke opacity ${stylesheetOpts.baseOpacity} : zoom ${zoom}`)

  t.is(labelOpts.fontFamily[pl.fontFamily], stylesheetOpts.labelFontFamily1, `point : label font family ${stylesheetOpts.labelFontFamily1} : zoom ${zoom}`)
  t.is(labelOpts.fontFamily[ll.fontFamily], stylesheetOpts.labelFontFamily2, `line : label font family ${stylesheetOpts.labelFontFamily2} : zoom ${zoom}`)
  t.is(labelOpts.fontFamily[al.fontFamily], stylesheetOpts.labelFontFamily2, `area : label font family ${stylesheetOpts.labelFontFamily2} : zoom ${zoom}`)

  t.is(pl.fontSize, stylesheetOpts.labelFontSize, `point : label font size ${stylesheetOpts.labelFontSize} : zoom ${zoom}`)
  t.is(ll.fontSize, stylesheetOpts.labelFontSize, `line : label font size ${stylesheetOpts.labelFontSize} : zoom ${zoom}`)
  t.is(al.fontSize, stylesheetOpts.labelFontSize, `area : label font size ${stylesheetOpts.labelFontSize} : zoom ${zoom}`)

  t.is(pl.priority, stylesheetOpts.labelPriority, `point : label priority ${stylesheetOpts.labelPriority} : zoom ${zoom}`)
  t.is(ll.priority, stylesheetOpts.labelPriority, `line : label priority ${stylesheetOpts.labelPriority} : zoom ${zoom}`)
  t.is(al.priority, stylesheetOpts.labelPriority, `area : label priority ${stylesheetOpts.labelPriority} : zoom ${zoom}`)

  t.is(pl.constraints, stylesheetOpts.labelConstraints, `point : label constraints ${stylesheetOpts.labelConstraints} : zoom ${zoom}`)
  t.is(ll.constraints, stylesheetOpts.labelConstraints, `line : label constraints ${stylesheetOpts.labelConstraints} : zoom ${zoom}`)
  t.is(al.constraints, stylesheetOpts.labelConstraints, `area : label constraints ${stylesheetOpts.labelConstraints} : zoom ${zoom}`)

  t.is(pl.strokeWidth, stylesheetOpts.labelStrokeWidth, `point : label stroke width ${stylesheetOpts.labelStrokeWidth} : zoom ${zoom}`)
  t.is(ll.strokeWidth, stylesheetOpts.labelStrokeWidth, `line : label stroke width ${stylesheetOpts.labelStrokeWidth} : zoom ${zoom}`)
  t.is(al.strokeWidth, stylesheetOpts.labelStrokeWidth, `area : label stroke width ${stylesheetOpts.labelStrokeWidth} : zoom ${zoom}`)

  const pz = read.zindex('point', featureIndex, zoom)
  const lz = read.zindex('line', featureIndex, zoom)
  const az = read.zindex('area', featureIndex, zoom)

  t.is(pz, stylesheetOpts.zindex, `point : zindex ${stylesheetOpts.zindex} : zoom ${zoom}`)
  t.is(lz, stylesheetOpts.zindex, `line : zindex ${stylesheetOpts.zindex} : zoom ${zoom}`)
  t.is(az, stylesheetOpts.zindex, `area : zindex ${stylesheetOpts.zindex} : zoom ${zoom}`)
}