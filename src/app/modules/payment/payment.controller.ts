import { Request, Response } from "express";
import { envVars } from "../../config/env";
import { catchAsync } from "../../utils/catchAsync";
import { PaymentService } from "./payment.service";

// Initialize payment
// const initPayment = catchAsync(async (req: Request, res: Response) => {
//   const bookingId = req.params.bookingId;
//   const result = await PaymentService.initPayment(bookingId as string);
//   sendResponse(res, {
//     statusCode: 201,
//     success: true,
//     message: "Payment done successfully",
//     data: result,
//   });
// });

// payment success
const successPayment = catchAsync(async (req: Request, res: Response) => {
  const query = req.query as Record<string, string>;

  const result = await PaymentService.successPayment(query);

  if (result.success) {
    res.redirect(
      `${envVars.SSL.SSL_SUCCESS_FRONTEND_URL}?transactionId=${query.transactionId}&message=${result.message}&amount=${query.amount}&status=${query.status}`
    );
  }
});

// payment failure
const failPayment = catchAsync(async (req: Request, res: Response) => {});

// cancel payment
const cancelPayment = catchAsync(async (req: Request, res: Response) => {});

export const PaymentController = {
  // initPayment,
  successPayment,
  failPayment,
  cancelPayment,
};
