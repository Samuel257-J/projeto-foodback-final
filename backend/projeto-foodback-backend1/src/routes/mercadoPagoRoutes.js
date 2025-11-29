import express from "express";
import { 
  processPayment, 
  createPixPayment, 
  checkPaymentStatus 
} from "../controllers/mercadoPagoController.js";

const router = express.Router();

router.post("/process-payment", processPayment);
router.post("/create-pix", createPixPayment);
router.get("/payment-status/:id", checkPaymentStatus);

export default router;