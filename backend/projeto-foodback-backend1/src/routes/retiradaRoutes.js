import express from "express";
import {
  criarRetirada,
  editarRetirada,
  excluirAgendamento,
  listarRetiradasPorOng,
  verificarAgendamento
} from "../controllers/retiradaController.js";

const router = express.Router();

// Criar agendamento
router.post("/", criarRetirada);

// Editar agendamento
router.put("/:id", editarRetirada);

// Excluir agendamento
router.delete("/:id", excluirAgendamento);

// Listar retiradas por ONG
router.get("/ong/:id_ong", listarRetiradasPorOng);

// Verificar se solicitação possui agendamento
router.get("/verificar/:id_solicitacao", verificarAgendamento);

export default router;
