const generateHash = require("../utils/hash");
const { modifyPdf } = require("../utils/modifyPdf");
const pdfModel = require("../models/pdf.model");
const { uploadToImageKit } = require("../utils/ImageKit");

// 
module.exports.signPdf = async (req, res) => {
    try {

        const pdfBuffer = req.file.buffer; // PDF FILE
        const images = req.body.fields;

        if (!req.file) {
            return res.status(400).json({
                message: "No file uploaded"
            });
        }

        // before hash
        const beforeHash = generateHash(pdfBuffer);
        const signedPdf = await modifyPdf(pdfBuffer, images);

        // after hash
        const afterHash = generateHash(signedPdf);
        const pdfUrl = await uploadToImageKit(signedPdf);

        const pdf = pdfModel.create({
            beforeHash,
            afterHash,
            cloudFileUrl: pdfUrl
        });

        res.status(200).json({
            message: "Signed successfully",
            url: pdfUrl
        });

    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: err.message || "Internal server error"
        });
    }
}