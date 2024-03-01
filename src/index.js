import dotenv from "dotenv";
dotenv.config();
import express from "express";
import multer from "multer";
import s3 from "./s3.js";
import { PutObjectCommand } from "@aws-sdk/client-s3";

const storage = multer.memoryStorage();
const upload = multer({ storage });

const app = express();
app.use(express.json());
const PORT = process.env.PORT || 3000;

app.post("/upload", upload.single("file"), async (req, res) => {
  const uploadedFile = req.file;
  if (!uploadedFile) {
    return res.status(400).json({ error: "No se proporcionó ningún archivo." });
  }

  try {
    await s3.send(
      new PutObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: uploadedFile.originalname,
        Body: uploadedFile.buffer,
      })
    );
    res.json({ message: "Archivo cargado y subido a S3 exitosamente." });
  } catch (error) {
    console.error("Error al subir el archivo a S3:", error);
    res
      .status(500)
      .json({ error: "Error al subir el archivo a S3.", message: error });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 S3 Node Service ready at port:${PORT}`);
});
