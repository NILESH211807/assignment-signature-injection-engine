const multer = require('multer');

const storage = multer.memoryStorage();

const filter = (req, file, cb) => {
    if (file.mimetype === "application/pdf") {
        cb(null, true);
    } else {
        cb(new Error("Only PDF files are allowed!"), false);
    }
}

module.exports.upload = multer({
    storage,
    fileFilter: filter,
    limits: {
        fileSize: 1024 * 1024 * 5 // 5MB
    }
});