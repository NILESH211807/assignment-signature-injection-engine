const { PDFDocument, rgb } = require("pdf-lib");

module.exports.embedImage = async function (assets) {

    if (!assets) {
        return res.status(400).send('field is required');
    }
    const {
        imageBase64,
        page,
        pdfDoc,
        pageWidth,
        pageHeight,
        xPercent,
        yPercent,
        widthPercent,
        heightPercent,
    } = assets;

    const base64Data = imageBase64.split(",")[1];

    const imageBytes = Buffer.from(base64Data, "base64");

    const isPng = imageBase64.startsWith("data:image/png");

    const embeddedImage = isPng
        ? await pdfDoc.embedPng(imageBytes)
        : await pdfDoc.embedJpg(imageBytes);


    // percentage to pixel
    const width = (widthPercent / 100) * pageWidth;
    const height = (heightPercent / 100) * pageHeight;
    const x = (xPercent / 100) * pageWidth;

    const y = pageHeight - (yPercent / 100) * pageHeight - height;

    // draw image
    page.drawImage(embeddedImage, {
        x,
        y,
        width,
        height,
    });
};

module.exports.embedText = async function (assets) {
    if (!assets) {
        return res.status(400).send('field is required');
    }

    const {
        value,
        page,
        pageWidth,
        pageHeight,
        xPercent,
        yPercent,
        widthPercent,
        heightPercent,
    } = assets;

    const width = (widthPercent / 100) * pageWidth;
    const height = (heightPercent / 100) * pageHeight;

    const x = (xPercent / 100) * pageWidth;
    const y = pageHeight - (yPercent / 100) * pageHeight - height;

    page.drawText(value, {
        x,
        y,
        size: 12,
        color: rgb(0, 0, 0),
        maxWidth: width,
    });
}