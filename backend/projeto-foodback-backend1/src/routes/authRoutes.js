import express from "express";
import AuthController from "../controllers/authController.js";

const router = express.Router();

router.post("/login", AuthController.login);
router.post("/forgot-password", AuthController.forgotPassword);

export default router;