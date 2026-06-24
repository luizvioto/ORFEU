import express from "express";
import cifraController from "../controllers/cifra.controller.js";
import authController from '../controllers/auth.controller.js';
import { upload } from '../config/upload.js';
import userController from '../controllers/user.controller.js';
import audioController from '../controllers/audio.controller.js';

const router = express.Router();

//publicas
router.post("/signup", authController.register);
router.post("/signin", authController.login);

//bloqueio
router.use(authController.validate);

//privadas
router.put("/perfil", upload.single('avatar'), userController.updateProfile);
router.get("/perfil", userController.getProfile);

router.get("/cifras", cifraController.getAll);
router.get("/cifras/:id", cifraController.getById);
router.post("/cifras", cifraController.create);
router.put("/cifras/:id", cifraController.update);
router.delete("/cifras/:id", cifraController.deleteCifra);

router.get("/audios", audioController.listarAudios);
router.post("/audios", upload.single('audio'), audioController.salvarAudio);
router.put("/audios/:id", audioController.atualizarTituloAudio);
router.delete("/audios/:id", audioController.deletarAudio);

export default router;
