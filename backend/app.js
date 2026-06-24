import express from "express";
import cors from "cors";
import './models/associations.js'
import apiRoutes from "./routes/api.routes.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));
app.use(apiRoutes);

app.listen(3000, () => console.log("Servidor do ORFEU iniciado na porta 3000"));
