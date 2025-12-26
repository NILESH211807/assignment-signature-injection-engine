export const getRelPosition = (x, y, pdfWidth, pdfHeight) => ({
    xPercent: (x / pdfWidth) * 100,
    yPercent: (y / pdfHeight) * 100,
});

export const getRelSize = (w, h, pdfWidth, pdfHeight) => ({
    widthPercent: (w / pdfWidth) * 100,
    heightPercent: (h / pdfHeight) * 100,
});
