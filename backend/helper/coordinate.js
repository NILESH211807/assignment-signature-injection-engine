// // utils/coordinate.js
// export const getRelativeCoords = (x, y, pdfWidth, pdfHeight) => ({
//     xPercent: x / pdfWidth,
//     yPercent: y / pdfHeight,
// });

// export const getAbsoluteCoords = (xPercent, yPercent, pdfWidth, pdfHeight) => ({
//     x: xPercent * pdfWidth,
//     y: yPercent * pdfHeight,
// });

const pxToPercent = (x, y, pdfWidth, pdfHeight) =>
    ({ xPercent: x / pdfWidth, yPercent: y / pdfHeight });



module.exports = { pxToPercent };