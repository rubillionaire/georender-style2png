module.exports = read

function read ({ pixels, zoomCount, imageWidth }) {
  return {
    opacity: (key, type, zoom) => opacity(key, type, zoom, { pixels, imageWidth, zoomCount }),
    label: (key, type, zoom) => label(key, type, zoom, { pixels, imageWidth, zoomCount })
  }
}

function opacity (key, type, zoom, { pixels, imageWidth, zoomCount }) {
  const y = yOffset(key, zoom, zoomCount)
  const index = (type + y * imageWidth) * 4 + 3
  return pixels[index]
}

function label (key, type, zoom, { pixels, imageWidth, zoomCount }) {
  const y = yOffset(key, zoom, zoomCount)
  const fillColor = []
  let fillOpacity
  const strokeColor = []
  let strokeOpacity
  let fontFamily
  let fontSize
  let priority
  let constraints
  let strokeWidth
  const typeSpecific = {}
  if (key === 'point') {
    let prevFkeyLoops = 2
    const x3 = xOffset(type, prevFkeyLoops, imageWidth)
    const i3 = vec4Index(x3, y, imageWidth)
    typeSpecific.pointSize = pixels[i3 + 0]
    prevFkeyLoops += 1
    const x4 = xOffset(type, prevFkeyLoops, imageWidth)
    const i4 = vec4Index(x4, y, imageWidth)
    fillColor[0] = pixels[i4 + 0]
    fillColor[1] = pixels[i4 + 1]
    fillColor[2] = pixels[i4 + 2]
    fillOpacity = pixels[i4 + 3]
    prevFkeyLoops += 1
    const x5 = xOffset(type, prevFkeyLoops, imageWidth)
    const i5 = vec4Index(x5, y, imageWidth)
    strokeColor[0] = pixels[i5 + 0]
    strokeColor[1] = pixels[i5 + 1]
    strokeColor[2] = pixels[i5 + 2]
    strokeOpacity = pixels[i5 + 3]
    prevFkeyLoops += 1
    const x6 = xOffset(type, prevFkeyLoops, imageWidth)
    const i6 = vec4Index(x6, y, imageWidth)
    fontFamily = pixels[i6 + 0]
    fontSize = pixels[i6 + 1]
    priority = pixels[i6 + 2]
    constraints = pixels[i6 + 3]
    prevFkeyLoops += 1
    const x7 = xOffset(type, prevFkeyLoops, imageWidth)
    const i7 = vec4Index(x7, y, imageWidth)
    strokeWidth = pixels[i7 + 0]
  }
  else if (key === 'line') {
    let prevFkeyLoops = 4
    const x5 = xOffset(type, prevFkeyLoops, imageWidth)
    const i5 = vec4Index(x5, y, imageWidth)
    fillColor[0] = pixels[i5 + 0]
    fillColor[1] = pixels[i5 + 1]
    fillColor[2] = pixels[i5 + 2]
    fillOpacity = pixels[i5 + 3]
    prevFkeyLoops += 1
    const x6 = xOffset(type, prevFkeyLoops, imageWidth)
    const i6 = vec4Index(x6, y, imageWidth)
    strokeColor[0] = pixels[i6 + 0]
    strokeColor[1] = pixels[i6 + 1]
    strokeColor[2] = pixels[i6 + 2]
    strokeOpacity = pixels[i6 + 3]
    prevFkeyLoops += 1
    const x7 = xOffset(type, prevFkeyLoops, imageWidth)
    const i7 = vec4Index(x7, y, imageWidth)
    fontFamily = pixels[i7 + 0]
    fontSize = pixels[i7 + 1]
    priority = pixels[i7 + 2]
    constraints = pixels[i7 + 3]
    prevFkeyLoops += 1
    const x8 = xOffset(type, prevFkeyLoops, imageWidth)
    const i8 = vec4Index(x8, y, imageWidth)
    strokeWidth = pixels[i8 + 0]
  }
  else if (key === 'area') {
    let prevFkeyLoops = 1
    const x2 = xOffset(type, prevFkeyLoops, imageWidth)
    const i2 = vec4Index(x2, y, imageWidth)
    strokeWidth = pixels[i2 + 1]
    prevFkeyLoops += 1
    const x3 = xOffset(type, prevFkeyLoops, imageWidth)
    const i3 = vec4Index(x3, y, imageWidth)
    fillColor[0] = pixels[i3 + 0]
    fillColor[1] = pixels[i3 + 1]
    fillColor[2] = pixels[i3 + 2]
    fillOpacity = pixels[i3 + 3]
    prevFkeyLoops += 1
    const x4 = xOffset(type, prevFkeyLoops, imageWidth)
    const i4 = vec4Index(x4, y, imageWidth)
    strokeColor[0] = pixels[i4 + 0]
    strokeColor[1] = pixels[i4 + 1]
    strokeColor[2] = pixels[i4 + 2]
    strokeOpacity = pixels[i4 + 3]
    prevFkeyLoops += 1
    const x5 = xOffset(type, prevFkeyLoops, imageWidth)
    const i5 = vec4Index(x5, y, imageWidth)
    fontFamily = pixels[i5 + 0]
    fontSize = pixels[i5 + 1]
    priority = pixels[i5 + 2]
    constraints = pixels[i5 + 3]
  }

  return {
    fillColor,
    fillOpacity,
    strokeColor,
    strokeOpacity,
    fontFamily,
    fontSize,
    priority,
    constraints,
    strokeWidth,
    ...typeSpecific,
  }
}

function yOffset (key, zoom, zoomCount) {
  switch (key) {
    case 'point': return zoom * 7
    case 'line': return (zoomCount * 7) + (zoom * 8)
    case 'area': return (zoomCount * 7) + (zoomCount * 8) + (zoom * 6)
    case 'areaBorder': return (zoomCount * 7) + (zoomCount * 8) + (zoomCount * 6) + (zoom * 3)
    default: throw new Error('must define a key : point | line | area | areaBorder')
  }
}

function xOffset (type, prevFkeyLoops, imageWidth) {
  return imageWidth * prevFkeyLoops + type
}

function vec4Index (x, y, imageWidth) {
  return (x + y * imageWidth) * 4
}
