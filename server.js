const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ---------- PATHS ----------
const publicPath = path.join(__dirname, "public");
const uploadPath = path.join(__dirname, "uploads");

// ---------- ENSURE UPLOAD FOLDER EXISTS ----------
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath);
}

// ---------- STATIC FILES ----------
app.use(express.static(publicPath));
app.use("/uploads", express.static(uploadPath));

// ---------- IN-MEMORY DATA ----------
let filesData = [];

// ---------- MULTER CONFIG ----------
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadPath); // ABSOLUTE PATH (IMPORTANT)
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "_" + file.originalname);
  }
});

const upload = multer({ storage });

// ---------- ROUTES ----------

// Home route (fixes Cannot GET /)
app.get("/", (req, res) => {
  res.sendFile(path.join(publicPath, "index.html"));
});

// Upload API
app.post("/upload", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  const fileInfo = {
    id: filesData.length + 1,
    storedName: req.file.filename,
    originalName: req.file.originalname,
    dateTime: new Date().toLocaleString(),
    version: "v1.0",
    status: "Uploaded"
  };

  filesData.push(fileInfo);
  res.json(fileInfo);
});

// Get all uploaded files
app.get("/files", (req, res) => {
  res.json(filesData);
});

// Download file
app.get("/download/:filename", (req, res) => {
  const filePath = path.join(uploadPath, req.params.filename);

  if (!fs.existsSync(filePath)) {
    return res.status(404).send("File not found");
  }

  res.download(filePath);
});

// ---------- START SERVER ----------
app.listen(PORT, () => {
  console.log("Server running at http://localhost:" + PORT);
});
