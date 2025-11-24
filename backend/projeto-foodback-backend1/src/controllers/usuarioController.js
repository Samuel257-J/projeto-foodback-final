import express from "express";
import OngController from "../controllers/ongController.js";
import EmpresaController from "../controllers/empresaController.js";

const router = express.Router();

// Cadastro público
router.post("/cadastro/ong", OngController.cadastrar);
router.post("/cadastro/empresa", EmpresaController.cadastrar);

export default router;
