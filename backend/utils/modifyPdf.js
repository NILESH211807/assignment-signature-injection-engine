const { PDFDocument } = require('pdf-lib');

module.exports.modifyPdf = async (pdfBytes, images) => {
    // Load PDF
    const pdfDoc = await PDFDocument.load(pdfBytes);
    const pages = pdfDoc.getPages();

    // Parse images if string
    if (typeof images === "string") {
        images = JSON.parse(images);
    }

    for (const image of images) {
        const {
            imageBase64,
            pageNumber,
            xPercent,
            yPercent,
            widthPercent,
            heightPercent,
        } = image;

        const page = pages[pageNumber - 1];
        if (!page) continue;

        const pageWidth = page.getWidth();
        const pageHeight = page.getHeight();

        const base64Data = imageBase64.split(",")[1];
        const imageBytes = Buffer.from(base64Data, "base64");

        const isPng = imageBase64.startsWith("data:image/png");
        // Embed image
        const embeddedImage = isPng
            ? await pdfDoc.embedPng(imageBytes)
            : await pdfDoc.embedJpg(imageBytes);

        const width = widthPercent * pageWidth;
        const height = heightPercent * pageHeight;
        const x = xPercent * pageWidth;

        const y = pageHeight - (yPercent * pageHeight) - height;

        page.drawImage(embeddedImage, {
            x,
            y,
            width,
            height,
        });
    }

    const signedPdf = await pdfDoc.save();

    return signedPdf;
};