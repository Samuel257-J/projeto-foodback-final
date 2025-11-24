import { Router } from "express";

const router = Router();

router.get("/teste", (req, res) => {
  res.json({ mensagem: "Backend conectado com sucesso!" });
});

export default router;
