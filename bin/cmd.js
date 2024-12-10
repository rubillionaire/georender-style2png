#!/usr/bin/env node
var fs = require('fs')
var minimist = require('minimist')
var { encode } = require('fast-png')
var makeTex = require('../index.js')

var args = minimist(process.argv.slice(2), {
  alias: {
    d: 'defaults',
    s: 'stylesheet',
    f: 'features',
    o: 'outname',
    op: 'outpng',
    oj: 'outjson',
  }
})

if (args.help) usage(0)

var sfile = args.stylesheet || args._[0]
if (!sfile) usage(1)
var ffile = args.features || require.resolve('@rubenrodriguez/georender-pack/features.json')
var dfile = args.defaults || require.resolve('../defaults.json')

makeTex({
  stylesheet: JSON.parse(fs.readFileSync(sfile, 'utf8')),
  features: JSON.parse(fs.readFileSync(ffile, 'utf8')),
  defaults: JSON.parse(fs.readFileSync(dfile, 'utf8'))
}, function (err, tex) {
  if (err) return console.error(err)
  const { data, width, height } = tex
  var png = encode({ data, width, height })
  const outpng = args.outpng
    ? args.outpng
    : args.outname
      ? `${args.outname}.png`
      : 'tex.png'
  fs.writeFileSync(outpng, png)
  const outjson = args.outjson
    ? args.outjson
    : args.outname
      ? `${args.outname}.json`
      : 'tex.json'
  if (tex.labelFontFamily.length > 0) {
    const labelOpts = {
      fontFamily: tex.labelFontFamily,
    }
    fs.writeFileSync(outjson, JSON.stringify(labelOpts))
  }
})

function usage (code) {
  console.log(`
    usage: georender-style2png {OPTIONS} [stylesheet file]

    options:
      
      --stylesheet, -s  JSON file with an object specifying
                        georender styles.

      --features, -f    JSON file with OSM features mapped
                        to number values. default:
                        georender-pack/features.json
                        
      --defaults, -d    JSON file with default style settings.
                        default: defaults.json

      --outname, -o     Write PNG and JSON data to this file name.{png,json}.
                        Use instead of --{outpng,outjson} to use common name.
                        default: tex.{png,json}

      --outpng, -op     Write PNG to this file name.
      
      --outjson, -oj    Write JSON to this file name. Only written if
                        there are {point,line,area}-font values defined.
  `.replace(/^ {4}/mg,''))
  process.exit(code)
}
