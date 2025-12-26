const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();

const connectDB = require('./config/db');
const { errorHandler } = require('./middlewares/error.handler');

const pdfRouter = require('./routers/pdf.router');


const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
}))


// middlewares
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: false }));
app.use("/uploads", express.static("uploads"));


// routers 
app.use('/api', pdfRouter)

app.get('/', (req, res) => {
    res.send('Hello World!');
});


// Error Handler
app.use(errorHandler);


connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}).catch((err) => {
    console.log(err);
});