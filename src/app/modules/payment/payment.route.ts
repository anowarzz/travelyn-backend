import express from "express";
import { PaymentController } from "./payment.controller";

const router = express.Router();

// Initialize payment
// router.post("/init-payment/:bookingId", PaymentController.initPayment);

// Payment success
router.post("/success", PaymentController.successPayment);

// Payment failure
router.post("/fail", PaymentController.failPayment);

// Cancel payment
router.post("/cancel", PaymentController.cancelPayment);

export const PaymentRoutes = router;
