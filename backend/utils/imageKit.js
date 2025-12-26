const imagekitConfig = require("../config/imageKit");

const uploadToImageKit = async (pdfBytes) => {
    const result = await imagekitConfig.upload({
        file: Buffer.from(pdfBytes),
        fileName: `signed_${Date.now()}.pdf`,
        folder: "/signed_pdfs",
        mimeType: "application/pdf",
    });
    return result.url;
};

module.exports = { uploadToImageKit };
