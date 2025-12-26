const { PDFDocument } = require('pdf-lib');
const { embedText, embedImage } = require('../helper/drawInPdf');

module.exports.modifyPdf = async (pdfBytes, fields) => {
    // Load PDF
    const pdfDoc = await PDFDocument.load(pdfBytes);
    const pages = pdfDoc.getPages();

    // Parse data if string
    if (typeof fields === "string") {
        fields = JSON.parse(fields);
    }

    for (const field of fields) {
        const { pageNumber, type } = field;

        const page = pages[pageNumber - 1];
        if (!page) continue;

        const pageWidth = page.getWidth();
        const pageHeight = page.getHeight();

        if (type === "signature") {
            await embedImage({ ...field, page, pageWidth, pageHeight, pdfDoc });
        } else if (type === "textbox") {
            await embedText({ ...field, page, pageWidth, pageHeight })
        }
    }

    const signedPdf = await pdfDoc.save();

    return signedPdf;
};