// Copied from NodeVibrant
// No idea how this work

function getYiq(rgb: number[]) {
  return (rgb[0] * 299 + rgb[1] * 587 + rgb[2] * 114) / 1000;
}
function bodyTextColor(rgb: number[]) {
  return getYiq(rgb) < 150 ? "#fff" : "#000";
}
function titleTextColor(rgb: number[]) {
  return getYiq(rgb) < 200 ? "#fff" : "#000";
}

// Copied from color-thief
// https://github.com/lokesh/color-thief/blob/fb55143ec66a1d5f9e93f77bab996c96f52cf5e4/src/color-thief-node.js
function createPixelArray(imgData:any,quality:number = 10) : number[][]{
  const pixels = imgData.data;
  const pixelCount = imgData.shape[0]*imgData.shape[1]
  const pixelArray = [];

  for (let i = 0, offset, r, g, b, a; i < pixelCount; i = i + quality) {
      offset = i * 4;
      r = pixels[offset + 0];
      g = pixels[offset + 1];
      b = pixels[offset + 2];
      a = pixels[offset + 3];

      // If pixel is mostly opaque and not white
      if (typeof a === 'undefined' || a >= 125) {
          if (!(r > 250 && g > 250 && b > 250)) {
              pixelArray.push([r, g, b]);
          }
      }
  }
  return pixelArray;
}
export {getYiq, bodyTextColor, titleTextColor,createPixelArray}