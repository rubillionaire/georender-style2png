module.exports = function parseHex (hex) {
  return hex.match(/([0-9a-f]{2})/ig).map(s => parseInt(s,16))
}
