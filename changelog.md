# 6.2.2

- [test] patch: update test to both read tex data in flight, and read from a png, to verify that we can restore and read data the same way we encoded it.
- [package] patch: update fast-png and make explicit that this package is being tested on node 16 and is the baseline support.
- [cmd] patch: update to write out the json that is used for label configuration.

# 6.2.1

- [example] patch: migrate from `example/make-tex` to `example/make-assets` because we add a little label config for `mixmap-georender` to run off of, specifically for defining the order of names of fonts that are stored in the tex.

# 6.2.0

- [read] minor: adds interface for reading zindex values out of the style pixels.

# 6.1.1

- [package] add `@rubenrodriguez/georender-pack` as a dependency instead of dev dependency which is used in `settings`

# 6.1.0

- [package] start `@rubenrodriguez` scope of this package.
- [index] minor: allow for `label-font` name to be a font family string, which gets mapped into a `labelFontFamily` array that can be returned. the stylesheet stores the font family value as the index into this array.
- [index] minor: adds `labelFontFamily` to the return value of `write`, which is the callback ultimate callback value of this function.
- add `settings` to the return value of `write`. it can be useful to know the settings that were used to produce the data, so we can properly index into it.
- [promise] minor: add a promise interface into creating the style texture
- [package] minor: migrate to `@rubenrodriguez/georender-pack/features.json`
- [package] minor: add `brittle` package for testing
- [settings] minor: import features.json to get imageWidth, export zoomCount
- [read] minor: adds interface for reading values out of the style pixels. starting with the opacity values, which are used by `mixmap-georender` to do its `prepare._splitSport`, and all of the label values which can be consumed by `mixmap-georender` and its `tiny-label` implementation.
- [test] adds `read` test to ensure we can properly get values out of the style texture
