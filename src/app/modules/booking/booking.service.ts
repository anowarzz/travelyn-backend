/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import httpStatus from "http-status-codes";
import AppError from "../../errorHelpers/appError";
import { PAYMENT_STATUS } from "../payment/payment.interface";
import { Payment } from "../payment/payment.model";
import { ISSLCommerz } from "../sslCommerz/sslCommerz.interface";
import { SSLService } from "../sslCommerz/sslCommerz.service";
import { Tour } from "../tour/tour.model";
import { User } from "../user/user.model";
import { BOOKING_STATUS, IBooking } from "./booking.interface";
import { Booking } from "./booking.model";

// generate a unique transaction ID
const getTransactionId = () => {
  return `tran_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
};

// create a booking
const createBooking = async (payload: Partial<IBooking>, userId: string) => {
  const transactionId = getTransactionId();

  const session = await Booking.startSession();
  session.startTransaction();

  try {
    const user = await User.findById(userId);

    const tour = await Tour.findById(payload.tour).select("costFrom");

    if (!tour?.costFrom) {
      throw new AppError(httpStatus.BAD_REQUEST, "No Tour Cost Found");
    }

    const amount = Number(tour.costFrom) * Number(payload.guestCount!);

    if (!user?.phone || !user.address) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "Please Update your phone and address before booking a tour"
      );
    }

    const booking = await Booking.create(
      [
        {
          user: userId,
          status: BOOKING_STATUS.PENDING,
          ...payload,
        },
      ],
      { session }
    );

    const payment = await Payment.create(
      [
        {
          booking: booking[0].id,
          status: PAYMENT_STATUS.UNPAID,
          transactionId: transactionId,
          amount: amount,
        },
      ],
      { session }
    );

    const updatedBooking = await Booking.findByIdAndUpdate(
      booking[0].id,
      {
        payment: payment[0]._id,
      },
      { new: true, runValidators: true, session }
    )
      .populate("user", "name email phone address")
      .populate("tour", "title costFrom")
      .populate("payment");

    const userAddress = (updatedBooking?.user as any).address;
    const userEmail = (updatedBooking?.user as any).email;
    const userPhoneNumber = (updatedBooking?.user as any).phone;
    const userName = (updatedBooking?.user as any).name;

    const sslPayload: ISSLCommerz = {
      address: userAddress,
      email: userEmail,
      phoneNumber: userPhoneNumber,
      name: userName,
      amount: amount,
      transactionId: transactionId,
    };

    const sslPayment = await SSLService.sslPaymentInit(sslPayload);

    await session.commitTransaction();
    session.endSession();

    return {
      paymentUrl: sslPayment.GatewayPageURL,
      booking: updatedBooking,
    };
  }
   catch (err: any) {
    await session.abortTransaction();
    session.endSession();
    throw err;
  }
};

// get user bookings
const getUserBookings = async () => {
  return {};
};

// get single booking by bookingId
const getBookingById = async () => {
  return {};
};

// update booking status
const updateBookingStatus = async () => {
  return {};
};

// get all bookings
const getAllBookings = async () => {
  return {};
};

export const BookingService = {
  createBooking,
  getUserBookings,
  getBookingById,
  updateBookingStatus,
  getAllBookings,
};
