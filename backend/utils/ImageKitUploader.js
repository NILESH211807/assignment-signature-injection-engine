const ImagekitConfig = require("../config/imageKitConfig");

const uploadToImageKit = async (pdfBytes) => {
    const result = await ImagekitConfig.upload({
        file: Buffer.from(pdfBytes),
        fileName: `signed_${Date.now()}.pdf`,
        folder: "/signed_pdfs",
        mimeType: "application/pdf",
    });
    return result.url;
};

module.exports = { uploadToImageKit };
