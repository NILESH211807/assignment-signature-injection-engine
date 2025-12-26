export const getRelativeCoords = (x, y, pdfWidth, pdfHeight) => ({
    xPercent: x / pdfWidth,
    yPercent: y / pdfHeight,
});

export const getWidthPercent = (w, h, pdfWidth, pdfHeight) => ({
    widthPercent: w / pdfWidth,
    heightPercent: h / pdfHeight,
});
