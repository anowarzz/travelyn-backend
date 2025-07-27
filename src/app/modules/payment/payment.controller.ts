import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { PaymentService } from "./payment.service";

// Initialize payment
const initPayment = catchAsync(async (req: Request, res: Response) => {
  const bookingId = req.params.bookingId;
  const result = await PaymentService.initPayment(bookingId as string);
  sendResponse(res, {
    statusCode: 201, 
    success: true,
    message: "Payment done successfully",
    data: result,
  });
});

// payment success
const successPayment = catchAsync(async (req: Request, res: Response) => {});

// payment failure
const failPayment = catchAsync(async (req: Request, res: Response) => {});

// cancel payment
const cancelPayment = catchAsync(async (req: Request, res: Response) => {});

export const PaymentController = {
  initPayment,
  successPayment,
  failPayment,
  cancelPayment,
};
