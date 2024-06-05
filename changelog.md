# 7.0.0

- allow for `label-font` name to be a font family string, which gets mapped into a `labelFontFamily` array that can be returned. the stylesheet stores the font family value as the index into this array.
- adds `labelFontFamily` to the return value of `write`, which is the callback ultimate callback value of this function.
- breaking change: update default `{,point-,line-,area-}label-font` to have a value of `sans-serif` instead of `0`. this aligns with `tiny-label` usage, which looks for a font-family value that can be rendered in the browser. the `label-font` value gets turned into an integer that can be consumed by `tiny-label` when paired with the output of the root export function here.
