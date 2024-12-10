module.exports = function ({
    featureType,
    baseOpacity,
    doubleOpacity,
    labelFillColor,
    labelStrokeColor,
    labelFontFamily1,
    labelFontFamily2,
    labelFontSize,
    labelPriority,
    labelConstraints,
    labelStrokeWidth,
    pointSize,
    zindex,
  }) {
  return {
    [featureType]: {
      "point-opacity": baseOpacity,
      "line-opacity": baseOpacity,
      "area-opacity": baseOpacity,
      "area-border-opacity[zoom<10]": baseOpacity,
      "area-border-opacity[zoom>=10]": doubleOpacity,
      "point-label-fill-color": labelFillColor,
      "point-label-fill-opacity": baseOpacity,
      "point-label-stroke-color": labelStrokeColor,
      "point-label-stroke-opacity": baseOpacity,
      "point-label-font": labelFontFamily1,
      "point-label-font-size": labelFontSize,
      "point-label-priority": labelPriority,
      "point-label-constraints": labelConstraints,
      "point-label-stroke-width": labelStrokeWidth,
      "line-label-fill-color": labelFillColor,
      "line-label-fill-opacity": baseOpacity,
      "line-label-stroke-color": labelStrokeColor,
      "line-label-stroke-opacity": baseOpacity,
      "line-label-font": labelFontFamily2,
      "line-label-font-size": labelFontSize,
      "line-label-priority": labelPriority,
      "line-label-constraints": labelConstraints,
      "line-label-stroke-width": labelStrokeWidth,
      "area-label-fill-color": labelFillColor,
      "area-label-fill-opacity": baseOpacity,
      "area-label-stroke-color": labelStrokeColor,
      "area-label-stroke-opacity": baseOpacity,
      "area-label-font": labelFontFamily2,
      "area-label-font-size": labelFontSize,
      "area-label-priority": labelPriority,
      "area-label-constraints": labelConstraints,
      "area-label-stroke-width": labelStrokeWidth,
      "point-size": pointSize,
      "point-zindex": zindex,
      "line-zindex": zindex,
      "area-zindex": zindex,
    }
  }
}
