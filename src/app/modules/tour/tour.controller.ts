import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { ITour } from "./tour.interface";
import { TourService } from "./tour.service";

/*/ TOURS /*/

// create tour
const createTour = catchAsync(async (req: Request, res: Response) => {
  const payload: ITour = {
    ...req.body,
    images: (req.files as Express.Multer.File[])?.map((file) => file.path),
  };

  const result = await TourService.createTour(payload);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Tour created successfully",
    data: result,
  });
});

// get all tours
const getAllTours = catchAsync(async (req: Request, res: Response) => {
  const query = req.query;
  const result = await TourService.getAllTours(query as Record<string, string>);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Tours retrieved successfully",
    data: result.data,
    meta: result.meta,
  });
});

// get single tour
const getSingleTour = catchAsync(async (req: Request, res: Response) => {
  const slug = req.params.slug;
  const result = await TourService.getSingleTour(slug);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Tour retrieved successfully",
    data: result,
  });
});

// update tour
const updateTour = catchAsync(async (req: Request, res: Response) => {
  const payload: ITour = {
    ...req.body,
    images: (req.files as Express.Multer.File[]).map((file) => file.path),
  };
  const result = await TourService.updateTour(req.params.id, payload);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Tour updated successfully",
    data: result,
  });
});

// delete tour
const deleteTour = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await TourService.deleteTour(id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Tour deleted successfully",
    data: result,
  });
});

/*/ TOUR TYPE /*/

// create tour type
const createTourType = catchAsync(async (req: Request, res: Response) => {
  const { name } = req.body;
  const result = await TourService.createTourType(name);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Tour type created successfully",
    data: result,
  });
});

// get all tour types
const getAllTourTypes = catchAsync(async (req: Request, res: Response) => {
  const query = req.query;
  const result = await TourService.getAllTourTypes(
    query as Record<string, string>
  );
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Tour types retrieved successfully",
    meta: result.meta,
    data: result.data,
  });
});

// get single tour type
const getSingleTourType = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const result = await TourService.getSingleTourType(id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Tour type retrieved successfully",
    data: result,
  });
});

// update tour type
const updateTourType = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name } = req.body;
  const result = await TourService.updateTourType(id, name);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Tour type updated successfully",
    data: result,
  });
});

// delete tour type
const deleteTourType = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await TourService.deleteTourType(id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Tour type deleted successfully",
    data: result,
  });
});

export const TourController = {
  createTour,
  createTourType,
  getAllTourTypes,
  getSingleTourType,
  deleteTourType,
  updateTourType,
  getAllTours,
  getSingleTour,
  updateTour,
  deleteTour,
};
