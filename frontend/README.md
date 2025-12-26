# Signature Injection Engine

A lightweight app to place signatures and text into PDF files from a browser, then sign/upload the modified PDF to cloud storage and record hashes in a database.

## Quick Overview
- Frontend: React + Vite UI to load a PDF, place/resize draggable signature or text fields, and send a signing request.
- Backend: Express API that embeds images/text into the PDF using `pdf-lib`, computes before/after hashes, uploads the result to ImageKit, and stores metadata in MongoDB.

## Features
- Drag and drop or draw signatures and place text boxes on PDF pages.
- Convert signature images (base64) and text into positioned assets inside the PDF.
- Server-side PDF modification using `pdf-lib` and upload to ImageKit.
- Hashing of PDF content before and after modification for verification.

## Tech Stack

- **Frontend**
	- Framework: React 19 with Vite (dev server and build)
	- Styling: Tailwind CSS (configured in project)
	- Key libraries: `react-pdf`, `react-signature-canvas`, `react-router-dom`, `axios`, `react-hot-toast`, `react-icons`, `uuid`
	- Scripts: `dev` (vite), `build`, `preview`, `lint`

- **Backend**
	- Runtime: Node.js + Express
	- DB: MongoDB (via `mongoose`)
	- File handling: `multer` for multipart/form-data
	- PDF manipulation: `pdf-lib`
	- Uploads: ImageKit (`@imagekit/nodejs` / `imagekit`)
	- Utilities: `cors`, `dotenv`, `crypto`
	- Scripts: `start` (node app.js), `dev` (nodemon)

## API (server)
- POST `/api/sign-pdf`
	- Description: Accepts a PDF file and `fields` describing what to embed (images/text and their positions). Returns a public URL to the signed PDF.
	- Content-type: `multipart/form-data`
	- Fields:
		- `pdfFile` — the PDF file (form file field)
		- `fields` — a JSON string or form value describing embedding fields. Example structure (send as a JSON string):

```json
[{
	"type": "image",         
	"page": 0,
	"imageBase64": "data:image/png;base64,...",
	"xPercent": 10,
	"yPercent": 80,
	"widthPercent": 20,
	"heightPercent": 10
},
{
	"type": "text",
	"page": 0,
	"value": "Signed by Nilesh",
	"xPercent": 30,
	"yPercent": 50,
	"widthPercent": 40,
	"heightPercent": 8
}]
```

Response success example:
```json
{ "message": "Signed successfully", "url": "https://.../signed_...pdf" }
```

## Project structure (high level)
- `backend/`
	- `app.js` — server entry, routes and middleware setup
	- `controllers/pdf.controller.js` — main signPdf handler
	- `routers/pdf.router.js` — route definitions (POST `/sign-pdf`)
	- `config/db.js` and `config/imageKit.js` — DB and ImageKit config
	- `utils/modifyPdf.js`, `helper/drawInPdf.js` — code that embeds images/text into PDFs
- `frontend/`
	- `src/` — React app source
	- `src/components/` — UI components (drag, draw signature, toolbar, viewer)
	- `package.json` — frontend dependencies and scripts

## Required environment variables (backend)
- `MONGO_URI` — MongoDB connection string
- `IMAGEKIT_PUBLIC_KEY` — ImageKit public key
- `IMAGEKIT_PRIVATE_KEY` — ImageKit private key
- `IMAGEKIT_URL_ENDPOINT` — ImageKit URL endpoint
- `PORT` — optional server port (default 5000)

## Setup & Run

Backend:
```bash
cd backend
npm install
# create a .env with MONGO_URI, IMAGEKIT_* keys, PORT (optional)
npm run dev    # uses nodemon if available or `npm start` to run once
```

Frontend:
```bash
cd frontend
npm install
npm run dev    # starts Vite dev server
npm run build  # build for production
```

## Development notes
- Fields use percentage coordinates so PDFs of different sizes are handled consistently. Backend helper functions convert percentage values into absolute coordinates before drawing.
- Image fields expect a data URL (base64) string like `data:image/png;base64,...`.
- The backend computes a hash before/after modification using the project `utils/hash.js` and stores metadata in the DB via `models/pdf.model.js`.

## Useful files
- `backend/app.js`
- `backend/controllers/pdf.controller.js`
- `backend/routers/pdf.router.js`
- `backend/helper/drawInPdf.js`
- `backend/utils/ImageKit.js`
- `frontend/src/components/DragAndResize.jsx`
- `frontend/src/pages/PdfViewer.jsx`

## Next steps / Suggestions
- Add OpenAPI / Postman collection for the API.
- Add frontend validation to ensure `fields` are serialized correctly before sending.
- Add tests for `modifyPdf` logic and integration tests for the `/sign-pdf` endpoint.

---

If you'd like, I can also update the root `readme.md` to reference this frontend README and add a short backend README. Want me to do that now?

