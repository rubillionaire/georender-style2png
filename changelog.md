# 6.1.0

- allow for `label-font` name to be a font family string, which gets mapped into a `labelFontFamily` array that can be returned. the stylesheet stores the font family value as the index into this array.
- adds `labelFontFamily` to the return value of `write`, which is the callback ultimate callback value of this function.