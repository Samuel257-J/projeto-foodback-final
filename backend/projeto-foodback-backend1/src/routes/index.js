import express from "express";

import empresaRoutes from "./empresaRoutes.js";
import ongRoutes from "./ongRoutes.js";

const router = express.Router();

router.use("/empresa", empresaRoutes);
router.use("/ong", ongRoutes);

export default router;
