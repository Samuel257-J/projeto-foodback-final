import express from "express";
import UsuarioController from "../controllers/usuarioController.js";

const router = express.Router();

router.post("/usuarios", UsuarioController.cadastrar);

export default router;
